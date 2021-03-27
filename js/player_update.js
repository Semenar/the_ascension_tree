function playerUpdate(delta) {
    player.layers[0].propagateBoost();
    for (let layer of player.layers) {
        layer.processTimedelta(delta);
    }
}