const pendingScriptLoads = new Map();

export function loadScriptOnce({ id, src, async = true, defer = true }) {
    if (!src) {
        return Promise.reject(new Error("A URL do script é obrigatória."));
    }

    const cacheKey = id || src;
    if (pendingScriptLoads.has(cacheKey)) {
        return pendingScriptLoads.get(cacheKey);
    }

    const existingScript = id
        ? document.getElementById(id)
        : document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
        return Promise.resolve(existingScript);
    }

    const loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = async;
        script.defer = defer;

        if (id) {
            script.id = id;
        }

        script.addEventListener(
            "load",
            () => {
                resolve(script);
            },
            { once: true }
        );

        script.addEventListener(
            "error",
            () => {
                reject(new Error(`Falha ao carregar recurso externo: ${src}`));
            },
            { once: true }
        );

        document.head.appendChild(script);
    });

    pendingScriptLoads.set(cacheKey, loadPromise);
    loadPromise.finally(() => pendingScriptLoads.delete(cacheKey));
    return loadPromise;
}

export async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status} ao acessar ${url}`);
    }

    return response.json();
}
