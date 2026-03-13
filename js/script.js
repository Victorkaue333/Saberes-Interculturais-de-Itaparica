(() => {
    if (document.getElementById("saberes-main-module")) {
        return;
    }

    const moduleScript = document.createElement("script");
    moduleScript.id = "saberes-main-module";
    moduleScript.type = "module";
    moduleScript.src = "js/main.js";
    document.head.appendChild(moduleScript);
})();
