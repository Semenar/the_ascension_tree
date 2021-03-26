function screenUpdate() {
    document.getElementById("root_points").textContent = formatNumber(player.layers[0].points, true, true);
    document.getElementById('root_gain').textContent = formatNumber(player.layers[0].calculateProduction(), true);

    player.current_layer.screenUpdateCurrent();

    player.current_layer.screenUpdate('current-node');
    if (player.current_layer.parent_layer == undefined || player.current_layer.is_ngminus) document.getElementsByClassName('og-left-node')[0].style.visibility = "hidden";
    else {
        document.getElementsByClassName('og-left-node')[0].style.visibility = "";
        player.current_layer.parent_layer.screenUpdate('og-left-node');
    }
    if (player.current_layer.parent_layer == undefined || !player.current_layer.is_ngminus) document.getElementsByClassName('og-right-node')[0].style.visibility = "hidden";
    else {
        document.getElementsByClassName('og-right-node')[0].style.visibility = "";
        player.current_layer.parent_layer.screenUpdate('og-right-node');
    }
    if (player.current_layer.child_left == undefined) document.getElementsByClassName('minus-node')[0].classList.add("disabled");
    else {
        document.getElementsByClassName('minus-node')[0].classList.remove("disabled");
        player.current_layer.child_left.screenUpdate('minus-node');
    }
    if (player.current_layer.child_right == undefined) document.getElementsByClassName('plus-node')[0].classList.add("disabled");
    else {
        document.getElementsByClassName('plus-node')[0].classList.remove("disabled");
        player.current_layer.child_right.screenUpdate('plus-node');
    }

    if (player.current_layer.child_left != undefined || player.current_layer.child_right != undefined) {
        document.getElementsByClassName('unlock-req')[0].style.visibility = "hidden";
    }
    else {
        document.getElementsByClassName('unlock-req')[0].style.visibility = "";
        document.getElementById("next_layer_req").textContent = formatNumber(player.current_layer.final_goal);
        if (player.current_layer.points_name != "") document.getElementById("next_layer_currency").textContent = player.current_layer.points_name + " points";
        else document.getElementById("next_layer_currency").textContent = "points";
    }

    canvasUpdate();
}