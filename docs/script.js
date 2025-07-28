document.addEventListener('DOMContentLoaded', () => {

    const translations = {
        en: {
            title: "Aulea - AI Tutoring for All",
            Features: "Features",
            Download: "Download",
            Feedback: "Feedback",
            "Get Aulea Now": "Get Aulea Now",
            "Learning, unlocked. <br>Anywhere, anytime.": "Learning, unlocked. <br>Anywhere, anytime.",
            "Aulea is a free, offline AI tutor that empowers students in low-resource communities. No internet connection required.": "Aulea is a free, offline AI tutor that empowers students in low-resource communities. No internet connection required.",
            "Designed for Impact": "Designed for Impact",
            "100% Offline": "100% Offline",
            "Aulea runs entirely on the user's computer, ensuring access equity regardless of internet availability.": "Aulea runs entirely on the user's computer, ensuring access equity regardless of internet availability.",
            "AI-Powered Tutoring": "AI-Powered Tutoring",
            "Answers questions on science and reading, providing clear, concise explanations to reinforce learning.": "Answers questions on science and reading, providing clear, concise explanations to reinforce learning.",
            "Bilingual & Relevant": "Bilingual & Relevant",
            "Full support for English and Spanish, using content packs aligned with local curricula like Colombia's.": "Full support for English and Spanish, using content packs aligned with local curricula like Colombia's.",
            "Get Started for Free": "Get Started for Free",
            "Aulea is open-source and will always be free. Download the version for your operating system.": "Aulea is open-source and will always be free. Download the version for your operating system.",
            "Download .exe": "Download .exe",
            "Download .dmg": "Download .dmg",
            "Help Us Improve": "Help Us Improve",
            "Your feedback is vital. Suggest new content, report a bug, or just share your ideas.": "Your feedback is vital. Suggest new content, report a bug, or just share your ideas.",
            "Send Feedback via Email": "Send Feedback via Email",
            "Your Name": "Your Name",
            "Your Email": "Your Email",
            "Your message...": "Your message...",
            "Aulea Project by Diego Giraldo. An open-source initiative to close the digital divide in education.": "Aulea Project by Diego Giraldo. An open-source initiative to close the digital divide in education.",
            "General Feedback": "General Feedback",
            "Content Suggestion": "Content Suggestion"
        },
        es: {
            title: "Aulea - Tutoría con IA para Todos",
            Features: "Características",
            Download: "Descargar",
            Feedback: "Feedback",
            "Get Aulea Now": "Obtén Aulea Ahora",
            "Learning, unlocked. <br>Anywhere, anytime.": "Aprendizaje sin límites. <br>Donde sea, cuando sea.",
            "Aulea is a free, offline AI tutor that empowers students in low-resource communities. No internet connection required.": "Aulea es un tutor de IA gratuito y offline que empodera a estudiantes en comunidades con recursos limitados. No se requiere conexión a internet.",
            "Designed for Impact": "Diseñado para Impactar",
            "100% Offline": "100% Offline",
            "Aulea runs entirely on the user's computer, ensuring access equity regardless of internet availability.": "Aulea se ejecuta completamente en el computador del usuario, garantizando acceso equitativo sin importar la disponibilidad de internet.",
            "AI-Powered Tutoring": "Tutoría con IA",
            "Answers questions on science and reading, providing clear, concise explanations to reinforce learning.": "Responde preguntas de ciencia y lectura, proporcionando explicaciones claras y concisas para reforzar el aprendizaje.",
            "Bilingual & Relevant": "Bilingüe y Relevante",
            "Full support for English and Spanish, using content packs aligned with local curricula like Colombia's.": "Soporte completo en inglés y español, usando paquetes de contenido alineados a currículos locales como el de Colombia.",
            "Get Started for Free": "Comienza Gratis",
            "Aulea is open-source and will always be free. Download the version for your operating system.": "Aulea es de código abierto y siempre será gratuito. Descarga la versión para tu sistema operativo.",
            "Download .exe": "Descargar .exe",
            "Download .dmg": "Descargar .dmg",
            "Help Us Improve": "Ayúdanos a Mejorar",
            "Your feedback is vital. Suggest new content, report a bug, or just share your ideas.": "Tu feedback es vital. Sugiere nuevo contenido, reporta un error o simplemente comparte tus ideas.",
            "Send Feedback via Email": "Enviar Feedback por Email",
            "Your Name": "Tu Nombre",
            "Your Email": "Tu Email",
            "Your message...": "Tu mensaje...",
            "Aulea Project by Diego Giraldo. An open-source initiative to close the digital divide in education.": "Proyecto Aulea por Diego Giraldo. Una iniciativa de código abierto para cerrar la brecha digital en la educación.",
            "General Feedback": "Feedback General",
            "Content Suggestion": "Sugerencia de Contenido"
        }
    };

    const langSwitcher = document.querySelector('.lang-switcher');
    const feedbackTypeSelect = document.getElementById('feedback-type');
    let currentLang = localStorage.getItem('lang') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        document.documentElement.lang = lang;
        document.title = translations[lang].title;

        document.querySelectorAll('[data-lang-en]').forEach(el => {
            const key = el.getAttribute('data-lang-en');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-lang-placeholder-en]').forEach(el => {
            const key = el.getAttribute('data-lang-placeholder-en');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        populateFeedbackSelect();
        
        langSwitcher.querySelector('.active').classList.remove('active');
        langSwitcher.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    }

    function populateFeedbackSelect() {
        feedbackTypeSelect.innerHTML = '';
        const generalOpt = document.createElement('option');
        generalOpt.value = "General Feedback";
        generalOpt.textContent = translations[currentLang]["General Feedback"];
        
        const contentOpt = document.createElement('option');
        contentOpt.value = "Content Suggestion";
        contentOpt.textContent = translations[currentLang]["Content Suggestion"];

        feedbackTypeSelect.appendChild(generalOpt);
        feedbackTypeSelect.appendChild(contentOpt);
    }

    langSwitcher.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            setLanguage(e.target.dataset.lang);
        }
    });

    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const feedbackType = document.getElementById('feedback-type').value;
        const email = document.getElementById('user-email').value;
        const message = document.getElementById('message').value;
        
        const recipientEmail = "dgomez61@gatech.edu"; 
        
        const emailSubject = `Aulea Feedback: ${feedbackType}`;
        const emailBody = `Name: ${name} - Email: ${email}\n\nType: ${feedbackType}\n\nMessage:\n${message}`;

        const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    });

    setLanguage(currentLang);
});