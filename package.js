Package.describe({
    name: "jandres:legacy-drag",
    summary: "Attaches a 'legacy-drag:dragging' and more event on element when being dragged.",
    version: "0.1.0",
    git: "https://github.com/JoeyAndres/legacy-drag.js.git"
});

Package.onUse(function(api) {
    api.versionsFrom("1.2.1");
    api.use([
        "ecmascript"
    ], 'client');

    api.addFiles([
        "legacy-drag.js"
    ]);
});