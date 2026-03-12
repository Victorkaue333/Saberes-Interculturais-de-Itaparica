(() => {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const siteHeader = document.querySelector(".site-header");
    const navLinks = Array.from(document.querySelectorAll(".navbar-nav .nav-link"));
    const collapseElement = document.getElementById("mainNav");
    const backToTop = document.getElementById("backToTop");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }

    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }

    function getHeaderOffset() {
        const navShell = document.querySelector(".nav-shell");
        return (navShell ? navShell.offsetHeight : 80) + 22;
    }

    function syncScrollPadding() {
        document.documentElement.style.scrollPaddingTop = `${getHeaderOffset()}px`;
    }

    syncScrollPadding();
    window.addEventListener("resize", syncScrollPadding);

    function closeMobileMenu() {
        if (!collapseElement || !collapseElement.classList.contains("show")) {
            return;
        }
        if (window.bootstrap && window.bootstrap.Collapse) {
            window.bootstrap.Collapse.getOrCreateInstance(collapseElement).hide();
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");
            if (!targetId || targetId === "#") {
                return;
            }
            const target = document.querySelector(targetId);
            if (!target) {
                return;
            }

            event.preventDefault();
            const targetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() + 2;
            window.scrollTo({
                top: targetTop,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });

            closeMobileMenu();
        });
    });

    if (navLinks.length) {
        const sections = Array.from(document.querySelectorAll("main section[id]"));
        if ("IntersectionObserver" in window) {
            const activeObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }
                        const id = entry.target.id;
                        const navTargetId = id === "territorio" ? "projeto" : id === "instituicoes" ? "equipe" : id;
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
    }

    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        if (siteHeader) {
            siteHeader.classList.toggle("scrolled", y > 20);
        }
        if (backToTop) {
            backToTop.classList.toggle("show", y > 480);
        }
        ticking = false;
    }

    window.addEventListener(
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

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }

    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.16,
                rootMargin: "0px 0px -10% 0px"
            }
        );

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    document.querySelectorAll(".knowledge-toggle").forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            if (!targetId) {
                return;
            }

            const detail = document.getElementById(targetId);
            if (!detail) {
                return;
            }

            const expanded = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!expanded));
            detail.hidden = expanded;
            button.textContent = expanded ? "Ler mais" : "Recolher";
        });
    });

    let previouslyFocusedElement = null;

    function openLightbox(imageSource, altText, captionText) {
        if (!lightbox || !lightboxImage || !lightboxCaption) {
            return;
        }

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
        if (!lightbox || !lightboxImage) {
            return;
        }

        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
        document.body.style.overflow = "";

        if (previouslyFocusedElement instanceof HTMLElement) {
            previouslyFocusedElement.focus();
        }
    }

    document.querySelectorAll(".masonry-item").forEach((item) => {
        item.setAttribute("tabindex", "0");

        const openFromItem = () => {
            const image = item.querySelector("img");
            if (!image) {
                return;
            }
            const caption = item.getAttribute("data-caption") || image.alt;
            openLightbox(image.src, image.alt, caption);
        };

        item.addEventListener("click", openFromItem);
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFromItem();
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox && lightbox.classList.contains("open")) {
            closeLightbox();
        }
    });

    document.querySelectorAll(".copy-citation").forEach((button) => {
        const defaultLabel = button.textContent || "Copiar citação";

        button.addEventListener("click", async () => {
            const citation = button.getAttribute("data-citation") || "";
            if (!citation.trim()) {
                return;
            }

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(citation);
                    button.textContent = "Citação copiada";
                } else {
                    button.textContent = "Copie manualmente";
                }
            } catch (error) {
                button.textContent = "Não foi possível copiar";
            }

            window.setTimeout(() => {
                button.textContent = defaultLabel;
            }, 1800);
        });
    });

    const mapElement = document.getElementById("community-map");
    const mapStatus = document.getElementById("mapStatus");
    const externalMapLink = document.getElementById("openMapExternal");

    function setMapStatus(message) {
        if (mapStatus) {
            mapStatus.textContent = message;
        }
    }

    function renderEmbeddedMap(lat, lng, title) {
        if (!mapElement) {
            return;
        }

        const iframe = document.createElement("iframe");
        iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=12&output=embed`;
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        iframe.title = title || "Mapa da comunidade";
        iframe.setAttribute("aria-label", title || "Mapa da comunidade");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";

        mapElement.innerHTML = "";
        mapElement.appendChild(iframe);
    }

    function buildInfoWindowContent(title, description) {
        return `<div style="font-family: 'Source Sans 3', sans-serif; max-width: 240px; line-height: 1.4; color: #2a211c;">
            <strong style="display:block; margin-bottom: 4px;">${title}</strong>
            <span>${description}</span>
        </div>`;
    }

    function initializeGoogleMap(lat, lng, title, description) {
        if (!mapElement || !window.google || !window.google.maps) {
            renderEmbeddedMap(lat, lng, title);
            setMapStatus("Mapa em modo simplificado.");
            return;
        }

        const center = { lat, lng };

        const map = new window.google.maps.Map(mapElement, {
            center,
            zoom: 11,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
                { elementType: "geometry", stylers: [{ color: "#efe3d2" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#6d5c50" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#fdf7ef" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ color: "#d2c2ad" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#b6c9cf" }] },
                { featureType: "poi", stylers: [{ visibility: "off" }] }
            ]
        });

        const marker = new window.google.maps.Marker({
            position: center,
            map,
            title
        });

        const infoWindow = new window.google.maps.InfoWindow({
            content: buildInfoWindowContent(title, description)
        });

        marker.addListener("click", () => {
            infoWindow.open({
                anchor: marker,
                map
            });
        });

        infoWindow.open({
            anchor: marker,
            map
        });

        setMapStatus("Mapa interativo carregado via Google Maps API.");
    }

    function loadGoogleMapsScript(apiKey, lat, lng, title, description) {
        if (window.google && window.google.maps) {
            initializeGoogleMap(lat, lng, title, description);
            return;
        }

        window.initCommunityMap = () => initializeGoogleMap(lat, lng, title, description);

        const existingScript = document.getElementById("googleMapsSdk");
        if (existingScript) {
            return;
        }

        setMapStatus("Carregando mapa interativo...");

        const script = document.createElement("script");
        script.id = "googleMapsSdk";
        script.async = true;
        script.defer = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=initCommunityMap`;

        script.onerror = () => {
            renderEmbeddedMap(lat, lng, title);
            setMapStatus("Não foi possível carregar a API do Google Maps. Exibindo mapa simplificado.");
        };

        document.head.appendChild(script);
    }

    if (mapElement) {
        const lat = Number.parseFloat(mapElement.getAttribute("data-lat") || "");
        const lng = Number.parseFloat(mapElement.getAttribute("data-lng") || "");
        const title = mapElement.getAttribute("data-title") || "Comunidade pesquisada";
        const description = mapElement.getAttribute("data-description") || "Localização de referência da pesquisa.";

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            if (externalMapLink) {
                externalMapLink.href = `https://www.google.com/maps?q=${lat},${lng}`;
            }

            const inlineApiKey = mapElement.getAttribute("data-api-key") || "";
            const globalApiKey = typeof window.SABERES_GOOGLE_MAPS_API_KEY === "string" ? window.SABERES_GOOGLE_MAPS_API_KEY : "";
            const apiKey = (globalApiKey || inlineApiKey).trim();

            if (apiKey) {
                loadGoogleMapsScript(apiKey, lat, lng, title, description);
            } else {
                renderEmbeddedMap(lat, lng, title);
                setMapStatus("Mapa em modo simplificado. Configure a chave da Google Maps API para habilitar recursos interativos.");
            }
        } else {
            setMapStatus("Coordenadas do mapa não configuradas.");
        }
    }
})();
