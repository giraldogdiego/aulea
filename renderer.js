const langSelect = document.getElementById('lang-select');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const presetContainer = document.getElementById('preset-questions');
const chatWindow = document.getElementById('chat-window');

const resources = {
  en: {
    placeholder: 'Type your question here...',
    send: 'Send',
    presets: ["What is an ecosystem?", "How does photosynthesis work?", "What are the main parts of a cell?", "Explain the water cycle."],
    loading: 'Aulea is thinking...',
    welcome: "Hi! I'm Aulea. Ask me anything about your lessons."
  },
  es: {
    placeholder: 'Escribe tu pregunta aquí...',
    send: 'Enviar',
    presets: ['¿Qué es un ecosistema?', '¿Cómo funciona la fotosíntesis?', '¿Cuáles son las partes de una célula?', 'Explica el ciclo del agua.'],
    loading: 'Aulea está pensando...',
    welcome: '¡Hola! Soy Aulea. Pregúntame lo que quieras sobre tus lecciones.'
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
  userInput.placeholder = res.placeholder;
  sendBtn.textContent = res.send;
  presetContainer.innerHTML = '';
  res.presets.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.textContent = q;
    btn.onclick = () => sendMessage(q);
    presetContainer.appendChild(btn);
  });
}

function appendMessage(text, senderClass) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', senderClass);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showLoadingIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'loading';
  indicator.classList.add('loading-indicator');
  indicator.innerHTML = `<span>${resources[lang].loading}</span><div class="dot"></div><div class="dot"></div><div class="dot"></div>`;
  chatWindow.appendChild(indicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideLoadingIndicator() {
  const indicator = document.getElementById('loading');
  if (indicator) {
    indicator.remove();
  }
}

async function sendMessage(question) {
  if (!question) return;
  appendMessage(question, 'user');
  userInput.value = '';
  showLoadingIndicator();
  try {
    const answer = await window.electronAPI.invoke('run-llm', question, lang);
    hideLoadingIndicator();
    appendMessage(answer, 'ai');
  } catch (err) {
    console.error('Error from main process:', err);
    hideLoadingIndicator();
    appendMessage('Sorry, something went wrong. Please try again.', 'ai');
  }
}

langSelect.onchange = () => {
  lang = langSelect.value;
  localStorage.setItem('aulea_lang', lang);

  window.electronAPI.invoke('clear-history');

  chatWindow.innerHTML = '';
  appendMessage(resources[lang].welcome, 'ai');
  
  updateUI();
};

sendBtn.addEventListener('click', () => sendMessage(userInput.value.trim()));
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage(userInput.value.trim());
});

appendMessage(resources[lang].welcome, 'ai');
updateUI();