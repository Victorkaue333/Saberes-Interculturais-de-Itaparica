import { byId, qsa } from "../core/dom.js";
import { on } from "../core/events.js";

/**
 * Lightbox Modal - Pro Max Upgrade
 * Implements GSAP cinematic transitions for image viewing
 */
export function initLightbox() {
    const lightbox = byId("lightbox");
    const lightboxImage = byId("lightboxImage");
    const lightboxCaption = byId("lightboxCaption");
    const lightboxClose = byId("lightboxClose");

    if (!lightbox || !lightboxImage || !lightboxCaption) {
        return;
    }

    let previouslyFocusedElement = null;

    function openLightbox(imageSource, altText, captionText) {
        previouslyFocusedElement = document.activeElement;
        
        lightboxImage.src = imageSource;
        lightboxImage.alt = altText || "Registro ampliado";
        lightboxCaption.textContent = captionText || altText || "Registro visual";
        
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // GSAP Entrance
        gsap.fromTo(lightbox, 
            { autoAlpha: 0 }, 
            { autoAlpha: 1, duration: 0.5, ease: "power2.out" }
        );

        gsap.fromTo(lightboxImage, 
            { scale: 0.8, autoAlpha: 0 }, 
            { scale: 1, autoAlpha: 1, duration: 0.7, ease: "power4.out", delay: 0.1 }
        );

        gsap.fromTo(lightboxCaption, 
            { y: 20, autoAlpha: 0 }, 
            { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", delay: 0.3 }
        );

        if (lightboxClose) {
            lightboxClose.focus();
        }
    }

    function closeLightbox() {
        const tl = gsap.timeline({
            onComplete: () => {
                lightbox.classList.remove("open");
                lightbox.setAttribute("aria-hidden", "true");
                lightboxImage.src = "";
                document.body.style.overflow = "";
                if (previouslyFocusedElement instanceof HTMLElement) {
                    previouslyFocusedElement.focus();
                }
            }
        });

        tl.to(lightboxImage, { scale: 0.9, autoAlpha: 0, duration: 0.4, ease: "power2.in" })
          .to(lightbox, { autoAlpha: 0, duration: 0.3 }, "-=0.2");
    }

    qsa(".masonry-item").forEach((item) => {
        item.setAttribute("tabindex", "0");

        const openFromItem = () => {
            const image = item.querySelector("img");
            if (!image) return;

            const caption = item.getAttribute("data-caption") || image.alt;
            openLightbox(image.src, image.alt, caption);
        };

        on(item, "click", openFromItem);
        on(item, "keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFromItem();
            }
        });
    });

    on(lightboxClose, "click", closeLightbox);

    on(lightbox, "click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    on(document, "keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("open")) {
            closeLightbox();
        }
    });
}
