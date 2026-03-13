import { byId, qsa } from "../core/dom.js";
import { on } from "../core/events.js";
import { loadScriptOnce } from "../services/api.js";
import { setStorageItem } from "../services/storage.js";
import { getCurrentYear } from "../utils/format.js";
import { toFiniteFloat } from "../utils/validators.js";

function initCurrentYear() {
    const currentYear = byId("currentYear");
    if (currentYear) {
        currentYear.textContent = getCurrentYear();
    }
}

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
}

function initRevealElements(prefersReducedMotion) {
    const revealElements = qsa(".reveal");
    if (!revealElements.length) {
        return;
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

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

function initCitationCopy() {
    qsa(".copy-citation").forEach((button) => {
        const defaultLabel = button.textContent || "Copiar citação";

        on(button, "click", async () => {
            const citation = button.getAttribute("data-citation") || "";
            if (!citation.trim()) {
                return;
            }

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(citation);
                    setStorageItem("saberes_last_citation", citation);
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
}

function setMapStatus(mapStatusElement, message) {
    if (mapStatusElement) {
        mapStatusElement.textContent = message;
    }
}

function renderEmbeddedMap(mapElement, lat, lng, title) {
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

function initializeGoogleMap(mapElement, mapStatus, lat, lng, title, description) {
    if (!mapElement || !window.google || !window.google.maps) {
        renderEmbeddedMap(mapElement, lat, lng, title);
        setMapStatus(mapStatus, "Mapa em modo simplificado.");
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

    setMapStatus(mapStatus, "Mapa interativo carregado via Google Maps API.");
}

function loadGoogleMapsScript(mapElement, mapStatus, apiKey, lat, lng, title, description) {
    if (window.google && window.google.maps) {
        initializeGoogleMap(mapElement, mapStatus, lat, lng, title, description);
        return;
    }

    window.initCommunityMap = () =>
        initializeGoogleMap(mapElement, mapStatus, lat, lng, title, description);

    setMapStatus(mapStatus, "Carregando mapa interativo...");

    loadScriptOnce({
        id: "googleMapsSdk",
        src: `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=initCommunityMap`
    }).catch(() => {
        renderEmbeddedMap(mapElement, lat, lng, title);
        setMapStatus(
            mapStatus,
            "Não foi possível carregar a API do Google Maps. Exibindo mapa simplificado."
        );
    });
}

function initCommunityMap() {
    const mapElement = byId("community-map");
    if (!mapElement) {
        return;
    }

    const mapStatus = byId("mapStatus");
    const externalMapLink = byId("openMapExternal");

    const lat = toFiniteFloat(mapElement.getAttribute("data-lat"));
    const lng = toFiniteFloat(mapElement.getAttribute("data-lng"));
    const title = mapElement.getAttribute("data-title") || "Comunidade pesquisada";
    const description =
        mapElement.getAttribute("data-description") || "Localização de referência da pesquisa.";

    if (lat === null || lng === null) {
        setMapStatus(mapStatus, "Coordenadas do mapa não configuradas.");
        return;
    }

    if (externalMapLink) {
        externalMapLink.href = `https://www.google.com/maps?q=${lat},${lng}`;
    }

    const inlineApiKey = mapElement.getAttribute("data-api-key") || "";
    const globalApiKey =
        typeof window.SABERES_GOOGLE_MAPS_API_KEY === "string"
            ? window.SABERES_GOOGLE_MAPS_API_KEY
            : "";
    const apiKey = (globalApiKey || inlineApiKey).trim();

    if (!apiKey) {
        renderEmbeddedMap(mapElement, lat, lng, title);
        setMapStatus(
            mapStatus,
            "Mapa em modo simplificado. Configure a chave da Google Maps API para habilitar recursos interativos."
        );
        return;
    }

    loadGoogleMapsScript(mapElement, mapStatus, apiKey, lat, lng, title, description);
}

export function initHomePage({ prefersReducedMotion = false } = {}) {
    initCurrentYear();
    initIcons();
    initRevealElements(prefersReducedMotion);
    initCitationCopy();
    initCommunityMap();
}
