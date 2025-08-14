const allBreedsUrl = "https://dog.ceo/api/breeds/list/all";
let fullBreedData = [];

const fetchAndDisplayList = async () => {
  try {
    const res = await fetch(allBreedsUrl);
    const data = await res.json();
    const breeds = data.message;

    for (const breed in breeds) {
      if (breeds[breed].length > 0) {
        breeds[breed].forEach(sub => {
          fullBreedData.push({ label: `${sub} ${breed}`, value: `${breed}/${sub}` });
        });
      } else {
        fullBreedData.push({ label: breed, value: breed });
      }
    }

    // Sort alphabetically by label
    fullBreedData.sort((a, b) => a.label.localeCompare(b.label));

    const container = document.getElementById("fullBreedList");
    const ul = document.createElement("ul");

    const dropdown = document.getElementById("breedDropdown");
    dropdown.innerHTML = '<option value="">Select a breed</option>';

    fullBreedData.forEach(b => {
      // Desktop list
      const li = document.createElement("li");
      li.textContent = b.label;
      li.style.cursor = "pointer";
      li.style.textTransform = "capitalize";
      li.addEventListener("click", () => loadAllImages(b.value, b.label));
      ul.appendChild(li);

      // Mobile dropdown
      const option = document.createElement("option");
      option.value = b.value;
      option.textContent = b.label;
      dropdown.appendChild(option);
    });

    container.appendChild(ul);

    // Dropdown change event
    dropdown.addEventListener("change", (e) => {
      const selected = dropdown.value;
      if (!selected) return;
      const label = dropdown.options[dropdown.selectedIndex].text;
      loadAllImages(selected, label);
    });
  } catch (err) {
    console.error("Error loading breeds:", err);
  }
};

const loadAllImages = async (breedValue, label) => {
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${breedValue}/images`);
    const data = await response.json();

    const container = document.getElementById("dogImage");
    container.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = label;
    heading.style.textTransform = "capitalize";
    container.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "dog-gallery";

    data.message.forEach(imgUrl => {
      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = label;
      img.className = "dog-photo";
      grid.appendChild(img);
    });

    container.appendChild(grid);
  } catch (error) {
    console.error("Error loading breed images:", error);
  }
};

fetchAndDisplayList();
