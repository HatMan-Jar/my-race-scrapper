// ===============================
// Ferrari Bot - Live Race Loader
// ===============================

const API_USERNAME = "YOUR_USERNAME";
const API_PASSWORD = "YOUR_PASSWORD";
 
function calculateScore(horse) {
    let score = 0;

    // Recent form
    if (horse.form) {
        const wins = (horse.form.match(/1/g) || []).length;
        score += wins * 2;
    }

    // Good draw
    if (horse.draw && parseInt(horse.draw) <= 5) {
        score += 2;
    }

    // Low weight
    if (horse.lbs && parseInt(horse.lbs) < 130) {
        score += 2;
    }

    return Math.min(score, 27);
}


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
        console.log(data.racecards[0]);
        console.log(data.racecards[0].runners);

        let html = "";

data.racecards.forEach(race => {

       if (race.type !== "Flat") return;
    if (!race.race_name.includes("Handicap")) return;
    if (parseInt(race.field_size) < 9) return;

  let horsesHtml = "";
 race.runners.sort((a, b) =>
  calculateScore(b) -
  calculateScore(a));
 
 race.runners.sort((a, b) =>
  calculateScore(b) - calculateScore(a));

race.runners.forEach(horse => {

    const score = calculateScore(horse);   // temporary until we add the Ferrari rules

    horsesHtml += `
        <div class="horse-row">
            <strong>${horse.number}. ${horse.horse}</strong><br>
            Odds: ${horse.odds ?? "-"}<br>
            Ferrari Score: ${score}/27
            <hr>
        </div>
    `;

});


html += `
<div class="race-card">

    <div class="race-title">
        ${race.course} ${race.off_time}
    </div>

    <div class="race-subtitle">
        ${race.race_name}
    </div>

    <div style="margin-bottom:10px;">
        ${race.field_size} runners
    </div>

    ${horsesHtml}

    </div>
    `;

});

document.getElementById("results").innerHTML = html;



    } catch (err) {

        document.getElementById("results").innerHTML =
            "<p style='color:red;'>Failed to load races.</p>";

        console.error(err);

    }

}
