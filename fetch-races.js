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

        let html = "";

data.racecards.forEach(race => {

    if (race.type !== "Flat") return;
    if (!race.race_name.includes("Handicap")) return;
    if (parseInt(race.field_size) < 9) return;

    let html = "";

    if (race.type !== "Flat") return;
    if (!race.race_name.includes("Handicap")) return;
    if (parseInt(race.field_size) < 9) return;

    html += `
        <div class="race-card">
            <div class="race-title">
                ${race.course} ${race.off_time}
            </div>

            <div class="race-subtitle">
                ${race.race_name}
            </div>

            <div>
                ${race.field_size} runners
            </div>
        </div>
    `;

});

document.getElementById("results").innerHTML = html;


});


    } catch (err) {

        document.getElementById("results").innerHTML =
            "<p style='color:red;'>Failed to load races.</p>";

        console.error(err);

    }

}
