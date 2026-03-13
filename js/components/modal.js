import { byId, qsa } from "../core/dom.js";
import { on } from "../core/events.js";

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

        if (lightboxClose) {
            lightboxClose.focus();
        }
    }

    function closeLightbox() {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
        document.body.style.overflow = "";

        if (previouslyFocusedElement instanceof HTMLElement) {
            previouslyFocusedElement.focus();
        }
    }

    qsa(".masonry-item").forEach((item) => {
        item.setAttribute("tabindex", "0");

        const openFromItem = () => {
            const image = item.querySelector("img");
            if (!image) {
                return;
            }

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
