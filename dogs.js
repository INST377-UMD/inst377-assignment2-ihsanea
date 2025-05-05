document.addEventListener("DOMContentLoaded", () => {
    loadRandomDogs();
    loadDogBreeds();
  
    if (window.annyang) {
      const commands = {
        'load dog breed *breed': (breed) => {
          const btn = document.querySelector(`button[data-breed="${breed.toLowerCase()}"]`);
          if (btn) btn.click();
        }
      };
      annyang.addCommands(commands);
    }
  });
  
  function loadRandomDogs() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then(res => res.json())
      .then(data => {
        const carousel = document.getElementById("carousel");
        data.message.forEach(imgUrl => {
          const img = document.createElement("img");
          img.src = imgUrl;
          img.style.height = "200px";
          img.style.margin = "5px";
          carousel.appendChild(img);
        });
        new Slider('#carousel');
      })
      .catch(err => console.log("Error loading dog images:", err));
  }
  
  function loadDogBreeds() {
    fetch("https://dog.ceo/api/breeds/list/all")
      .then(res => res.json())
      .then(data => {
        const breeds = Object.keys(data.message);
        const breedButtons = document.getElementById("breedButtons");
  
        breeds.forEach(breed => {
          const btn = document.createElement("button");
          btn.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
          btn.setAttribute("data-breed", breed.toLowerCase());
          btn.style.margin = "5px";
          btn.className = "breed-btn";
          btn.addEventListener("click", () => showBreedInfo(breed));
          breedButtons.appendChild(btn);
        });
      });
  }
  
  function showBreedInfo(breed) {
    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${breed}`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          alert("Breed not found or no info available.");
          return;
        }
  
        const breedData = data[0];
        const infoDiv = document.getElementById("breedInfo");
  
        infoDiv.innerHTML = `
          <h3>${breedData.name}</h3>
          <p>${breedData.temperament || "No description available."}</p>
          <p>Life span: ${breedData.life_span}</p>
        `;
  
        infoDiv.style.display = "block";
      })
      .catch(err => {
        console.log("Error loading breed info:", err);
      });
  }  
