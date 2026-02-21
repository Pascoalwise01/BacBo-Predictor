let results = [];

function addResult(type) {
    results.push(type);
    updateDisplay();
}

function resetGame() {
    results = [];
    updateDisplay();
}

function updateDisplay() {
    displayHistory();
    calculateStats();
}

function displayHistory() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    results.forEach(r => {
        const span = document.createElement("span");
        span.textContent = r;

        if (r === "P") span.style.background = "#2196f3";
        if (r === "B") span.style.background = "#f44336";
        if (r === "T") span.style.background = "#4caf50";

        historyDiv.appendChild(span);
    });
}

function calculateStats() {
    let total = results.length;

    if (total === 0) {
        document.getElementById("stats").innerText = "Sem dados.";
        document.getElementById("suggestion").innerText = "";
        return;
    }

    let countP = results.filter(r => r === "P").length;
    let countB = results.filter(r => r === "B").length;
    let countT = results.filter(r => r === "T").length;

    let percentP = ((countP / total) * 100).toFixed(1);
    let percentB = ((countB / total) * 100).toFixed(1);
    let percentT = ((countT / total) * 100).toFixed(1);

    document.getElementById("stats").innerHTML =
        `Player: ${percentP}% | Banker: ${percentB}% | Tie: ${percentT}%`;

    suggest(percentP, percentB, percentT);
}

function suggest(p, b, t) {

    // Tendência curta (últimos 5)
    let lastFive = results.slice(-5);
    let shortP = lastFive.filter(r => r === "P").length;
    let shortB = lastFive.filter(r => r === "B").length;
    let shortT = lastFive.filter(r => r === "T").length;

    let scoreP = (parseFloat(p) * 0.4) + (shortP * 12);
    let scoreB = (parseFloat(b) * 0.4) + (shortB * 12);
    let scoreT = (parseFloat(t) * 0.4) + (shortT * 12);

    let suggestion = "Player";
    let confidence = scoreP;

    if (scoreB > confidence) {
        suggestion = "Banker";
        confidence = scoreB;
    }

    if (scoreT > confidence) {
        suggestion = "Tie";
        confidence = scoreT;
    }

    document.getElementById("suggestion").innerHTML =
        `Sugestão: ${suggestion} <br>
         Confiança Estatística: ${confidence.toFixed(1)}% <br>
         ⚠️ Rodadas são independentes. Isto é análise histórica.`;
}
