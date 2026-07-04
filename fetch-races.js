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
            "https://api.theracingapi.com/v1/racecards/today",
            {
                headers: {
                    Authorization:
                        "Basic " +
                        btoa(API_USERNAME + ":" + API_PASSWORD)
                }
            }
        );

        const data = await response.json();

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