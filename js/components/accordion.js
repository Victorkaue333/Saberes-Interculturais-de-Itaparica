import { byId, qsa } from "../core/dom.js";
import { on } from "../core/events.js";

export function initKnowledgeAccordion() {
    qsa(".knowledge-toggle").forEach((button) => {
        on(button, "click", () => {
            const targetId = button.getAttribute("data-target");
            if (!targetId) {
                return;
            }

            const detail = byId(targetId);
            if (!detail) {
                return;
            }

            const expanded = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!expanded));
            detail.hidden = expanded;
            button.textContent = expanded ? "Ler mais" : "Recolher";
        });
    });
}
