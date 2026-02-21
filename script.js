let results = [];
let balance = 1000;

const ctx = document.getElementById('resultsChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Player', 'Banker', 'Tie'],
        datasets: [{
            label: 'Frequência',
            data: [0, 0, 0],
            backgroundColor: ['#2196f3', '#f44336', '#4caf50']
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});

function addResult(type) {
    results.push(type);
    updateBalance(type);
    updateDisplay();
}

function resetGame() {
    results = [];
    balance = parseFloat(document.getElementById("bankInput").value);
    updateDisplay();
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
    if (total === 0) return [0, 0, 0];

    let countP = results.filter(r => r === "P").length;
    let countB = results.filter(r => r === "B").length;
    let countT = results.filter(r => r === "T").length;

    return [
        ((countP / total) * 100).toFixed(1),
        ((countB / total) * 100).toFixed(1),
        ((countT / total) * 100).toFixed(1)
    ];
}

function suggest(p, b, t) {
    let lastFive = results.slice(-5);
    let shortP = lastFive.filter(r => r === "P").length;
    let shortB = lastFive.filter(r => r === "B").length;
    let shortT = lastFive.filter(r => r === "T").length;

    let scoreP = (parseFloat(p) * 0.4) + (shortP * 12);
    let scoreB = (parseFloat(b) * 0.4) + (shortB * 12);
    let scoreT = (parseFloat(t) * 0.4) + (shortT * 12);

    let suggestion = "Player", confidence = scoreP;
    if (scoreB > confidence) { suggestion = "Banker"; confidence = scoreB; }
    if (scoreT > confidence) { suggestion = "Tie"; confidence = scoreT; }

    document.getElementById("suggestion").innerHTML =
        `Sugestão: ${suggestion} <br>
         Confiança Estatística: ${confidence.toFixed(1)}% <br>
         ⚠️ Rodadas são independentes. Isto é análise histórica.`;
}

function updateDisplay() {
    displayHistory();
    const [p, b, t] = calculateStats();
    document.getElementById("stats").innerHTML =
        `Player: ${p}% | Banker: ${b}% | Tie: ${t}%`;

    chart.data.datasets[0].data = [p, b, t];
    chart.update();

    suggest(p, b, t);
    document.getElementById("balance").textContent = balance.toFixed(2);
}

function setBank() {
    balance = parseFloat(document.getElementById("bankInput").value);
    updateDisplay();
}

function updateBalance(result) {
    let bet = parseFloat(document.getElementById("betInput").value);
    if (result === "P") balance += bet * 0.95;  // Exemplo educativo
    if (result === "B") balance += bet * 0.95;  // Exemplo educativo
    if (result === "T") balance += bet * 8;     // Tie paga mais
}
