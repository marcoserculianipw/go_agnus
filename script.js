document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. CANVAS DE BRASAS / FOGO DO ESPÍRITO SANTO
       ========================================================== */
    const canvas = document.getElementById('holyCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class FlameParticle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 20;
                this.size = Math.random() * 2.2 + 0.8;
                this.speedY = Math.random() * 0.6 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.alpha = Math.random() * 0.5 + 0.2;
                this.hue = Math.random() > 0.4 ? 42 : 20; // Dourado e Âmbar
            }
            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                if (this.y < -10) this.reset();
            }
            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 55%, ${this.alpha})`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.8)`;
                ctx.fill();
                ctx.restore();
            }
        }

        const count = window.innerWidth < 768 ? 20 : 45;
        for (let i = 0; i < count; i++) {
            const p = new FlameParticle();
            p.y = Math.random() * canvas.height;
            particles.push(p);
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }


    /* ==========================================================
       2. CARROSSEL DINÂMICO
       ========================================================== */
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    const wrapper = document.getElementById('carouselWrapper');
    const progressBar = document.getElementById('carouselProgress');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoPlayTimer = null;
        const slideDuration = 4500;

        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(i);
                resetTimer();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(document.querySelectorAll('.dot'));

        function resetProgress() {
            if (!progressBar) return;
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            void progressBar.offsetWidth;
            progressBar.style.transition = `width ${slideDuration}ms linear`;
            progressBar.style.width = '100%';
        }

        function updatePosition() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
            resetProgress();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updatePosition();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updatePosition();
        }

        function goToSlide(index) {
            currentIndex = index;
            updatePosition();
        }

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
            resetTimer();
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
            resetTimer();
        });

        function startTimer() {
            clearInterval(autoPlayTimer);
            resetProgress();
            autoPlayTimer = setInterval(nextSlide, slideDuration);
        }

        function resetTimer() {
            clearInterval(autoPlayTimer);
            startTimer();
        }

        wrapper.addEventListener('mouseenter', () => {
            clearInterval(autoPlayTimer);
            if (progressBar) progressBar.style.width = '0%';
        });
        wrapper.addEventListener('mouseleave', startTimer);

        // Touch / Swipe
        let touchStartX = 0;
        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoPlayTimer);
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 45) {
                nextSlide();
            } else if (touchEndX - touchStartX > 45) {
                prevSlide();
            }
            startTimer();
        }, { passive: true });

        updatePosition();
        startTimer();
    }


    /* ==========================================================
       3. GERADOR DE VERSÍCULOS BÍBLICOS
       ========================================================== */
    const verses = [
        { text: "Não fostes vós que me escolhestes, mas eu vos escolhi a vós.", ref: "— São João 15, 16" },
        { text: "O Espírito Santo descerá sobre vós e sereis minhas testemunhas.", ref: "— Atos 1, 8" },
        { text: "Tudo posso naquele que me fortalece.", ref: "— Filipenses 4, 13" },
        { text: "Ninguém te despreze por seres jovem; sê o exemplo dos fiéis.", ref: "— 1 Timóteo 4, 12" },
        { text: "O Senhor é o meu pastor, nada me faltará.", ref: "— Salmo 22, 1" },
        { text: "Eis que estou convosco todos os dias, até a consumação dos séculos.", ref: "— São Mateus 28, 20" }
    ];

    let verseIndex = 0;
    const verseTextEl = document.getElementById('verseText');
    const verseRefEl = document.getElementById('verseRef');
    const nextVerseBtn = document.getElementById('nextVerseBtn');

    if (nextVerseBtn) {
        nextVerseBtn.addEventListener('click', () => {
            verseIndex = (verseIndex + 1) % verses.length;
            verseTextEl.style.opacity = '0';
            verseRefEl.style.opacity = '0';
            setTimeout(() => {
                verseTextEl.textContent = `"${verses[verseIndex].text}"`;
                verseRefEl.textContent = verses[verseIndex].ref;
                verseTextEl.style.opacity = '1';
                verseRefEl.style.opacity = '1';
            }, 200);
        });
    }


    /* ==========================================================
       4. CONTADOR REGRESSIVO ATÉ SÁBADO ÀS 18H
       ========================================================== */
    const countdownEl = document.getElementById('countdownText');

    function updateCountdown() {
        if (!countdownEl) return;
        const now = new Date();
        const nextMeeting = new Date(now);
        const day = now.getDay(); // 0 = Dom, 6 = Sáb
        const hour = now.getHours();

        if (day === 6 && hour >= 18 && hour < 20) {
            countdownEl.innerHTML = "🔥 <strong>Acontecendo Agora!</strong> Venha para a Capela!";
            return;
        }

        const daysUntil = (6 - day + 7) % 7 || (day === 6 && hour >= 18 ? 7 : 0);
        nextMeeting.setDate(now.getDate() + daysUntil);
        nextMeeting.setHours(18, 0, 0, 0);

        const diff = nextMeeting - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);

        countdownEl.innerHTML = `Próximo encontro em: <strong>${d > 0 ? d + 'd ' : ''}${h}h ${m}m</strong>`;
    }
    updateCountdown();
    setInterval(updateCountdown, 60000);


    /* ==========================================================
       5. VELA VIRTUAL DE INTENÇÃO
       ========================================================== */
    const lightBtn = document.getElementById('lightCandleBtn');
    const flame = document.getElementById('candleFlame');
    const candleMsg = document.getElementById('candleMsg');
    let candleCount = Math.floor(Math.random() * 10) + 18;

    if (lightBtn && flame) {
        lightBtn.addEventListener('click', () => {
            flame.classList.add('lit');
            candleCount++;
            candleMsg.innerHTML = `<span style="color:#f59e0b">Sua intenção foi unida em oração!</span> (${candleCount} velas acesas)`;
            lightBtn.disabled = true;
            lightBtn.textContent = 'Acesa';
            lightBtn.style.opacity = '0.6';
        });
    }
});