let results = [];

const ctx = document.getElementById('resultsChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Player', 'Banker', 'Tie'],
        datasets: [{
            label: 'Frequência (%)',
            data: [0,0,0],
            backgroundColor: ['#2196f3','#f44336','#4caf50']
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero:true, max:100 } }
    }
});

function loadRealHistory(){
    const input = document.getElementById("realHistoryInput").value;
    if(!input) return;
    const arr = input.split(',').map(r=>r.trim().toUpperCase());
    results = arr.filter(r=>["P","B","T"].includes(r));
    updateDisplay();
}

function addResult(type){
    results.push(type);
    updateDisplay();
}

function resetGame(){
    results=[];
    document.getElementById("realHistoryInput").value="";
    updateDisplay();
}

function displayHistory(){
    const historyDiv=document.getElementById("history");
    historyDiv.innerHTML="";
    results.forEach(r=>{
        const span=document.createElement("span");
        span.textContent=r;
        span.style.background=r==="P"?"#2196f3":r==="B"?"#f44336":"#4caf50";
        historyDiv.appendChild(span);
    });
}

function calculateStats(){
    let total=results.length;
    if(total===0) return [0,0,0];
    let countP=results.filter(r=>"P"===r).length;
    let countB=results.filter(r=>"B"===r).length;
    let countT=results.filter(r=>"T"===r).length;
    return [
        ((countP/total)*100).toFixed(1),
        ((countB/total)*100).toFixed(1),
        ((countT/total)*100).toFixed(1)
    ];
}

function movingAverage(last=5){
    const recent=results.slice(-last);
    return [
        recent.filter(r=>"P"===r).length,
        recent.filter(r=>"B"===r).length,
        recent.filter(r=>"T"===r).length
    ];
}

function detectSequence(){
    if(results.length===0) return "Nenhuma sequência ainda.";
    let last=results[results.length-1], count=1;
    for(let i=results.length-2;i>=0;i--){
        if(results[i]===last) count++;
        else break;
    }
    return count>=3?`Sequência forte de ${last} (${count} consecutivos)`:"Nenhuma sequência forte no momento.";
}

function intelligentSuggestion(){
    if(results.length===0) return "Nenhum histórico carregado";

    let [countP,countB,countT]=[
        results.filter(r=>"P"===r).length,
        results.filter(r=>"B"===r).length,
        results.filter(r=>"T"===r).length
    ];
    let total=results.length;

    let probP=countP/total;
    let probB=countB/total;
    let probT=countT/total;

    const variation=0.1;
    probP=Math.min(Math.max(probP+(Math.random()*2*variation-variation),0),1);
    probB=Math.min(Math.max(probB+(Math.random()*2*variation-variation),0),1);
    probT=Math.min(Math.max(probT+(Math.random()*2*variation-variation),0),1);

    const sum=probP+probB+probT;
    probP/=sum; probB/=sum; probT/=sum;

    const rand=Math.random();
    if(rand<probP) return "Player";
    else if(rand<probP+probB) return "Banker";
    else return "Tie";
}

function suggest(){
    const suggestionText=intelligentSuggestion();
    document.getElementById("suggestion").innerHTML=`${suggestionText} <br>⚠️ Rodadas independentes. Baseado no histórico.`;
}

function updateDisplay(){
    displayHistory();
    const [p,b,t]=calculateStats();
    document.getElementById("stats").innerHTML=`Player: ${p}% | Banker: ${b}% | Tie: ${t}%`;
    chart.data.datasets[0].data=[p,b,t];
    chart.update();
    suggest();
    document.getElementById("sequence").innerText=detectSequence();
}
