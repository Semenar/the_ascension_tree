function playerUpdate(delta) {
    player.layers[0].propagateBoost();
    for (let layer of player.layers) {
        layer.processTimedelta(delta);
    }
    if (player.current_layer.points.gt(player.current_layer.final_goal) && (player.current_layer.child_left == undefined || player.current_layer.child_right == undefined)) {
        player.layers.push(new Layer(player.layers.length, player.current_layer, true));
        player.layers.push(new Layer(player.layers.length, player.current_layer, false));
    }
}