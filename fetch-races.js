// ===============================
// Ferrari Bot - Live Race Loader
// ===============================

const API_USERNAME = "YOUR_USERNAME";
const API_PASSWORD = "YOUR_PASSWORD";
 
// ===============================
// Ferrari Bot - Live Race Loader
// ===============================

// ============================================
// FERRARI SCORE BREAKDOWN
// ============================================

function getScoreBreakdown(horse) {

    let latestFinish = 0;
    let winningSequence = 0;
    let fitness = 0;
    let drawScore = 0;
    let ageScore = 0;
    let consistency = 0;
    let improvingForm = 0;
    let cleanFormScore = 0;
    let recentWins = 0;
    let value = 0;


    const form = horse.form || "";
    const nums = (form.match(/[0-9]/g) || []).map(Number);

    const lastRun = parseInt(horse.last_run);
    const draw = parseInt(horse.draw);
    const age = parseInt(horse.age);


    // --------------------------------
    // 1. LATEST FINISH — MAX 4
    // Most recent run is RIGHT side
    // --------------------------------

    const latest = nums.length
        ? nums[nums.length - 1]
        : NaN;

    if (latest === 1)
        latestFinish = 4;
    else if (latest === 2)
        latestFinish = 3;
    else if (latest === 3)
        latestFinish = 2;
    else if (latest === 4 || latest === 5)
        latestFinish = 1;


    // --------------------------------
    // 2. RECENT WINNING SEQUENCE — MAX 5
    // --------------------------------

    const cleanForm =
        form.replace(/[^0-9]/g, "");

    if (cleanForm.endsWith("111"))
        winningSequence = 5;
    else if (cleanForm.endsWith("11"))
        winningSequence = 4;
    else if (cleanForm.endsWith("1"))
        winningSequence = 2;


    // --------------------------------
    // 3. HOW RECENTLY IT RAN — MAX 3
    // --------------------------------

    if (!isNaN(lastRun)) {

        if (lastRun <= 14)
            fitness = 3;
        else if (lastRun <= 30)
            fitness = 2;
        else if (lastRun <= 60)
            fitness = 1;
    }


    // --------------------------------
    // 4. DRAW — MAX 3
    // --------------------------------

    if (!isNaN(draw)) {

        if (draw === 1)
            drawScore = 3;
        else if (draw <= 3)
            drawScore = 2;
        else if (draw <= 5)
            drawScore = 1;
    }


    // --------------------------------
    // 5. AGE — MAX 2
    // --------------------------------

    if (!isNaN(age) && age <= 4)
        ageScore = 2;


    // --------------------------------
    // 6. CONSISTENCY — MAX 2
    // Two or more top-three finishes
    // in the last four runs
    // --------------------------------

    const recent4 = nums.slice(-4);

    const topThree = recent4.filter(
        position =>
            position >= 1 &&
            position <= 3
    ).length;

    if (topThree >= 2)
        consistency = 2;


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
        improvingForm = 2;
    }


    // --------------------------------
    // 8. CLEAN FORM — MAX 1
    // No falls, pulls-up, etc.
    // --------------------------------

    if (!/[0PFURB]/i.test(form))
        cleanFormScore = 1;


    // --------------------------------
    // 9. RECENT WINS — MAX 3
    // --------------------------------

    const wins =
        nums.filter(position => position === 1).length;

    if (wins >= 2)
        recentWins = 3;
    else if (wins === 1)
        recentWins = 1;


    // --------------------------------
    // 10. ODDS / VALUE BAND — MAX 2
    // --------------------------------

    const oddsText =
        String(horse.odds || "");

    const oddsMatch =
        oddsText.match(
            /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/
        );


    if (oddsMatch) {

        const odds =
            Number(oddsMatch[1]) /
            Number(oddsMatch[2]);

        if (odds >= 6 && odds <= 8)
            value = 2;

        else if (odds > 8 && odds <= 12)
            value = 1;
    }


    // --------------------------------
    // TOTAL
    // --------------------------------

    const total =
        latestFinish +
        winningSequence +
        fitness +
        drawScore +
        ageScore +
        consistency +
        improvingForm +
        cleanFormScore +
        recentWins +
        value;


    return {

        latestFinish,
        winningSequence,
        fitness,
        drawScore,
        ageScore,
        consistency,
        improvingForm,
        cleanFormScore,
        recentWins,
        value,

        total: Math.min(total, 27)
    };
}



// ============================================
// FERRARI SCORE
// ============================================

function calculateScore(horse) {

    return getScoreBreakdown(horse).total;
}



// ============================================
// SAVE FERRARI PREDICTION
// ============================================

function saveFerrariPrediction(
    race,
    topPick,
    secondPick,
    thirdPick,
    gapToSecond,
    gapToFourth,
    topThreeAverage
) {

    const trackerKey = "ferrariTracker";


    const existing =
        JSON.parse(
            localStorage.getItem(trackerKey) || "[]"
        );


    // --------------------------------
    // Create a unique race ID
    // --------------------------------

    const raceId =
        race.id ||
        `${race.date || ""}-${race.course || ""}-${race.off_time || ""}-${race.race_name || ""}`;


    // --------------------------------
    // Don't save the same race twice
    // --------------------------------

    const alreadySaved =
        existing.some(
            item => item.raceId === raceId
        );


    if (alreadySaved) {

        console.log(
            "🏎️ Ferrari prediction already saved:",
            race.course,
            race.off_time
        );

        return;
    }


    // --------------------------------
    // Save prediction
    // --------------------------------

    existing.push({

        raceId: raceId,

        date: race.date || "",

        course: race.course || "",

        time: race.off_time || "",

        raceName: race.race_name || "",

        runners:
            parseInt(race.field_size) || 0,


        ferrari1:
            topPick?.horse || "",

        ferrari1Score:
            topPick
                ? calculateScore(topPick)
                : 0,


        ferrari2:
            secondPick?.horse || "",

        ferrari2Score:
            secondPick
                ? calculateScore(secondPick)
                : 0,


        ferrari3:
            thirdPick?.horse || "",

        ferrari3Score:
            thirdPick
                ? calculateScore(thirdPick)
                : 0,


        gapToSecond:
            gapToSecond,

        gapToFourth:
            gapToFourth,

        topThreeAverage:
            topThreeAverage,


        // Results will be added later
        result: null
    });


    localStorage.setItem(
        trackerKey,
        JSON.stringify(existing)
    );


    console.log(
        "🏎️ Ferrari prediction saved:",
        race.course,
        race.off_time
    );
}



// ============================================
// LOAD TODAY'S RACES
// ============================================

async function loadTodaysRaces() {


    document.getElementById("results").innerHTML =
        "<p>Loading today's races...</p>";


    try {


        const response =
            await fetch(
                "https://ferrari-bot.daisyboriscar.workers.dev"
            );


        const data =
            await response.json();


        if (
            !data.racecards ||
            !Array.isArray(data.racecards)
        ) {

            throw new Error(
                "No racecards returned by API"
            );
        }


        console.log(data.racecards);

        console.log(data);

        console.log(
            data.racecards[0]
        );

        console.log(
            data.racecards[0].runners
        );


        let html = "";


        // ========================================
        // PROCESS EACH RACE
        // ========================================

        data.racecards.forEach(race => {


            // --------------------------------
            // FILTERS
            // --------------------------------

            if (race.type !== "Flat")
                return;


            if (
                !race.race_name.includes(
                    "Handicap"
                )
            )
                return;


            if (
                parseInt(race.field_size) < 9
            )
                return;


            let horsesHtml = "";


            // --------------------------------
            // SORT HORSES BY FERRARI SCORE
            // --------------------------------

            race.runners.sort(
                (a, b) =>
                    calculateScore(b) -
                    calculateScore(a)
            );


            // --------------------------------
            // TOP FOUR
            // --------------------------------

            const topPick =
                race.runners[0];

            const secondPick =
                race.runners[1];

            const thirdPick =
                race.runners[2];

            const fourthPick =
                race.runners[3];


            // --------------------------------
            // TOP SCORES
            // --------------------------------

            const topScore =
                topPick
                    ? calculateScore(topPick)
                    : 0;

            const secondScore =
                secondPick
                    ? calculateScore(secondPick)
                    : 0;

            const thirdScore =
                thirdPick
                    ? calculateScore(thirdPick)
                    : 0;

            const fourthScore =
                fourthPick
                    ? calculateScore(fourthPick)
                    : 0;


            // --------------------------------
            // SCORE GAPS
            // --------------------------------

            const gapToSecond =
                topScore -
                secondScore;

            const gapToFourth =
                topScore -
                fourthScore;


            // --------------------------------
            // TOP THREE AVERAGE
            // --------------------------------

            const topThreeAverage =
                Math.round(
                    (
                        (
                            topScore +
                            secondScore +
                            thirdScore
                        ) / 3
                    ) * 10
                ) / 10;


            // --------------------------------
            // SAVE PREDICTION
            // --------------------------------

            saveFerrariPrediction(
                race,
                topPick,
                secondPick,
                thirdPick,
                gapToSecond,
                gapToFourth,
                topThreeAverage
            );


            // ========================================
            // BUILD HORSE DISPLAY
            // ========================================

            race.runners.forEach(horse => {


                const breakdown =
                    getScoreBreakdown(horse);


                horsesHtml += `

                    <div class="horse-row">

                        <strong>
                            ${horse.number}.
                            ${horse.horse}
                        </strong><br>


                        Odds:
                        ${horse.odds ?? "-"}<br>


                        <strong>
                            Ferrari Score:
                            ${breakdown.total}/27
                        </strong><br>


                        <small>

                            Latest:
                            +${breakdown.latestFinish}

                            | Winning:
                            +${breakdown.winningSequence}

                            | Fitness:
                            +${breakdown.fitness}

                            | Draw:
                            +${breakdown.drawScore}

                            | Age:
                            +${breakdown.ageScore}

                            | Consistency:
                            +${breakdown.consistency}

                            | Improving:
                            +${breakdown.improvingForm}

                            | Clean:
                            +${breakdown.cleanFormScore}

                            | Wins:
                            +${breakdown.recentWins}

                            | Value:
                            +${breakdown.value}

                        </small>


                        <hr>

                    </div>
                `;
            });


            // ========================================
            // BUILD RACE CARD
            // ========================================

            html += `

                <div class="race-card">


                    <div class="race-title">

                        ${race.course}
                        ${race.off_time}

                    </div>


                    <div class="race-subtitle">

                        ${race.race_name}

                    </div>


                    <div
                        style="
                            margin-bottom:10px;
                        "
                    >

                        ${race.field_size}
                        runners

                    </div>


                    <!-- ========================= -->
                    <!-- FERRARI RACE ANALYSIS -->
                    <!-- ========================= -->

                    <div
                        style="
                            background:#f4f4f4;
                            padding:10px;
                            margin-bottom:15px;
                            border-radius:6px;
                        "
                    >

                        <strong>
                            🏎️ Ferrari Race Analysis
                        </strong>

                        <br><br>


                        🥇

                        <strong>
                            ${topPick?.horse ?? "-"}
                        </strong>

                        —
                        ${topScore}/27

                        <br>


                        🥈

                        ${secondPick?.horse ?? "-"}

                        —
                        ${secondScore}/27

                        <br>


                        🥉

                        ${thirdPick?.horse ?? "-"}

                        —
                        ${thirdScore}/27

                        <br><br>


                        Gap to #2:

                        <strong>

                            ${gapToSecond}

                            point${
                                gapToSecond === 1
                                    ? ""
                                    : "s"
                            }

                        </strong>

                        <br>


                        Gap to #4:

                        <strong>

                            ${gapToFourth}

                            point${
                                gapToFourth === 1
                                    ? ""
                                    : "s"
                            }

                        </strong>

                        <br>


                        Top 3 average:

                        <strong>
                            ${topThreeAverage}/27
                        </strong>

                    </div>


                    ${horsesHtml}


                </div>

            `;
        });


        document.getElementById(
            "results"
        ).innerHTML = html;


    } catch (err) {


        document.getElementById(
            "results"
        ).innerHTML =
            "<p style='color:red;'>Failed to load races.</p>";


        console.error(err);

    }

}
