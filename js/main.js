import { initKnowledgeAccordion } from "./components/accordion.js";
import { initMenu } from "./components/menu.js";
import { initLightbox } from "./components/modal.js";
import { initContatoPage } from "./pages/contato.js";
import { initHomePage } from "./pages/home.js";

function bootstrap() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    initMenu({ prefersReducedMotion });
    initKnowledgeAccordion();
    initLightbox();
    initHomePage({ prefersReducedMotion });
    initContatoPage();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
    bootstrap();
}
