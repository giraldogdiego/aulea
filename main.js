const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.setIcon(path.join(__dirname, 'assets', 'icon.png'));

  win.loadFile(path.join(__dirname, 'index.html'));
}

const history = [];

ipcMain.handle('run-llm', async (event, prompt, lang) => {
  history.push({ role: 'user', content: prompt });
  if (history.length > 10) history.shift();

  const system = lang === 'es'
    ? `<s>[INST] <<SYS>>
Eres un tutor educativo bilingüe. Responde siempre en español, directamente y conciso, sin repetir la pregunta ni pedir aclaraciones.
<</SYS>>`
    : `<s>[INST] <<SYS>>
You are a helpful, knowledgeable tutor. Answer questions directly and concisely in English, without restating the prompt or asking for clarification.
<</SYS>>`;

  const convo = history
    .map(m => m.role === 'user' ? `[INST] ${m.content} [/INST]` : m.content)
    .join('\n');

  const wrappedPrompt = `${system}\n${convo}`;

  return new Promise((resolve, reject) => {
    const execPath = path.join(__dirname, 'llama', 'llama');
    const args = [
      '-m', path.join(__dirname, 'llama', 'models', 'llama-2-7b-chat.Q4_K_M.gguf'),
      '-p', wrappedPrompt,
      '-n', '512',
      '--temp', '0.0',
      '--top_p', '0.9',
      '--repeat_penalty', '1.2',
      '-c', '512',
      '-t', '4'
    ];

    const proc = spawn(execPath, args);
    let output = '';
    proc.stdout.on('data', data => { output += data.toString(); });
    proc.stderr.on('data', data => { console.error(data.toString()); });
    proc.on('close', code => {
      if (code === 0) {
        let answer = output
          .split('[/INST]').pop()
          .replace(/\[end of text\]/gi, '')
          .trim();
        history.push({ role: 'assistant', content: answer });
        resolve(answer);
      } else {
        reject(new Error(`llama exited with code ${code}`));
      }
    });
    proc.on('error', err => { reject(err); });
  });
});

app.whenReady().then(createWindow);

if (process.platform === 'darwin') {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  app.dock.setIcon(iconPath);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
