/**
 * Animations.js - Saberes Interculturais "PRO MAX" Engine
 * Heritage Earth Theme
 */

export const Animations = {
    init() {
        console.log("Initializing Saberes Pro Max Engine...");
        if (typeof gsap === "undefined") {
            console.error("GSAP not found. Animations disabled.");
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        
        this.runPreloader();
        this.initMagneticEffects();
        this.initCardGlows();
    },

    runPreloader() {
        const bar = document.getElementById("preloaderBar");
        const loader = document.getElementById("preloader");
        const counterText = document.getElementById("preloaderCounter");
        const quoteText = document.getElementById("preloaderQuote");

        if (!bar || !loader) {
            this.entranceSequence();
            return;
        }

        const quotes = [
            "Memória e cultura dos povos de Itaparica.",
            "Práticas corporais e saberes ancestrais.",
            "O território como espaço de saberes."
        ];
        
        if (quoteText) {
            quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)];
            setTimeout(() => quoteText.classList.add("show"), 200);
        }

        const progressObj = { value: 0 };
        
        // Wait for both a minimum timer (for smooth UX) and the actual window load
        const loadPromise = new Promise((resolve) => {
            if (document.readyState === "complete") {
                resolve();
            } else {
                window.addEventListener("load", resolve, { once: true });
            }
        });

        const minTimePromise = new Promise(resolve => setTimeout(resolve, 1500));

        // Fake progress up to 80% while waiting
        gsap.to(progressObj, {
            value: 80,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => updateLoader()
        });

        function updateLoader() {
            const p = Math.round(progressObj.value);
            gsap.set(bar, { scaleX: p / 100 });
            if (counterText) counterText.textContent = `${p}%`;
        }

        Promise.all([loadPromise, minTimePromise]).then(() => {
            // Finish loader quickly once real load happens
            gsap.to(progressObj, {
                value: 100,
                duration: 0.5,
                ease: "power2.inOut",
                onUpdate: () => updateLoader(),
                onComplete: () => {
                    gsap.to(loader, {
                        autoAlpha: 0,
                        duration: 0.8,
                        ease: "power4.inOut",
                        onComplete: () => {
                            loader.classList.add("fade-out");
                            this.entranceSequence();
                        }
                    });
                }
            });
            
            // Fix Masonry Layout Shifts - Refresh ScrollTriggers after all images loaded
            ScrollTrigger.refresh();
        });
    },

    entranceSequence() {
        const hero = document.querySelector(".hero-section");
        const heroBgContainer = document.getElementById("heroBgContainer");
        const heroBg = document.getElementById("heroBg");
        const heroKicker = hero.querySelector(".hero-kicker");
        const heroTitle = hero.querySelector("h1");
        const heroLead = hero.querySelector(".hero-lead");
        const heroActions = hero.querySelector(".hero-actions");
        const heroMeta = hero.querySelector(".hero-meta");
        const nav = document.querySelector(".nav-shell");

        const tl = gsap.timeline();

        // Parallax & Smooth Zoom Init
        if (heroBg && heroBgContainer) {
            // Entrance Zoom handled by the image
            gsap.to(heroBg, {
                scale: 1,
                duration: 3,
                ease: "power2.out"
            });

            // Parallax on Scroll handled by the container (avoids transformation conflicts)
            gsap.to(heroBgContainer, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Entrance Animation
        tl.fromTo(nav, 
            { y: -30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.2, ease: "power4.out" }
        )
        .fromTo(heroKicker, 
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, 
            "-=0.8"
        )
        .fromTo(heroTitle, 
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.4, ease: "expo.out" }, 
            "-=0.7"
        )
        .fromTo(heroLead, 
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out" }, 
            "-=1.1"
        )
        .fromTo(heroActions ? heroActions.children : [], 
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 
            "-=1"
        )
        .fromTo(heroMeta ? heroMeta.children : [], 
            { y: 10, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }, 
            "-=0.8"
        );

        this.initScrollReveals();
        this.initHeaderTransitions();
    },

    initScrollReveals() {
        const sections = document.querySelectorAll(".section-block");

        sections.forEach(section => {
            const heading = section.querySelector(".section-heading");
            const items = section.querySelectorAll(".reveal, .knowledge-card, .publication-card, .team-card, .institution-card");

            if (heading) {
                gsap.fromTo(heading, 
                    { y: 50, autoAlpha: 0 },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 1,
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }

            if (items.length > 0) {
                gsap.fromTo(items, 
                    { y: 60, autoAlpha: 0 },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 1.2,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: items[0],
                            start: "top 90%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        });
    },

    initHeaderTransitions() {
        const header = document.querySelector(".site-header");
        
        ScrollTrigger.create({
            start: "top -50",
            onUpdate: (self) => {
                if (self.direction === 1) {
                    header.classList.add("scrolled");
                } else if (self.scroll() < 50) {
                    header.classList.remove("scrolled");
                }
            }
        });
    },

    initMagneticEffects() {
        const magneticElements = document.querySelectorAll(".btn-primary-custom, .btn-outline-custom, .btn-article, .navbar-brand");

        magneticElements.forEach(el => {
            el.addEventListener("mousemove", (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(el, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            el.addEventListener("mouseleave", () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    },

    initCardGlows() {
        const cards = document.querySelectorAll(".knowledge-card, .publication-card, .team-card");

        cards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                card.style.setProperty("--mouse-x", `${x}%`);
                card.style.setProperty("--mouse-y", `${y}%`);
            });
        });
    }
};
