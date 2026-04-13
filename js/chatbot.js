/* ============================================
   CHATBOT - Muhammad Muneeb Iftikhar
   Gemini AI Integration
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements ----
    const launcher = document.querySelector('.chat-widget-launcher');
    const container = document.querySelector('.chat-widget-container');
    const input = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.chat-send-btn');
    const messagesBox = document.querySelector('.chat-messages');
    const typingIndicator = document.querySelector('.typing');

    // ---- Constants & State ----
    // IMPORTANT: In production, use a backend proxy for security.
    // For this portfolio, we use client-side with a free-tier key.
    const GEMINI_API_KEY = 'AIzaSyD4WALOtEhnP__vgz0_vcISYM66Wu_VM0E';

    // Using gemini-2.0-flash-lite — free tier, fast, lightweight.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY.trim()}`;

    const SYSTEM_CONTEXT = `
    You are "Muneeb AI", a professional chatbot representing Muhammad Muneeb Iftikhar.
    Goal: Answer questions about Muneeb's portfolio, experience, and skills.
    
    ABOUT MUNEEB:
    - Name: Muhammad Muneeb Iftikhar
    - Roles: Software Engineer & Unity Game Developer
    - Location: House E/859D-3, Umar Street 4, Lahore, Pakistan.
    - Level: 25 (Game-themed profile)
    - Objective: Passionate Software Engineer with expertise in Unity. Eager to contribute innovative solutions.
    
    SKILLS:
    - Programming: C++, C#, PHP, Python, Java, MySQL, Laravel.
    - Tools: Unity, Visual Studio, Blender, Adobe Photoshop.
    - Hobbies: Cooking, Planting, E-Games, Cricket.
    
    EXPERIENCE:
    1. Unity Game Developer @ Ozi Publishing (2024–Present): Architecting deep Unity ecosystems for mobile/console.
    2. Unity Game Developer @ Game Storm Studio (2023–2024): Engineered gameplay mechanics.
    3. Unity Game Developer @ Game Surg Studio (2022–2023): AI behaviors and environmental interactions.
    4. Unity Game Developer @ Game Tech Studio (2021–2022): Optimization specialist.
    5. Associate Software Engineer @ Aimbot Studio (2020–2021): Backend and networking.
    6. Laravel Developer @ Brainload Technologies (2019–2020): API infrastructures.
    7. Web Developer Internee @ Carbon Teq (2018): UI/UX foundations.
    
    EDUCATION:
    - BS Computer Science, Lahore Garrison University.
    - F.Sc Pre-Engineering, Garrison College for Boys.
    
    PROJECTS: 
    - Penguin Life Simulator, Bomb Chips, Taxi Driver Simulator, Bird Pranks Simulator, Brainrot Meme Shooter Survival, 
      Penguin Knock Out, Would You Rather, Bee Swarm Simulator, Crazy Doctor, Spin Battle Heroes, Ragdoll Race Simulator, 
      Punch Smash Boxing, Sling Strike, Bad Cat Pet Simulator, Plastic Army FPS, Spiral Ramp Car Racing.
    
    CONTACT:
    - Email: muneebiftikhar00@gmail.com
    - Phone/WhatsApp: +92 309-4734475
    - LinkedIn: linkedin.com/in/muhammad-muneebiftikhar
    
    TONE & STYLE:
    - Professional, friendly, and helpful.
    - Keep answers concise (max 2-3 sentences unless asked for detail).
    - If you don't know something, suggest contacting Muneeb via email or WhatsApp.
    - Do NOT make up info not provided here.
    `;

    let chatHistory = [];

    // ---- Functions ----
    const toggleChat = () => {
        launcher.classList.toggle('active');
        container.classList.toggle('active');

        // Focus input after opening
        if (container.classList.contains('active')) {
            setTimeout(() => input.focus(), 300);

            // Send welcome message if empty
            if (messagesBox.children.length === 0) {
                addMessage("ai", "Hello! I'm Muneeb's AI Assistant. How can I help you today? I know all about his work, skills, and projects!");
            }
        }
    };

    const addMessage = (role, text) => {
        if (!text) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.textContent = text;
        messagesBox.appendChild(msgDiv);

        // Scroll to bottom
        messagesBox.scrollTop = messagesBox.scrollHeight;
    };

    const sendMessage = async () => {
        const text = input.value.trim();
        if (!text) return;

        // Clear input and add user message
        input.value = '';
        addMessage('user', text);

        // Check if API Key is set to something likely invalid
        if (GEMINI_API_KEY.includes('REPLACE') || GEMINI_API_KEY.length < 10) {
            setTimeout(() => {
                addMessage('ai', "I'm ready to help, but my creator needs to add a valid Gemini API key first! You can get one for free at aistudio.google.com.");
            }, 600);
            return;
        }

        // Show typing indicator
        typingIndicator.style.display = 'block';
        messagesBox.scrollTop = messagesBox.scrollHeight;

        try {
            // Prepare request body
            // We use system_instruction if supported, or prepend it to the first message
            const contents = [...chatHistory];
            contents.push({ role: 'user', parts: [{ text: text }] });

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents,
                    system_instruction: {
                        parts: [{ text: SYSTEM_CONTEXT }]
                    },
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 600,
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Gemini API Error details:', data);
                // Specifically check for API key issues
                if (response.status === 403 || response.status === 401) {
                    throw new Error("Invalid or inactive API Key. Please verify your key at Google AI Studio.");
                }
                throw new Error(data.error?.message || `API Error ${response.status}`);
            }

            if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
                throw new Error("I couldn't generate a response. The content might have been filtered or the model is overloaded.");
            }

            const aiResponse = data.candidates[0].content.parts[0].text;

            // Hide typing and add AI message
            typingIndicator.style.display = 'none';
            addMessage('ai', aiResponse);

            // Update history for context
            chatHistory.push({ role: 'user', parts: [{ text: text }] });
            chatHistory.push({ role: 'model', parts: [{ text: aiResponse }] });

            // Maintain history limit to avoid too large requests
            if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

        } catch (error) {
            console.error('Chatbot Error:', error);
            typingIndicator.style.display = 'none';
            addMessage('ai', `This AI agent is under development, please feel free to contact us.`);
        }
    };

    // ---- Listeners ----
    launcher.addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', sendMessage);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Close on click outside (optional)
    document.addEventListener('click', (e) => {
        if (container.classList.contains('active') &&
            !container.contains(e.target) &&
            !launcher.contains(e.target)) {
            toggleChat();
        }
    });
});
