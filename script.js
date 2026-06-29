// --- OYUN AYARLARI & DATA ---
let state = JSON.parse(localStorage.getItem('quiz_data')) || {
    username: "Oyuncu",
    coins: 100,
    level: 1,
    xp: 0
};

const app = document.getElementById('game-app');

// --- EKRANLAR ---
function renderMenu() {
    app.innerHTML = `
        <div class="card">
            <h1>${state.username}</h1>
            <p>🪙 ${state.coins} | ⭐ Seviye: ${state.level}</p>
        </div>
        <button class="btn" onclick="startGame()">⚔️ OYNA (API'den Çek)</button>
        <button class="btn" style="background: #3b82f6" onclick="renderShop()">🛒 Market</button>
    `;
}

async function startGame() {
    app.innerHTML = "<h2>Soru Yükleniyor...</h2>";
    try {
        const res = await fetch("https://opentdb.com/api.php?amount=1&category=9&type=multiple");
        const data = await res.json();
        const q = data.results[0];
        
        // Cevapları birleştir ve karıştır
        const answers = [...q.incorrect_answers, q.correct_answer].sort();
        
        app.innerHTML = `
            <div class="card">
                <p>${q.question}</p>
                ${answers.map(ans => 
                    `<button class="btn" onclick="checkAnswer('${ans.replace(/'/g, "\\'")}', '${q.correct_answer.replace(/'/g, "\\'")}')">${ans}</button>`
                ).join('')}
            </div>
        `;
    } catch (error) {
        app.innerHTML = `<div class="card"><h2>Hata oluştu!</h2><button class="btn" onclick="renderMenu()">Geri Dön</button></div>`;
    }
}

function checkAnswer(selected, correct) {
    if(selected === correct) {
        state.coins += 10;
        state.xp += 20;
        alert("Doğru! +10 Altın");
    } else {
        alert("Yanlıştı! Doğrusu: " + correct);
    }
    localStorage.setItem('quiz_data', JSON.stringify(state));
    renderMenu();
}

function renderShop() {
    app.innerHTML = `
        <div class="card"><h2>Market</h2><p>Daha fazla özellik yakında!</p></div>
        <button class="btn" onclick="renderMenu()">Geri Dön</button>
    `;
}

// Başlangıç
if(state.username === "Oyuncu") state.username = prompt("Adın ne?") || "Oyuncu";
renderMenu();
