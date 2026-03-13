export function on(target, eventName, handler, options) {
    if (!target || typeof target.addEventListener !== "function") {
        return;
    }

    target.addEventListener(eventName, handler, options);
}

export function onAll(targets, eventName, handler, options) {
    targets.forEach((target) => on(target, eventName, handler, options));
}
