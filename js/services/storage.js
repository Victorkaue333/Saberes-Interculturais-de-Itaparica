function isStorageAvailable(storage) {
    try {
        const probeKey = "__saberes_probe__";
        storage.setItem(probeKey, "1");
        storage.removeItem(probeKey);
        return true;
    } catch (error) {
        return false;
    }
}

export function getStorageItem(key, { storage = window.localStorage } = {}) {
    if (!key || !isStorageAvailable(storage)) {
        return null;
    }

    try {
        return storage.getItem(key);
    } catch (error) {
        return null;
    }
}

export function setStorageItem(key, value, { storage = window.localStorage } = {}) {
    if (!key || !isStorageAvailable(storage)) {
        return false;
    }

    try {
        storage.setItem(key, value);
        return true;
    } catch (error) {
        return false;
    }
}

export function removeStorageItem(key, { storage = window.localStorage } = {}) {
    if (!key || !isStorageAvailable(storage)) {
        return false;
    }

    try {
        storage.removeItem(key);
        return true;
    } catch (error) {
        return false;
    }
}
