import * as Carousel from "./Carousel.js";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_suoxq9QfqaF06uumQ99CD68GyhwlzHLi9f8Wi660NiPuU5xLh2UigCvkHRAx0dKy";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
async function initialLoad() {
  try {
    const response = await fetch("https://api.thecatapi.com/v1/breeds", {
      headers: { "x-api-key": API_KEY },
    });
    const breeds = await response.json();
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.append(option);
    });
    breedSelect.addEventListener("change", breedSelectHandler);
    breedSelectHandler(); // Load initial breed
  } catch (error) {
    console.error("Error fetching breed data:", error);
  }
}

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Each new selection should clear, re-populate, and restart the Carousel.
 */
async function breedSelectHandler() {
  const breedId = breedSelect.value;
  if (!breedId) return;

  progressBar.style.width = "0%";
  progressBar.style.width = "100%";

  try {
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=10`,
      {
        headers: { "x-api-key": API_KEY },
      }
    );
    const images = await response.json();

    // Clear the carousel and infoDump
    Carousel.clear();
    infoDump.innerHTML = "";

    // Populate the carousel with new images
    images.forEach((image) => {
      const carouselItem = Carousel.createCarouselItem(
        image.url,
        image.breeds[0].name,
        image.id
      );
      Carousel.appendCarousel(carouselItem);
    });

    // Populate the infoDump with breed information
    const breedInfo = images[0].breeds[0];
    const breedInfoDiv = document.createElement("div");
    breedInfoDiv.innerHTML = `
      <h2>${breedInfo.name}</h2>
      <p>${breedInfo.description}</p>
      <p><strong>Temperament:</strong> ${breedInfo.temperament}</p>
      <p><strong>Origin:</strong> ${breedInfo.origin}</p>
      <p><strong>Life span:</strong> ${breedInfo.life_span} years</p>
    `;
    infoDump.append(breedInfoDiv);

    // Restart the carousel
    Carousel.start();
  } catch (error) {
    console.error("Error fetching breed images:", error);
  } finally {
    progressBar.style.width = "0%";
  }
}

// Execute the initial load function immediately
initialLoad();
