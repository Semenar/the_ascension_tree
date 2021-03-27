function screenUpdate() {
    document.getElementById("root_points").textContent = formatNumber(player.layers[0].points, true, true);
    document.getElementById('root_gain').textContent = formatNumber(player.layers[0].calculateProduction(), true);

    player.current_layer.screenUpdateCurrent();

    for (let layer of player.layers) {
        layer.screenUpdate();
    }
}