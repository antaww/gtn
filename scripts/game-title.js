document.addEventListener('DOMContentLoaded', () => {
    const titleContainer = document.querySelector(".game-title-container");
    let x, y, perspective;
    document.body.addEventListener("mousemove", onMove);
    document.body.addEventListener("touchmove", onMove);

    function onMove(e) {
        if (e.type === "touchmove") {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        perspective = {
            x: (x - titleContainer.offsetLeft),
            y: (y - titleContainer.offsetTop)
        };

        titleContainer.style.perspectiveOrigin = perspective.x + "px " + perspective.y + "px";

    }
});