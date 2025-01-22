const dogImage = document.getElementById("dog-image");
const userPhoto = document.getElementById("user-photo");
const userName = document.getElementById("user-name");
const adviceText = document.getElementById("advice");
const resultText = document.getElementById("result");
const nextButton = document.getElementById("next-btn");

const buttons = [
  document.getElementById("option1"),
  document.getElementById("option2"),
  document.getElementById("option3"),
];

let correctBreed = "";


async function fetchDog() {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();
  const breed = data.message.split("/")[4];
  return { image: data.message, breed };
}


async function fetchUser() {
  const response = await fetch("https://randomuser.me/api/");
  const data = await response.json();
  const user = data.results[0];
  return {
    name: `${user.name.first} ${user.name.last}`,
    photo: user.picture.medium,
  };
}


async function fetchAdvice() {
  const response = await fetch("https://api.adviceslip.com/advice");
  const data = await response.json();
  return data.slip.advice;
}


async function setupGame() {
  resultText.textContent = "";
  nextButton.style.display = "none";

 
  const dogData = await fetchDog();
  const userData = await fetchUser();
  const advice = await fetchAdvice();

  correctBreed = dogData.breed;
  dogImage.src = dogData.image;

  userPhoto.src = userData.photo;
  userName.textContent = userData.name;
  adviceText.textContent = `"${advice}"`;


  const allBreedsResponse = await fetch("https://dog.ceo/api/breeds/list/all");
  const allBreedsData = await allBreedsResponse.json();
  const allBreeds = Object.keys(allBreedsData.message);


  const incorrectBreeds = allBreeds
    .filter((breed) => breed !== correctBreed)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  const options = [correctBreed, ...incorrectBreeds].sort(() => Math.random() - 0.5);

  buttons.forEach((button, index) => {
    button.textContent = options[index];
    button.disabled = false;
    button.style.backgroundColor = "#3498db";
    button.onclick = () => handleGuess(options[index]);
  });
}


function handleGuess(selectedBreed) {
  if (selectedBreed === correctBreed) {
    resultText.textContent = "Correct! 🎉";
    resultText.style.color = "green";
  } else {
    resultText.textContent = `Wrong! The correct answer was ${correctBreed}. 😢`;
    resultText.style.color = "red";
  }

  buttons.forEach((button) => (button.disabled = true));
  nextButton.style.display = "inline-block";
}


nextButton.addEventListener("click", setupGame);


setupGame();
