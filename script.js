document.addEventListener('DOMContentLoaded', () => {
    // Floating Hearts Background
    const heartsContainer = document.getElementById('floating-hearts');
    const heartEmojis = ['💖', '💕', '💗', '🩷', '✨', '🌸'];
    
    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'heart-particle';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
        heart.style.animationDuration = (Math.random() * 6 + 6) + 's';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), 12000);
    }
    
    setInterval(spawnHeart, 1500);
    // Spawn a few on load
    for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 300);

    // Lock Screen Logic
    const lockScreen = document.getElementById('lock-screen');
    const mainContent = document.getElementById('main-content');
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const hintBtn = document.getElementById('hint-btn');
    const hintText = document.getElementById('hint-text');
    const lockCard = document.querySelector('.lock-card');

    // === CONFIGURATION ===
    const CORRECT_PASSWORD = "23022025"; // รหัสผ่าน 8 หลัก (เปลี่ยนเป็นวันครบรอบของคุณได้เลย)
    const HINT_MESSAGE = "วันที่เราตกลงเป็นแฟนกัน (DDMMYYYY)"; // คำใบ้ภาษาไทย
    // =====================

    // === PIN BOX LOGIC ===
    const pinBoxes = document.querySelectorAll('.pin-box');
    
    pinBoxes.forEach((box, index) => {
        box.addEventListener('input', (e) => {
            if (e.inputType === "deleteContentBackward") return; 

            // Allow only numbers
            box.value = box.value.replace(/[^0-9]/g, '');

            if (box.value.length === 1) {
                if (index < pinBoxes.length - 1) {
                    pinBoxes[index + 1].focus();
                }
            }
        });

        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && box.value === '') {
                if (index > 0) {
                    pinBoxes[index - 1].focus();
                }
            }
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    });

    if (unlockBtn) {
        unlockBtn.addEventListener('click', checkPassword);
    }

    function checkPassword() {
        let input = "";
        pinBoxes.forEach(box => input += box.value);
        
        if (input === CORRECT_PASSWORD) {
            unlockSuccess();
        } else {
            unlockFail();
            // Clear inputs on fail? Optional.
            // pinBoxes.forEach(box => box.value = ''); 
            // pinBoxes[0].focus();
        }
    }

    function unlockSuccess() {
        if (lockScreen) lockScreen.classList.add('hide-lock');
        if (mainContent) {
            mainContent.classList.remove('hidden-content');
            mainContent.classList.add('show-content');
        }
        
        // Ensure Bento Grid is visible
        showGrid();

        // Start the celebration after unlocking
        startCelebration();
    }

    function unlockFail() {
        if (lockCard) {
            lockCard.classList.add('shake');
            pinBoxes.forEach(box => box.style.borderColor = 'red');
            setTimeout(() => {
                lockCard.classList.remove('shake');
                pinBoxes.forEach(box => box.style.borderColor = 'transparent');
            }, 500);
        }
    }

    // Letter Animation
    window.openLetter = function() {
        document.getElementById('envelope-sealed').style.display = 'none';
        document.getElementById('letter-opened').style.display = 'block';
    };

    window.closeLetter = function() {
        document.getElementById('letter-opened').style.display = 'none';
        document.getElementById('envelope-sealed').style.display = 'flex';
    };

    // Main Page Logic (Wrapped in function to call after unlock)
    function startCelebration() {
        // Auto-launch confetti
        setTimeout(() => {
            launchConfetti();
        }, 1000);
    }

    // Confetti Button - still works if clicked manually
    const button = document.getElementById('celebrate-btn');
    if (button) {
        button.addEventListener('click', () => {
            launchConfetti();
            button.innerHTML = "I Love You! ❤️";
        });
    }

    // === NAVIGATION LOGIC (BENTO GRID) ===
    window.showSection = function(sectionId) {
        document.getElementById('bento-grid').style.display = 'none';
        document.querySelectorAll('.content-section').forEach(el => el.style.display = 'none');
        const section = document.getElementById(sectionId);
        if(section) {
            section.style.display = 'block';
            section.classList.add('fade-in');
        }
    };

    window.showGrid = function() {
        document.querySelectorAll('.content-section').forEach(el => el.style.display = 'none');
        const grid = document.getElementById('bento-grid');
        grid.style.display = 'grid';
        grid.classList.add('fade-in');
    };

    // === TIMER LOGIC ===
    const startDate = new Date("2025-02-23"); // Placeholder Date: Feb 23, 2025. CHANGE THIS!
    
    function updateTimer() {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        // Update Full Timer
        if(document.getElementById('days')) {
            document.getElementById('days').innerText = days;
            document.getElementById('hours').innerText = hours;
            document.getElementById('minutes').innerText = minutes;
            document.getElementById('seconds').innerText = seconds;
        }

        // Update Bento Preview (Removed)

    }

    
    setInterval(updateTimer, 1000);
    updateTimer(); // Run immediately

    // === QUIZ LOGIC ===
    const quizData = [
        {
            question: "เราเจอกันครั้งแรกที่ไหน?",
            options: ["ร้านกาแฟ", "มหาวิทยาลัย", "เจอกันออนไลน์", "เพื่อนแนะนำ"],
            correct: 0 // Index of correct answer
        },
        {
            question: "อาหารโปรดของเค้าคืออะไร?",
            options: ["พิซซ่า", "ซูชิ", "เบอร์เกอร์", "ส้มตำ"],
            correct: 1
        },
        {
            question: "เพลงของเราคือเพลงอะไร?",
            options: ["Perfect - Ed Sheeran", "All of Me - John Legend", "Lover - Taylor Swift", "Yellow - Coldplay"],
            correct: 2
        }
    ];

    let currentQuestion = 0;
    const quizContainer = document.getElementById('quiz-container');
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const nextBtn = document.getElementById('next-question-btn');
    const resultEl = document.getElementById('quiz-result');

    function loadQuiz() {
        if (currentQuestion >= quizData.length) {
            quizContainer.innerHTML = "<h4>รู้ใจกันสุดๆ! ❤️</h4><p>คะแนน: รักเต็ม 100%</p>";
            return;
        }

        const data = quizData[currentQuestion];
        questionEl.textContent = data.question;
        optionsEl.innerHTML = "";
        resultEl.textContent = "";
        nextBtn.style.display = "none";

        data.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.classList.add('quiz-option');
            btn.addEventListener('click', () => checkAnswer(index, data.correct));
            optionsEl.appendChild(btn);
        });
    }

    function checkAnswer(selected, correct) {
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(opt => opt.style.pointerEvents = "none"); // Disable clicks

        if (selected === correct) {
            options[selected].classList.add('correct');
            resultEl.textContent = "เย้! ถูกต้องนะค้าบ 🥰";
            resultEl.style.color = "green";
        } else {
            options[selected].classList.add('wrong');
            options[correct].classList.add('correct');
            resultEl.textContent = "อ้าว ผิดซะงั้น! 😜";
            resultEl.style.color = "red";
        }
        
        nextBtn.style.display = "block";
    }

    nextBtn.addEventListener('click', () => {
        currentQuestion++;
        loadQuiz();
    });

    loadQuiz();

    function launchConfetti() {

        if (typeof confetti === 'undefined') return;

        // Use the global 'confetti' object from canvas-confetti library
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // multiple origins
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // ============ SCRATCH CARD LOGIC ============
    function initScratchCards() {
        const canvases = document.querySelectorAll('.scratch-canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            
            // Scale canvas to actual display size
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr || 280 * dpr;
            canvas.height = rect.height * dpr || 200 * dpr;
            ctx.scale(dpr, dpr);
            
            const w = rect.width || 280;
            const h = rect.height || 200;
            
            // Fill with gradient (the scratch layer)
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, '#f093fb');
            gradient.addColorStop(1, '#f5576c');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
            
            // Add sparkle text
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '40px serif';
            ctx.textAlign = 'center';
            ctx.fillText('✨🎁✨', w / 2, h / 2 - 10);
            ctx.font = "bold 16px 'Mali', cursive";
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillText('ขูดตรงนี้!', w / 2, h / 2 + 25);
            
            let isScratching = false;
            
            function getPos(e) {
                const r = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: clientX - r.left,
                    y: clientY - r.top
                };
            }
            
            function scratch(pos) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
                ctx.fill();
                
                // Check how much has been scratched
                checkScratchProgress(canvas, ctx);
            }
            
            canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(getPos(e)); });
            canvas.addEventListener('mousemove', (e) => { if (isScratching) scratch(getPos(e)); });
            canvas.addEventListener('mouseup', () => isScratching = false);
            canvas.addEventListener('mouseleave', () => isScratching = false);
            
            canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isScratching = true; scratch(getPos(e)); });
            canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isScratching) scratch(getPos(e)); });
            canvas.addEventListener('touchend', () => isScratching = false);
        });
    }
    
    function checkScratchProgress(canvas, ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        const total = pixels.length / 4;
        
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparent++;
        }
        
        // If more than 50% scratched, reveal fully
        if (transparent / total > 0.5) {
            canvas.style.transition = 'opacity 0.5s ease';
            canvas.style.opacity = '0';
            canvas.style.pointerEvents = 'none';
            // Hide the label too
            const label = canvas.parentElement.querySelector('.scratch-label');
            if (label) label.style.opacity = '0';
        }
    }
    
    window.resetScratchCards = function() {
        document.querySelectorAll('.scratch-canvas').forEach(c => {
            c.style.transition = 'none';
            c.style.opacity = '1';
            c.style.pointerEvents = 'auto';
            const label = c.parentElement.querySelector('.scratch-label');
            if (label) label.style.opacity = '1';
        });
        // Re-init after a brief delay
        setTimeout(initScratchCards, 100);
    };
    
    // ============ MATCHING GAME LOGIC ============
    const matchEmojis = ['💖', '💌', '🎁', '🌹', '🧸', '💍'];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let isLocked = false;

    window.initMatchGame = function() {
        const board = document.getElementById('match-board');
        const movesDisplay = document.getElementById('match-moves');
        const pairsDisplay = document.getElementById('match-pairs');
        
        // Reset state
        board.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        isLocked = false;
        movesDisplay.textContent = '0';
        pairsDisplay.textContent = '0';
        
        const msgEl = document.getElementById('match-success-msg');
        if (msgEl) msgEl.innerHTML = '';
        
        // Create pairs and shuffle
        const gameCards = [...matchEmojis, ...matchEmojis];
        gameCards.sort(() => Math.random() - 0.5);
        
        gameCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            const inner = document.createElement('div');
            inner.className = 'match-card-inner';
            
            const front = document.createElement('div');
            front.className = 'match-card-front';
            front.textContent = '?';
            
            const back = document.createElement('div');
            back.className = 'match-card-back';
            back.textContent = emoji;
            
            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);
            
            card.addEventListener('click', () => flipCard(card));
            board.appendChild(card);
        });
    };

    function flipCard(card) {
        if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('match-moves').textContent = moves;
            checkMatch();
        }
    }

    function checkMatch() {
        isLocked = true;
        const [card1, card2] = flippedCards;
        const match = card1.dataset.emoji === card2.dataset.emoji;

        if (match) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                document.getElementById('match-pairs').textContent = matchedPairs;
                flippedCards = [];
                isLocked = false;
                
                if (matchedPairs === matchEmojis.length) {
                    setTimeout(() => {
                        launchConfetti();
                        showMatchSuccess();
                    }, 500);
                }
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                isLocked = false;
            }, 1000);
        }
    }

    function showMatchSuccess() {
        const msgEl = document.getElementById('match-success-msg');
        if (msgEl) {
            msgEl.innerHTML = `
                <div class="praise-card fade-in">
                    <h4>เก่งที่สุดเลยยย! ❤️</h4>
                    <p>เธอจำเก่งขนาดนี้ แสดงว่าใส่ใจเค้าสุดๆ เลยใช่ไหมเนี่ย 🥰</p>
                </div>
            `;
        }
    }

    // Init scratch cards when section is shown
    const origShowSection = window.showSection;
    window.showSection = function(id) {
        origShowSection(id);
        if (id === 'section-scratch') {
            setTimeout(initScratchCards, 200);
        }
        if (id === 'section-match') {
            setTimeout(window.initMatchGame, 200);
        }
    };
});
