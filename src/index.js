let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //fetch Andy's toys- add json toy elements to dom as cards
  fetch("http://localhost:3000/toys")
  .then((resp) => resp.json())
  .then((json) => {
    json.forEach(element => {
      createCard(element);
    });
  })

  //creates toy card and adds to dom from the toy object it's given
  function createCard(toy) {
    const card = document.createElement('div');
    card.className = "card";
    const name = document.createElement("h2");
    name.textContent = toy.name;
    const image = document.createElement("img");
    image.src = toy.image;
    image.alt = toy.name;
    image.className = "toy-avatar";
    const likes = document.createElement("p");
    likes.textContent = toy.likes + " Likes";
    const button = document.createElement("button")
    button.id = toy.id;
    button.className = "like-btn";
    button.textContent = "Like ❤️"
    button.addEventListener("click", () => {
      const likes = button.parentNode.querySelector("p");
      const likesNum = likes.textContent.split(" ")[0];
      likesUpdater(button, likesNum);
    })
    card.append(name, image, likes, button);
    toyCollection.appendChild(card)
  }

  //add a new toy
  //get info from form to create object
  const form = document.querySelector(".add-toy-form");
  form.addEventListener("submit",(e) => {
    e.preventDefault();
    const toy = {};
    toy.name = e.target.name.value;
    toy.image = e.target.image.value;
    toy.likes = 0;
    addToDb(toy);
  })
  //pass object to fetch to add to DB and DOM
  function addToDb(obj) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(obj)
    })
    .then((resp) => resp.json())
    .then((json) => {
      createCard(json)
    })
  }

  //update likes in DOM and in DB
  function likesUpdater(button,likes) {
    fetch(`http://localhost:3000/toys/${button.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": ++likes
      })
    })
    .then((resp) => resp.json())
    .then((json) => {
      const likes = button.parentNode.querySelector("p")
      likes.textContent = json.likes + " likes";
    })
  }
});
