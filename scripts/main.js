document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.menu').classList.toggle('show');
});

const allBreeds = "https://dog.ceo/api/breeds/list/all";
const breedSelect = document.getElementById('breed-select');
const breedSearch = document.getElementById('breedSearch');
const searchButton = document.getElementById('searchButton');
const suggestionList = document.getElementById('suggestionList');
let imageCount = Number(localStorage.getItem('dogImageCount')) || 0;
let allBreedOptions = [];

// Collect all breed options (unsorted)
const populateBreedArray = (breeds) => {
    for (const breed in breeds) {
        if (breeds[breed].length > 0) {
            breeds[breed].forEach(sub => {
                const fullBreed = `${breed}/${sub}`;
                const label = `${sub} ${breed}`;
                allBreedOptions.push({ label, value: fullBreed });
            });
        } else {
            allBreedOptions.push({ label: breed, value: breed });
        }
    }
};

// Populate select box AFTER sorting alphabetically
const populateBreedSelect = () => {
    // Sort alphabetically by label
    allBreedOptions.sort((a, b) => a.label.localeCompare(b.label));

    allBreedOptions.forEach(breed => {
        breedSelect.appendChild(new Option(breed.label, breed.value));
    });
};

const fetchDogsie = async () => {
    try {
        const response = await fetch(allBreeds);
        const data = await response.json();
        const breeds = data.message;

        breedSelect.innerHTML = '<option value="">Select a breed</option>';
        allBreedOptions = [];

        populateBreedArray(breeds);
        populateBreedSelect();  // Add them to the DOM in alphabetical order

        const autoLoad = localStorage.getItem('autoLoadBreed');
        if (autoLoad) {
            localStorage.removeItem('autoLoadBreed');
            loadBreedImageDirect(autoLoad, autoLoad);
        }
    } catch (error) {
        console.error("Error fetching breeds:", error);
    }
};

const loadBreedImageDirect = async (breedValue, label) => {
    if (!breedValue) return;

    imageCount++;
    localStorage.setItem('dogImageCount', imageCount);

    if (imageCount > 9) {
        localStorage.setItem('dogImageCount', 0);
        localStorage.setItem('autoLoadBreed', breedValue);
        location.reload();
        return;
    }

    try {
        const dogList = document.getElementById("dogList");
        dogList.style.display = "grid";

        const response = await fetch(`https://dog.ceo/api/breed/${breedValue}/images/random`);
        const data = await response.json();

        const image = document.createElement('img');
        const h3 = document.createElement('h3');
        image.src = data.message;
        image.alt = label;

        h3.textContent = label;
        h3.style.textTransform = "capitalize";

        const card1 = document.createElement("div");
        card1.className = "card1";
        card1.appendChild(image);

        const card2 = document.createElement("div");
        card2.className = "card2";
        card2.appendChild(h3);

        card1.appendChild(card2);
        dogList.appendChild(card1);
    } catch (error) {
        console.error("Error fetching dog image:", error);
    }
};

const loadFullDogBreedList = () => {
    const dogList = document.getElementById("dogList");
    dogList.innerHTML = "";
    dogList.style.display = "block";

    allBreedOptions.forEach(breed => {
        const item = document.createElement("div");
        item.textContent = breed.label;
        item.style.padding = "8px 0";
        item.style.textTransform = "capitalize";
        dogList.appendChild(item);
    });
};

// Select-based loading
const loadBreedImage = async () => {
    const selected = breedSelect.value;
    const label = breedSelect.options[breedSelect.selectedIndex].text;
    if (!selected) return;

    loadBreedImageDirect(selected, label);
};

// Search input live suggestion
breedSearch.addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    suggestionList.innerHTML = '';

    if (!filter) {
        suggestionList.style.display = 'none';
        return;
    }

    // Match ANY part of the label
    const matches = allBreedOptions.filter(breed =>
        breed.label.toLowerCase().includes(filter)
    );

    if (matches.length === 0) {
        suggestionList.style.display = 'none';
        return;
    }

    matches.forEach(match => {
        const div = document.createElement('div');
        div.textContent = match.label;
        div.classList.add('suggestion-item');
        div.addEventListener('click', () => {
            suggestionList.style.display = 'none';
            breedSearch.value = '';
            loadBreedImageDirect(match.value, match.label);
        });
        suggestionList.appendChild(div);
    });

    suggestionList.style.display = 'block';
});

// Hide suggestions if you click outside
document.addEventListener('click', function (e) {
    if (!document.querySelector('.search-wrapper').contains(e.target)) {
        suggestionList.style.display = 'none';
    }
});

// Search button click
searchButton.addEventListener('click', () => {
    const filter = breedSearch.value.toLowerCase();
    const match = allBreedOptions.find(b =>
        b.label.toLowerCase() === filter
    );
    if (match) {
        loadBreedImageDirect(match.value, match.label);
        breedSearch.value = '';
    } else {
        alert('No matching breed found.');
    }
});

// Enter key triggers search
breedSearch.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

document.getElementById('showDogButton').addEventListener('click', loadBreedImage);
document.getElementById("goToDogList").addEventListener("click", () => {
    window.open("dog-list.html", "_blank");
});

fetchDogsie();
