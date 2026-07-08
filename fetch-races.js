// ===============================
// Ferrari Bot - Live Race Loader
// ===============================

const API_USERNAME = "YOUR_USERNAME";
const API_PASSWORD = "YOUR_PASSWORD";

async function loadTodaysRaces() {

    document.getElementById("results").innerHTML =
        "<p>Loading today's races...</p>";

    try {

        
const response = await fetch(
    "https://ferrari-bot.daisyboriscar.workers.dev"
);
        const data = await response.json();

console.log(data.racecards);

        console.log(data);

        document.getElementById("results").innerHTML =
            "<pre>" +
            JSON.stringify(data, null, 2) +
            "</pre>";

    } catch (err) {

        document.getElementById("results").innerHTML =
            "<p style='color:red;'>Failed to load races.</p>";

        console.error(err);

    }

}