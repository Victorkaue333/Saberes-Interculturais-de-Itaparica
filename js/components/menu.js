import { byId, qs, qsa } from "../core/dom.js";
import { on, onAll } from "../core/events.js";
import { debounce } from "../utils/debounce.js";

function getHeaderOffset() {
    const navShell = qs(".nav-shell");
    return (navShell ? navShell.offsetHeight : 80) + 22;
}

export function initMenu({ prefersReducedMotion = false } = {}) {
    const siteHeader = qs(".site-header");
    const navLinks = qsa(".navbar-nav .nav-link");
    const collapseElement = byId("mainNav");
    const backToTop = byId("backToTop");

    const syncScrollPadding = () => {
        document.documentElement.style.scrollPaddingTop = `${getHeaderOffset()}px`;
    };

    syncScrollPadding();
    on(window, "resize", debounce(syncScrollPadding, 80));

    function closeMobileMenu() {
        if (!collapseElement || !collapseElement.classList.contains("show")) {
            return;
        }

        if (window.bootstrap && window.bootstrap.Collapse) {
            window.bootstrap.Collapse.getOrCreateInstance(collapseElement).hide();
        }
    }

    onAll(qsa('a[href^="#"]'), "click", (event) => {
        if (!(event.currentTarget instanceof HTMLAnchorElement)) {
            return;
        }

        const targetId = event.currentTarget.getAttribute("href");
        if (!targetId || targetId === "#") {
            return;
        }

        const target = qs(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        const targetTop =
            target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() + 2;

        window.scrollTo({
            top: targetTop,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        closeMobileMenu();
    });

    if (navLinks.length && "IntersectionObserver" in window) {
        const sections = qsa("main section[id]");
        const activeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id = entry.target.id;
                    const navTargetId =
                        id === "territorio" ? "projeto" : id === "instituicoes" ? "equipe" : id;

                    navLinks.forEach((link) => {
                        const isActive = link.getAttribute("href") === `#${navTargetId}`;
                        link.classList.toggle("active", isActive);
                    });
                });
            },
            {
                rootMargin: "-45% 0px -45% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => activeObserver.observe(section));
    }

    let ticking = false;
    const onScroll = () => {
        const y = window.scrollY;
        if (siteHeader) {
            siteHeader.classList.toggle("scrolled", y > 20);
        }

        if (backToTop) {
            backToTop.classList.toggle("show", y > 480);
        }

        ticking = false;
    };

    on(
        window,
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(onScroll);
                ticking = true;
            }
        },
        { passive: true }
    );

    onScroll();

    on(backToTop, "click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });
}
