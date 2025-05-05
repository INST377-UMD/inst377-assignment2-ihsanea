document.addEventListener("DOMContentLoaded", function () {
    const quoteContainer = document.getElementById("quoteContainer");
  
    // Random quote
    fetch("https://zenquotes.io/api/random")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          quoteContainer.textContent = `"${data[0].q}" - ${data[0].a}`;
        } else {
          quoteContainer.textContent = "Quote failed to load.";
        }
      })
      .catch(() => {
        quoteContainer.textContent = "Quote failed to load.";
      });
  
    // Button nav
    const stocksBtn = document.getElementById("stocksBtn");
    const dogsBtn = document.getElementById("dogsBtn");
  
    if (stocksBtn) {
      stocksBtn.addEventListener("click", () => {
        window.location.href = "stocks.html";
      });
    }
  
    if (dogsBtn) {
      dogsBtn.addEventListener("click", () => {
        window.location.href = "dogs.html";
      });
    }
  
    // Annyang voice commands
    if (window.annyang) {
      const commands = {
        'hello': () => {
          alert("Hello World");
        },
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
          const p = page.toLowerCase();
          if (p.includes("stock")) {
            window.location.href = "stocks.html";
          } else if (p.includes("dog")) {
            window.location.href = "dogs.html";
          } else if (p.includes("home")) {
            window.location.href = "index.html";
          }
        }
      };
      annyang.addCommands(commands);
    }
  });  