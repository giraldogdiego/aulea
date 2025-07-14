const { ipcRenderer } = require('electron');
const langSelect      = document.getElementById('lang-select');
const userInput       = document.getElementById('user-input');
const sendBtn         = document.getElementById('send-btn');
const presetContainer = document.getElementById('preset-questions');
const chatWindow      = document.getElementById('chat-window');

const resources = {
  en: {
    placeholder: 'Type your question…',
    send:        'Send',
    presets: [
      "What's the lifespan of a polar bear?",
      "What's the chemical formula for water?",
      "What is the freezing point of water in Celsius?",
      "How many continents are there on Earth?"
    ]
  },
  es: {
    placeholder: 'Escribe tu pregunta…',
    send:        'Enviar',
    presets: [
      '¿Cuál es la esperanza de vida de un oso polar?',
      '¿Cuál es la fórmula química del agua?',
      '¿A qué temperatura se congela el agua en Celsius?',
      '¿Cuántos continentes hay en la Tierra?'
    ]
  }
};

let lang = localStorage.getItem('aulea_lang') || 'en';
Object.keys(resources).forEach(code => {
  const opt = document.createElement('option');
  opt.value = code;
  opt.textContent = code === 'en' ? 'English' : 'Español';
  langSelect.appendChild(opt);
});
langSelect.value = lang;

function updateUI() {
  const res = resources[lang];
  userInput.placeholder    = res.placeholder;
  sendBtn.textContent      = res.send;
  presetContainer.innerHTML = '';
  res.presets.forEach(q => {
    const btn = document.createElement('button');
    btn.className    = 'preset-btn';
    btn.textContent  = q;
    btn.onclick      = () => sendMessage(q);
    presetContainer.appendChild(btn);
  });
}

langSelect.onchange = () => {
  lang = langSelect.value;
  localStorage.setItem('aulea_lang', lang);
  updateUI();
};

function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage(question) {
  appendMessage(question, 'user');
  userInput.value = '';
  try {
    const answer = await ipcRenderer.invoke('run-llm', question, lang);
    appendMessage(answer, 'ai');
  } catch (err) {
    appendMessage('Error: ' + err.message, 'ai');
  }
}

sendBtn.addEventListener('click', () => {
  const prompt = userInput.value.trim();
  if (prompt) sendMessage(prompt);
});

userInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const prompt = userInput.value.trim();
    if (prompt) sendMessage(prompt);
  }
});

updateUI();
