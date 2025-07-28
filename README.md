# Aulea - Offline AI Tutor

![Aulea Logo](assets/icon.png)

Aulea is a desktop application that provides offline, AI-powered tutoring for middle school students.  
This project was developed as part of the **CS6460: Educational Technology** course at Georgia Institute of Technology.

The primary goal of Aulea is to bridge the educational gap in low-resource communities where internet access is limited or unreliable. By running a powerful language model locally, Aulea delivers personalized learning support without depending on cloud services.

---

## Features

- **100% Offline:** All features, including the AI tutor, work without an internet connection.
- **AI-Powered Tutoring:** Utilizes a local Large Language Model (LLM) to answer student questions on subjects like science and reading.
- **Bilingual Support:** Fully functional in both English and Spanish, with an easy-to-use language switcher.
- **Cross-Platform:** Built with Electron to run natively on both Windows and macOS.
- **Lightweight:** Designed to perform well on consumer-grade hardware with limited memory.
- **Privacy-Focused:** All conversations and data remain on the user's local machine.

---

## Tech Stack

- **Framework:** [Electron](https://www.electronjs.org/)
- **Local AI Engine:** [llama.cpp](https://github.com/ggerganov/llama.cpp) for efficient LLM inference
- **AI Model Format:** [GGUF](https://huggingface.co/docs/hub/gguf) for quantized models
- **Frontend:** HTML, CSS, JavaScript

---

## How to Run Locally

Follow these steps to set up and run the Aulea application on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (includes npm)

### 1. Clone the Repository

```bash
git clone https://github.com/giraldogdiego/aulea.git
cd aulea
```

### 2. Download the AI Model

Aulea requires a quantized language model in **GGUF** format to function.

1. Download the model:

   [Llama-2-7B-Chat-GGUF (Q4_K_M)](https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/blob/main/llama-2-7b-chat.Q4_K_M.gguf)

2. Place the model in the correct directory:

   - Create a `models` folder inside the existing `llama` folder.
   - Move the downloaded `.gguf` file into this new folder.

   Final path:

   ```
   llama/models/llama-2-7b-chat.Q4_K_M.gguf
   ```

### 3. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 4. Run the Application

Start the Electron application:

```bash
npm start
```

The Aulea application window should now open, and you can start interacting with the AI tutor.

---

## Project Context

This application is a functional prototype developed for the **CS6460: Educational Technology** course at Georgia Tech. It serves as a proof-of-concept for leveraging local AI models to create equitable and accessible educational tools.
