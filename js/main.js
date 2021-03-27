var player = new Player();

let last_local_save = -1;

function gameLoop() {
    let current_time = Date.now();

    if (last_local_save < current_time - 1000) {
        if (last_local_save == -1) local_load();
        else local_save();
        last_local_save = current_time;
    }

    let delta = current_time - player.last_time_ts;
    player.last_time_ts = current_time;

    playerUpdate(delta);
    screenUpdate();

    setTimeout(gameLoop, 50);
}

var tree = document.getElementById("tree");
var panzoom = Panzoom(tree, { canvas: true, maxScale: 1e100, step: 1 })
tree.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

window.addEventListener("resize", () => player.current_layer.selectLayer(true));

requestAnimationFrame(() => {
    player.current_layer.selectLayer(true);
    gameLoop();
});
