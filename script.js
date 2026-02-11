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
        if (heartsContainer) heartsContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), 12000);
    }
    
    setInterval(spawnHeart, 1500);
    // Spawn a few on load
    for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 300);

    // === CODE PROTECTION & DETERRENTS ===
    // 1. Disable Right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // 2. Disable common DevTools shortcuts
    document.addEventListener('keydown', (e) => {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'u') ||
            (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'j' || e.key === 'u' || e.key === 'c')) // Mac shortcuts
        ) {
            e.preventDefault();
            return false;
        }
    });

    // 3. Console warning
    console.log('%cหยุดก่อน!', 'color: red; font-size: 30px; font-weight: bold; -webkit-text-stroke: 1px black;');
    console.log('%cพื้นที่ส่วนตัว ห้ามแอบดูโค้ดล่ะ! 🤫💖', 'font-size: 16px;');

    // 4. Aggressive Anti-Debugging (Stalls DevTools)
    // This will pause the browser repeatedly if DevTools is open
    (function() {
        const detectDevTools = function() {
            const start = new Date();
            debugger; // This triggers only if DevTools is open
            const end = new Date();
            if (end - start > 100) {
                // If paused by debugger, reload or redirect
                // window.location.reload(); 
            }
        };
        setInterval(detectDevTools, 500);
    })();

    // 5. (Optional) Detect DevTools opening by screen size difference
    setInterval(() => {
        const threshold = 160;
        if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
            // DevTools might be open
        }
    }, 1000);

    // === DATA INITIALIZATION FROM CONFIG ===
    function initAppFromConfig() {
        // Basic Info
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) headerTitle.textContent = `สุขสันต์วันครบรอบ ${CONFIG.nickname}`;

        // Profile Picture
        const profileContainer = document.getElementById('pulse-profile');
        if (profileContainer && CONFIG.profileImage) {
            profileContainer.innerHTML = `<img src="${CONFIG.profileImage}" alt="Couple" onerror="this.style.display='none'">`;
        }
        
        // Gift Screen
        const giftTitle = document.getElementById('gift-title');
        const giftMsg = document.getElementById('gift-message');
        const giftEmoji = document.getElementById('gift-emoji');
        const acceptBtn = document.getElementById('accept-gift-btn');

        if (giftTitle) giftTitle.textContent = CONFIG.giftContents.title;
        if (giftMsg) giftMsg.textContent = CONFIG.giftContents.message;
        if (giftEmoji) giftEmoji.textContent = CONFIG.giftContents.giftEmoji;
        if (acceptBtn) {
            acceptBtn.textContent = CONFIG.giftContents.buttonText;
            acceptBtn.addEventListener('click', () => {
                document.getElementById('gift-screen').classList.add('hidden-gift');
                showDashboard();
                
                // Auto-play music if config allows
                const music = document.getElementById('bg-music');
                if (music && CONFIG.musicUrl) {
                    music.play().catch(e => console.log("Autoplay blocked by browser. User interaction needed."));
                    const musicBtn = document.getElementById('music-toggle');
                    if (musicBtn) musicBtn.style.animation = 'bloom 2s infinite';
                }
            });
        }
        
        // Letter
        const letterBody = document.getElementById('letter-body');
        if (letterBody) {
            letterBody.innerHTML = `<p class="letter-greeting"><strong>ถึง ${CONFIG.nickname} ,</strong></p>`;
            CONFIG.letterContent.paragraphs.forEach(p => {
                const pEl = document.createElement('p');
                pEl.textContent = p;
                letterBody.appendChild(pEl);
            });
        }
        const signoffEl = document.getElementById('letter-signoff');
        const fromEl = document.getElementById('letter-from');
        if (signoffEl) signoffEl.textContent = CONFIG.letterContent.signOff;
        if (fromEl) fromEl.textContent = CONFIG.letterContent.from;

        // Memories
        const gallery = document.getElementById('memories-gallery');
        if (gallery) {
            gallery.innerHTML = '';
            CONFIG.memories.forEach((item, index) => {
                const rotationClass = index % 2 === 0 ? 'rotate-left' : 'rotate-right';
                const frame = document.createElement('div');
                frame.className = `photo-frame ${rotationClass}`;
                
                // Show actual image if provided, otherwise show placeholder
                const photoContent = item.image 
                    ? `<img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; border-radius:10px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                    : '';

                frame.innerHTML = `
                    ${photoContent}
                    <div class="photo-placeholder" style="${item.image ? 'display:none;' : 'display:flex;'}">📷<br>${item.title}</div>
                    <div class="photo-caption">${item.caption}</div>
                `;
                
                // Add click listener for lightbox
                frame.onclick = () => {
                    const imgSrc = item.image || ""; // Placeholder case handled in CSS/HTML
                    if (imgSrc) {
                        openLightbox(imgSrc, item.caption);
                    }
                };

                gallery.appendChild(frame);
            });
        }

        // --- Lightbox Functions ---
        window.openLightbox = function(src, caption) {
            const modal = document.getElementById('photo-lightbox');
            const img = document.getElementById('lightbox-img');
            const cap = document.getElementById('lightbox-caption');
            
            img.src = src;
            cap.textContent = caption;
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        };

        window.closeLightbox = function() {
            const modal = document.getElementById('photo-lightbox');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };

        // Scratch Cards
        const scratchGrid = document.getElementById('scratch-grid');
        if (scratchGrid) {
            scratchGrid.innerHTML = '';
            CONFIG.scratchMessages.forEach(() => {
                const card = document.createElement('div');
                card.className = 'scratch-card';
                card.innerHTML = `
                    <div class="scratch-reveal"></div>
                    <canvas class="scratch-canvas"></canvas>
                    <p class="scratch-label">ขูดตรงนี้ ✨</p>
                `;
                scratchGrid.appendChild(card);
            });
            
            // Populate messages after creation
            const reveals = scratchGrid.querySelectorAll('.scratch-reveal');
            const icons = ["💖", "🥰", "🌟", "💌"];
            CONFIG.scratchMessages.forEach((msg, i) => {
                if (reveals[i]) reveals[i].innerHTML = `${icons[i % icons.length]}<br>${msg.replace(/\n/g, '<br>')}`;
            });
        }

        // --- Premium Features Initializer ---
        initPremiumFeatures();
    }

    function initPremiumFeatures() {
        // 1. Background Music
        const music = document.getElementById('bg-music');
        const musicBtn = document.getElementById('music-toggle');
        if (music && musicBtn && CONFIG.musicUrl) {
            music.querySelector('source').src = CONFIG.musicUrl;
            music.load();
            
            musicBtn.addEventListener('click', () => {
                if (music.paused) {
                    music.play();
                    musicBtn.textContent = '🎵';
                    musicBtn.style.animation = 'bloom 2s infinite';
                } else {
                    music.pause();
                    musicBtn.textContent = '🔇';
                    musicBtn.style.animation = 'none';
                }
            });
        }

        // 2. Theme Toggle
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            if (CONFIG.defaultTheme === 'night') document.body.classList.add('dark-theme');
            
            themeBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                themeBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
            });
        }

        // 3. Heart Trail
        initHeartTrail();

        // 4. Scroll Reveal
        initScrollReveal();
    }

    function initHeartTrail() {
        const createParticle = (x, y) => {
            const particle = document.createElement('span');
            particle.className = 'heart-trail';
            particle.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            const tx = (Math.random() - 0.5) * 100;
            const ty = (Math.random() - 0.5) * 100;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        };

        window.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.8) createParticle(e.clientX, e.clientY);
        });

        window.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            createParticle(touch.clientX, touch.clientY);
        });
    }

    function initScrollReveal() {
        const items = document.querySelectorAll('.bento-item');
        items.forEach(item => item.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        items.forEach(item => observer.observe(item));
    }

    initAppFromConfig();

    // Lock Screen Logic
    const lockScreen = document.getElementById('lock-screen');
    const mainContent = document.getElementById('main-content');
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const hintBtn = document.getElementById('hint-btn');
    const hintText = document.getElementById('hint-text');
    const lockCard = document.querySelector('.lock-card');

    // === CONFIGURATION ===
    const CORRECT_PASSWORD = CONFIG.passcode; 
    const HINT_MESSAGE = `ใบ้ให้: ${CONFIG.passcode.substring(0,2)}...... (DDMMYYYY)`; 
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
        
        // Show Gift Screen instead of dashboard
        const giftScreen = document.getElementById('gift-screen');
        if (giftScreen) {
            giftScreen.classList.remove('hidden-gift');
        } else {
            // Fallback if gift screen is missing
            showDashboard();
        }
    }

    function showDashboard() {
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
            
            // Show error message
            const errorEl = document.getElementById('pin-error');
            if (errorEl) {
                errorEl.textContent = CONFIG.pinErrorMsg || "รหัสหวั่นไหว... ลองใหม่อีกครั้งนะ";
            }

            // Clear inputs and focus first box
            pinBoxes.forEach(box => {
                box.value = '';
                box.style.borderColor = '#ff4d4d';
            });
            pinBoxes[0].focus();

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
    const quizData = CONFIG.quizQuestions;

    let currentQuestion = 0;
    let score = 0;
    const quizContainer = document.getElementById('quiz-container');
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const nextBtn = document.getElementById('next-question-btn');
    const resultEl = document.getElementById('quiz-result');

    function loadQuiz() {
        if (currentQuestion >= quizData.length) {
            showFinalScore();
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
        options.forEach(opt => opt.style.pointerEvents = "none");

        if (selected === correct) {
            options[selected].classList.add('correct');
            resultEl.textContent = "เย้! ถูกต้องนะค้าบ 🥰";
            resultEl.style.color = "green";
            score++;
        } else {
            options[selected].classList.add('wrong');
            options[correct].classList.add('correct');
            resultEl.textContent = "อ้าว ผิดซะงั้น! 😜";
            resultEl.style.color = "red";
        }
        
        nextBtn.style.display = "block";
    }

    function showFinalScore() {
        let message = "";
        let icon = "";
        const percentage = (score / quizData.length) * 100;

        if (percentage === 100) {
            icon = "🏆";
            message = "อื้อหือออ นี่มันแฟนพันธุ์แท้ตัวจริง! รู้ใจกันที่สุดในโลกเลย ขอบคุณที่ใส่ใจเค้าทุกอย่างนะค้าบ 💖✨";
        } else if (percentage >= 60) {
            icon = "🥰";
            message = `เก่งมากๆ เลย! ได้ตั้ง ${score} คะแนนแหนะ เธอรู้ใจเค้าเยอะเหมือนกันนะเนี่ย รักที่สุดเลยยย 💝`;
        } else {
            icon = "🥺";
            message = "ไม่เป็นไรน้าาา สงสัยเค้ายังเล่าเรื่องตัวเองไม่บ่อยพอ เดี๋ยวจะมาอ้อนให้ฟังบ่อยๆ เลยนะ! รักเธอเหมือนเดิม ❤️";
        }

        quizContainer.innerHTML = `
            <div class="quiz-final-score fade-in">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${icon}</div>
                <h4>คะแนนของคุณ: ${score} / ${quizData.length}</h4>
                <p style="margin: 1.5rem 0; line-height: 1.6;">${message}</p>
                <button class="close-letter-btn" onclick="resetQuiz()">🔁 ลองทดสอบใหม่</button>
            </div>
        `;
        
        if (percentage === 100) {
            launchConfetti();
        }
    }

    window.resetQuiz = function() {
        currentQuestion = 0;
        score = 0;
        quizContainer.innerHTML = `
            <p id="quiz-question">คำถาม...</p>
            <div id="quiz-options"></div>
            <p id="quiz-result"></p>
            <button id="next-question-btn" class="glow-button" style="display:none; margin-top:1rem;">ข้อต่อไป</button>
        `;
        // Re-assign references after clearing innerHTML
        const newQuestionEl = document.getElementById('quiz-question');
        const newOptionsEl = document.getElementById('quiz-options');
        const newNextBtn = document.getElementById('next-question-btn');
        const newResultEl = document.getElementById('quiz-result');
        
        // Wait for DOM
        setTimeout(() => {
            // Need to redefine refs because innerHTML nuked them
            loadQuizWithNewRefs();
        }, 10);
    };

    function loadQuizWithNewRefs() {
        // Redefine elements (since they were replaced by innerHTML)
        const qEl = document.getElementById('quiz-question');
        const oEl = document.getElementById('quiz-options');
        const rEl = document.getElementById('quiz-result');
        const nBtn = document.getElementById('next-question-btn');

        if (currentQuestion >= quizData.length) {
            showFinalScore();
            return;
        }

        const data = quizData[currentQuestion];
        qEl.textContent = data.question;
        oEl.innerHTML = "";
        rEl.textContent = "";
        nBtn.style.display = "none";

        data.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.classList.add('quiz-option');
            btn.addEventListener('click', () => {
                const options = oEl.querySelectorAll('.quiz-option');
                options.forEach(opt => opt.style.pointerEvents = "none");
                if (index === data.correct) {
                    btn.classList.add('correct');
                    rEl.textContent = "เย้! ถูกต้องนะค้าบ 🥰";
                    rEl.style.color = "green";
                    score++;
                } else {
                    btn.classList.add('wrong');
                    options[data.correct].classList.add('correct');
                    rEl.textContent = "อ้าว ผิดซะงั้น! 😜";
                    rEl.style.color = "red";
                }
                nBtn.style.display = "block";
            });
            oEl.appendChild(btn);
        });

        // Add event listener to next button once
        nBtn.onclick = () => {
            currentQuestion++;
            loadQuizWithNewRefs();
        };
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
                <div class="praise-card">
                    <h4>${CONFIG.matchSuccessMsg.title}</h4>
                    <p>${CONFIG.matchSuccessMsg.text}</p>
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
