const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
let conversationHistory = [];

const isDev = process.env.NODE_ENV !== 'production';
const resourcesPath = isDev ? __dirname : process.resourcesPath;

const llamaExecPath = path.join(resourcesPath, 'llama', 'llama');
const modelPath = path.join(resourcesPath, 'llama', 'models', 'llama-2-7b-chat.Q4_K_M.gguf');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.setIcon(path.join(__dirname, 'assets', 'icon.png'));
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('clear-history', () => {
  conversationHistory = [];
});

ipcMain.handle('run-llm', async (event, prompt, lang) => {
  if (!fs.existsSync(llamaExecPath)) {
    return "Error: llama executable not found. The application may be corrupted.";
  }
  if (!fs.existsSync(modelPath)) {
    return "Error: Model file not found. The model was not bundled correctly.";
  }

  conversationHistory.push({ role: 'user', content: prompt });

  const systemMessage = lang === 'es'
    ? `<s>[INST] <<SYS>>\nEres un tutor educativo amigable y servicial. Responde siempre en español, de forma clara y concisa. No repitas la pregunta.\n<</SYS>>\n\n`
    : `<s>[INST] <<SYS>>\nYou are a friendly and helpful educational tutor. Always answer in English, clearly and concisely. Do not repeat the question.\n<</SYS>>\n\n`;

  const maxHistoryTurns = 4;
  const recentHistory = conversationHistory.slice(-maxHistoryTurns * 2);

  const formattedHistory = recentHistory
    .map(m => (m.role === 'user' ? `[INST] ${m.content} [/INST]` : m.content))
    .join('\n');

  const wrappedPrompt = `${systemMessage}${formattedHistory}`;

  return new Promise((resolve, reject) => {
    const args = [
      '-m', modelPath, '-p', wrappedPrompt, '-n', '512',
      '--temp', '0.1', '--top_p', '0.9', '--repeat_penalty', '1.15',
      '-c', '1024', '-t', '4'
    ];

    const llamaProcess = spawn(llamaExecPath, args);
    let fullOutput = '';

    llamaProcess.stdout.on('data', data => { fullOutput += data.toString(); });
    llamaProcess.stderr.on('data', data => { console.error(`llama.cpp stderr: ${data}`); });

    llamaProcess.on('close', code => {
      if (code === 0) {
        const answer = fullOutput.split('[/INST]').pop().replace(/\[end of text\]/gi, '').trim();
        if (answer) {
            conversationHistory.push({ role: 'assistant', content: answer });
            resolve(answer);
        } else {
            reject(new Error('Model returned an empty answer.'));
        }
      } else {
        reject(new Error(`llama exited with code ${code}`));
      }
    });
    llamaProcess.on('error', err => { reject(err); });
  });
});

app.whenReady().then(createWindow);

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