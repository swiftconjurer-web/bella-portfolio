document.addEventListener("DOMContentLoaded", () => {

    // 1. Typewriter Animation (Storytelling, Sound Design, Motion Graphics, etc.)
    const words = ["Storytelling", "Sound Design", "Motion Graphics", "Color Grading", "Video Editing"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const speed = 120;
    const textElement = document.getElementById("typewriter-text");

    function typeEffect() {
        if (!textElement) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentSpeed = isDeleting ? speed / 2 : speed;

        if (!isDeleting && charIndex === currentWord.length) {
            currentSpeed = 2000; // Word type hone par 2 second ka hold
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            currentSpeed = 500;
        }

        setTimeout(typeEffect, currentSpeed);
    }

    typeEffect();

    // 2. High-Performance Ultra-Smooth Cursor Animation
    const cursor = document.querySelector(".custom-cursor");
    const cursorDot = document.querySelector(".cursor-dot");

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows cursor instantaneously
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // RequestAnimationFrame for Smooth Circle Interpolation
    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }

        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // 3. Cursor Effect on Scroll
    let isScrollingTimer;
    window.addEventListener("scroll", () => {
        document.body.classList.add("is-scrolling");

        clearTimeout(isScrollingTimer);
        isScrollingTimer = setTimeout(() => {
            document.body.classList.remove("is-scrolling");
        }, 150);
    });

    // 4. Cursor Hovering on Cards, Buttons, and Links
    const interactiveElements = document.querySelectorAll(".card, .short-card, iframe, .btn-glow, a, .skill-badge");

    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.shorts-slider-container');
    if (!sliderContainer) return;

    let scrollSpeed = 1.2; // Slow & smooth speed (Aap speed kam/zyada kar sakte hain)
    let direction = 1; // 1 = Right, -1 = Left
    let isPaused = false;
    let animationFrameId = null;

    // Auto Scroll Logic
    function autoScroll() {
        if (!isPaused) {
            sliderContainer.scrollLeft += scrollSpeed * direction;

            // Jab right end par pohnche toh direction left (-1) kar do
            if (sliderContainer.scrollLeft + sliderContainer.clientWidth >= sliderContainer.scrollWidth - 1) {
                direction = -1;
            } 
            // Jab bilkul start (left) par pohnche toh direction right (1) kar do
            else if (sliderContainer.scrollLeft <= 0) {
                direction = 1;
            }
        }
        animationFrameId = requestAnimationFrame(autoScroll);
    }

    // Intersection Observer: Jab user scroll karke section tak pohnche tabhi auto-slide chalayega
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationFrameId) {
                    animationFrameId = requestAnimationFrame(autoScroll);
                }
            } else {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        });
    }, { threshold: 0.2 });

    observer.observe(sliderContainer);

    // Pause on Hover / Touch / Click (Jab user kisi video par aaye ya click kare)
    sliderContainer.addEventListener('mouseenter', () => { isPaused = true; });
    sliderContainer.addEventListener('mouseleave', () => { isPaused = false; });
    sliderContainer.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
    sliderContainer.addEventListener('touchend', () => { isPaused = false; });

    // Prevent jump during user manual drag/scroll
    sliderContainer.addEventListener('scroll', () => {
        // Keeps boundary detection smooth during manual scroll
        if (sliderContainer.scrollLeft + sliderContainer.clientWidth >= sliderContainer.scrollWidth - 1) {
            direction = -1;
        } else if (sliderContainer.scrollLeft <= 0) {
            direction = 1;
        }
    });
});

