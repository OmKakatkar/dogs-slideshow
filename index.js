let timer;
let deleteFirstPhotoDelay;

const fetchDogsData = async () => {
  try {
    const res = await fetch(`https://dog.ceo/api/breeds/list/all`);
    const data = await res.json();
    createBreedList(data.message);
  } catch (e) {
    console.log("There was a problem fetching the breed list.")
  }
};

fetchDogsData();

function createBreedList(breedList) {
  document.getElementById("breeds").innerHTML = `
    <select onchange='loadByBreed(this.value)'>
        <option>Choose a dog breed</option>
        ${Object.keys(breedList)
          .map((breed) => `<option>${breed}</option>`)
          .join("")}
    </select>
    `;
}

async function loadByBreed(breed) {
  if (breed !== "Choose a dog breed") {
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
    const data = await res.json();
    console.log(data);
    showOutput(data.message);
  }
}

function showOutput(images) {
  let currentImage = 0;
  clearInterval(timer);
  clearTimeout(deleteFirstPhotoDelay);

  if (images.length > 1) {
    document.getElementById("slideshow").innerHTML = `
  <div class="slides" style="background-image: url('${images[0]}')"></div>
  <div class="slides" style="background-image: url('${images[1]}')"></div>
  `;

    currentImage += 2;
    if (images.length === 2) currentImage = 0;
    timer = setInterval(nextSlide, 3000);
  } else {
    document.getElementById("slideshow").innerHTML = `
  <div class="slides" style="background-image: url('${images[0]}')"></div>
  <div class="slides"></div>
  `;
  }

  function nextSlide() {
    document
      .getElementById("slideshow")
      .insertAdjacentHTML(
        "beforeend",
        `<div class="slides" style="background-image: url('${images[currentImage]}')"></div>`
      );
    deleteFirstPhotoDelay = setTimeout(
      () => document.querySelector(".slides").remove(),
      1000
    );
    if (currentImage + 1 >= images.length) {
      currentImage = 0;
    } else {
      currentImage++;
    }
  }
}
