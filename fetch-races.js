// ===============================
// Ferrari Bot - Live Race Loader
// ===============================

const API_USERNAME = "YOUR_USERNAME";
const API_PASSWORD = "YOUR_PASSWORD";
 
function calculateScore(horse) {
    let score = 0;

    const form = horse.form || "";
    const nums = (form.match(/[0-9]/g) || []).map(Number);

    const lastRun = parseInt(horse.last_run);
    const draw = parseInt(horse.draw);
    const age = parseInt(horse.age);

    // --------------------------------
    // 1. LATEST FINISH — MAX 4
    // Most recent run is the RIGHT side
    // --------------------------------
    const latest = nums.length ? nums[nums.length - 1] : NaN;

    if (latest === 1) score += 4;
    else if (latest === 2) score += 3;
    else if (latest === 3) score += 2;
    else if (latest === 4 || latest === 5) score += 1;


    // --------------------------------
    // 2. RECENT WINNING SEQUENCE — MAX 5
    // --------------------------------
    const cleanForm = form.replace(/[^0-9]/g, "");

    if (cleanForm.endsWith("111"))
        score += 5;
    else if (cleanForm.endsWith("11"))
        score += 4;
    else if (cleanForm.endsWith("1"))
        score += 2;


    // --------------------------------
    // 3. HOW RECENTLY IT RAN — MAX 3
    // --------------------------------
    if (!isNaN(lastRun)) {
        if (lastRun <= 14)
            score += 3;
        else if (lastRun <= 30)
            score += 2;
        else if (lastRun <= 60)
            score += 1;
    }


    // --------------------------------
    // 4. DRAW — MAX 3
    // --------------------------------
    if (!isNaN(draw)) {
        if (draw === 1)
            score += 3;
        else if (draw <= 3)
            score += 2;
        else if (draw <= 5)
            score += 1;
    }


    // --------------------------------
    // 5. AGE — MAX 2
    // --------------------------------
    if (!isNaN(age) && age <= 4)
        score += 2;


    // --------------------------------
    // 6. CONSISTENCY — MAX 2
    // Two or more top-three finishes
    // in the last four runs
    // --------------------------------
    const recent4 = nums.slice(-4);

    const topThree = recent4.filter(
        position => position >= 1 && position <= 3
    ).length;

    if (topThree >= 2)
        score += 2;


    // --------------------------------
    // 7. IMPROVING FORM — MAX 2
    // Example: 6 → 4 → 2
    // --------------------------------
    const recent3 = nums.slice(-3);

    if (
        recent3.length === 3 &&
        recent3[0] > recent3[1] &&
        recent3[1] > recent3[2]
    ) {
        score += 2;
    }


    // --------------------------------
    // 8. CLEAN FORM — MAX 1
    // No falls, pulls-up, etc.
    // --------------------------------
    if (!/[0PFURB]/i.test(form))
        score += 1;


    // --------------------------------
    // 9. RECENT WINS — MAX 3
    // --------------------------------
    const wins = nums.filter(position => position === 1).length;

    if (wins >= 2)
        score += 3;
    else if (wins === 1)
        score += 1;


    // --------------------------------
    // 10. ODDS / VALUE BAND — MAX 2
    // --------------------------------
    const oddsText = String(horse.odds || "");
    const oddsMatch = oddsText.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);

    if (oddsMatch) {
        const odds = Number(oddsMatch[1]) / Number(oddsMatch[2]);

        if (odds >= 6 && odds <= 8)
            score += 2;
        else if (odds > 8 && odds <= 12)
            score += 1;
    }


    // --------------------------------
    // FERRARI MAXIMUM = 27
    // --------------------------------
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
     if (!data.racecards || !Array.isArray(data.racecards)) {
    throw new Error("No racecards returned by API");
}

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
  calculateScore(b) - calculateScore(a));

race.runners.forEach(horse => {

    const score = calculateScore(horse);   // temporary until we add the Ferrari rules

    horsesHtml += `
        <div class="horse-row">
            <strong>${horse.number}. ${horse.horse}</strong><br>
            Odds: ${horse.odds ?? "-"}<br>
            Ferrari Score: ${score}
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
