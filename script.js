document.addEventListener("DOMContentLoaded", () => {

    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    const IFRAME_ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    let youtubePreconnected = false;

    function preconnectYouTube() {
        if (youtubePreconnected) return;
        youtubePreconnected = true;
        ["https://www.youtube.com", "https://www.google.com"].forEach(href => {
            const link = document.createElement("link");
            link.rel = "preconnect";
            link.href = href;
            document.head.appendChild(link);
        });
    }

    function activateVideo(facade) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${facade.dataset.id}?autoplay=1&rel=0`;
        iframe.title = facade.dataset.title || "YouTube video";
        iframe.allow = IFRAME_ALLOW;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        iframe.setAttribute("frameborder", "0");
        facade.replaceWith(iframe);
    }

    document.querySelectorAll(".yt-facade").forEach(facade => {
        const title = facade.dataset.title || "video";

        const img = document.createElement("img");
        img.src = `https://i.ytimg.com/vi/${facade.dataset.id}/hqdefault.jpg`;
        img.alt = title;
        img.loading = "lazy";
        img.decoding = "async";

        const play = document.createElement("span");
        play.className = "yt-play";

        facade.setAttribute("aria-label", `Play video: ${title}`);
        facade.append(img, play);

        facade.addEventListener("pointerenter", preconnectYouTube, { once: true });
        facade.addEventListener("focus", preconnectYouTube, { once: true });
        facade.addEventListener("click", () => activateVideo(facade), { once: true });
    });


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
            currentSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            currentSpeed = 500;
        }

        setTimeout(typeEffect, currentSpeed);
    }

    typeEffect();


    const cursor = document.querySelector(".custom-cursor");
    const cursorDot = document.querySelector(".cursor-dot");

    if (isFinePointer && cursor && cursorDot) {
        document.documentElement.classList.add("cursor-custom");

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let rafId = null;
        let firstMove = true;

        const place = (el, x, y) => {
            el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        };

        function renderCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            place(cursor, cursorX, cursorY);

            if (Math.abs(mouseX - cursorX) > 0.1 || Math.abs(mouseY - cursorY) > 0.1) {
                rafId = requestAnimationFrame(renderCursor);
            } else {
                rafId = null; 
            }
        }

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (firstMove) {
                firstMove = false;
                cursorX = mouseX;
                cursorY = mouseY;
                document.body.classList.add("cursor-visible");
            }

            place(cursorDot, mouseX, mouseY);
            if (!rafId) rafId = requestAnimationFrame(renderCursor);
        }, { passive: true });

        document.documentElement.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-visible");
        });
        document.documentElement.addEventListener("mouseenter", () => {
            if (!firstMove) document.body.classList.add("cursor-visible");
        });

        const hoverSelector = ".card, .short-card, iframe, .btn-glow, a, .skill-badge, .yt-facade";
        document.addEventListener("mouseover", (e) => {
            document.body.classList.toggle("cursor-hover", !!e.target.closest(hoverSelector));
        }, { passive: true });
    }


    let isScrollingTimer;
    window.addEventListener("scroll", () => {
        document.body.classList.add("is-scrolling");

        clearTimeout(isScrollingTimer);
        isScrollingTimer = setTimeout(() => {
            document.body.classList.remove("is-scrolling");
        }, 150);
    }, { passive: true });

 
    const sliderContainer = document.querySelector(".shorts-slider-container");
    if (!sliderContainer || reduceMotion) return;

    const scrollSpeed = 1.2; 
    let direction = 1;       
    let isPaused = false;
    let userEngaged = false; 
    let animationFrameId = null;
    let pos = sliderContainer.scrollLeft;

    function autoScroll() {
        if (!isPaused && !userEngaged) {
           
            if (Math.abs(sliderContainer.scrollLeft - pos) > 2) {
                pos = sliderContainer.scrollLeft;
            }

            const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
            pos += scrollSpeed * direction;

            if (pos >= maxScroll) {
                pos = maxScroll;
                direction = -1;
            } else if (pos <= 0) {
                pos = 0;
                direction = 1;
            }

            sliderContainer.scrollLeft = pos;
        }
        animationFrameId = requestAnimationFrame(autoScroll);
    }


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationFrameId) {
                    pos = sliderContainer.scrollLeft;
                    animationFrameId = requestAnimationFrame(autoScroll);
                }
            } else if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        });
    }, { threshold: 0.2 });

    observer.observe(sliderContainer);

    // Pause on Hover / Touch
    sliderContainer.addEventListener("mouseenter", () => { isPaused = true; });
    sliderContainer.addEventListener("mouseleave", () => { isPaused = false; });
    sliderContainer.addEventListener("touchstart", () => { isPaused = true; }, { passive: true });
    sliderContainer.addEventListener("touchend", () => { isPaused = false; }, { passive: true });

    sliderContainer.addEventListener("click", (e) => {
        if (e.target.closest(".yt-facade")) userEngaged = true;
    });
});
