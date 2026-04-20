import { byId, qsa } from "../core/dom.js";
import { on } from "../core/events.js";

/**
 * Knowledge Accordion - Pro Max Upgrade
 * Uses GSAP for smooth height and opacity transitions
 */
export function initKnowledgeAccordion() {
    qsa(".knowledge-toggle").forEach((button) => {
        on(button, "click", () => {
            const targetId = button.getAttribute("data-target");
            if (!targetId) return;

            const detail = byId(targetId);
            if (!detail) return;

            const isExpanded = button.getAttribute("aria-expanded") === "true";
            
            // Toggle state
            button.setAttribute("aria-expanded", String(!isExpanded));
            button.textContent = isExpanded ? "Ler mais" : "Recolher";

            if (isExpanded) {
                // Collapse
                gsap.to(detail, {
                    height: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        detail.hidden = true;
                    }
                });
            } else {
                // Expand
                detail.hidden = false;
                gsap.set(detail, { height: "auto", opacity: 0 });
                const height = detail.offsetHeight;
                gsap.set(detail, { height: 0 });

                gsap.to(detail, {
                    height: height,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power4.out",
                    clearProps: "height"
                });
            }
        });
    });
}
