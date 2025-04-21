let words = JSON.parse(localStorage.getItem('words') || '[]');

function addWord() {
  const pt = document.getElementById('pt-word').value.trim();
  const ru = document.getElementById('ru-word').value.trim();
  if (!pt || !ru) return;
  words.push({ pt, ru });
  localStorage.setItem('words', JSON.stringify(words));
  document.getElementById('pt-word').value = '';
  document.getElementById('ru-word').value = '';
  renderWords();
}

function renderWords() {
  const list = document.getElementById('word-list');
  const search = document.getElementById('search').value.toLowerCase();
  list.innerHTML = '';
  words
    .filter(w => w.pt.toLowerCase().includes(search) || w.ru.toLowerCase().includes(search))
    .forEach(({ pt, ru }) => {
      const div = document.createElement('div');
      div.className = 'word-card';
      div.textContent = `${pt} ➜ ${ru}`;
      list.appendChild(div);
    });
}

renderWords();
