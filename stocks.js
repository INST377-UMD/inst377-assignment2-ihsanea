const apiKey = 'vdF1PHCjTxwfpOAXduBM6qrvIP7BSZ99'; // Your real API key

document.addEventListener("DOMContentLoaded", () => {
  const tickerInput = document.getElementById("tickerInput");
  const rangeSelect = document.getElementById("rangeSelect");
  const getStockBtn = document.getElementById("getStockBtn");

  getStockBtn.addEventListener("click", () => {
    const ticker = tickerInput.value.toUpperCase();
    const days = parseInt(rangeSelect.value);
    if (ticker) {
      getStockData(ticker, days);
    }
  });

  if (window.annyang) {
    const stockCommands = {
      'lookup *ticker': (ticker) => {
        const cleanTicker = ticker.toUpperCase();
        tickerInput.value = cleanTicker;
        getStockData(cleanTicker, 30);
      }
    };
    annyang.addCommands(stockCommands);
  }

  loadRedditStocks();
});

async function getStockData(ticker, days) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const from = startDate.toISOString().split("T")[0];
  const to = endDate.toISOString().split("T")[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("No stock data found. Try a different ticker.");
      return;
    }

    const labels = data.results.map(item => {
      const date = new Date(item.t);
      return `${date.getMonth()+1}/${date.getDate()}`;
    });

    const prices = data.results.map(item => item.c);

    const ctx = document.getElementById("stockChart").getContext("2d");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${ticker} Price`,
          data: prices,
          borderColor: '#0077cc',
          borderWidth: 2,
          fill: false
        }]
      }
    });

  } catch (err) {
    console.log("Error:", err);
    alert("Error getting stock data.");
  }
}

async function loadRedditStocks() {
  const tableBody = document.querySelector("#redditStocks tbody");

  try {
    const res = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
    const data = await res.json();

    tableBody.innerHTML = "";

    data.slice(0, 5).forEach(stock => {
      const row = document.createElement("tr");

      const tickerCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
      link.target = "_blank";
      link.textContent = stock.ticker;
      tickerCell.appendChild(link);

      const commentsCell = document.createElement("td");
      commentsCell.textContent = stock.no_of_comments;

      const sentimentCell = document.createElement("td");
      sentimentCell.textContent = stock.sentiment === "Bullish" ? "📈" : "📉";

      row.appendChild(tickerCell);
      row.appendChild(commentsCell);
      row.appendChild(sentimentCell);

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.log("Failed to load Reddit stocks:", error);
  }
}