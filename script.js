let words = JSON.parse(localStorage.getItem("words") || "[]");
let errorStats = JSON.parse(localStorage.getItem("errorStats") || "{}");
let testList = [];
let currentTest = null;
let currentDirection = "pt-ru";

function save() {
  localStorage.setItem("words", JSON.stringify(words));
  localStorage.setItem("errorStats", JSON.stringify(errorStats));
}

function addWord() {
  const pt = document.getElementById("pt-word").value.trim();
  const ru = document.getElementById("ru-word").value.trim();
  if (pt && ru) {
    words.push({ pt, ru });
    save();
    document.getElementById("pt-word").value = "";
    document.getElementById("ru-word").value = "";
    renderWords();
  }
}

function renderWords() {
  const list = document.getElementById("word-list");
  const search = document.getElementById("search").value.toLowerCase();
  list.innerHTML = "";
  words
    .filter(w => w.pt.toLowerCase().includes(search) || w.ru.toLowerCase().includes(search))
    .forEach(word => {
      const card = document.createElement("div");
      card.className = "word-card";
      card.innerHTML = `<b>${word.pt}</b><br/>${word.ru}`;
      list.appendChild(card);
    });
}

function startTest() {
  currentDirection = document.querySelector("input[name='test-direction']:checked").value;
  testList = [];
  words.forEach(w => {
    const key = `${w.pt}|${w.ru}`;
    const errors = errorStats[key] || 0;
    for (let i = 0; i < errors + 1; i++) {
      testList.push(w);
    }
  });
  shuffle(testList);
  currentTest = null;
  document.getElementById("test-container").style.display = "block";
  nextQuestion();
}

function nextQuestion() {
  if (testList.length === 0) {
    document.getElementById("test-question").textContent = "Done!";
    return;
  }
  currentTest = testList.pop();
  document.getElementById("test-answer").value = "";
  document.getElementById("test-feedback").textContent = "";
  document.getElementById("test-question").textContent =
    currentDirection === "pt-ru" ? currentTest.pt : currentTest.ru;
}

function checkAnswer() {
  const answer = document.getElementById("test-answer").value.trim().toLowerCase();
  const correct = currentDirection === "pt-ru" ? currentTest.ru : currentTest.pt;
  const key = `${currentTest.pt}|${currentTest.ru}`;
  if (answer === correct.toLowerCase()) {
    document.getElementById("test-feedback").textContent = "✅ Correct!";
    errorStats[key] = Math.max(0, (errorStats[key] || 0) - 1);
  } else {
    document.getElementById("test-feedback").textContent = `❌ Incorrect. Correct: ${correct}`;
    errorStats[key] = (errorStats[key] || 0) + 1;
  }
  save();
  setTimeout(nextQuestion, 1000);
}

function showHint() {
  const correct = currentDirection === "pt-ru" ? currentTest.ru : currentTest.pt;
  document.getElementById("test-feedback").textContent = `💡 Hint: ${correct}`;
}

function speakWord() {
  const word = currentDirection === "pt-ru" ? currentTest.pt : currentTest.ru;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = currentDirection === "pt-ru" ? "pt-PT" : "ru-RU";
  speechSynthesis.speak(utterance);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
renderWords();
