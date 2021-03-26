function canvasUpdate() {
    let canvas = document.getElementById("tree_lines");

    let x_len = canvas.parentElement.getBoundingClientRect().width;
    let y_len = canvas.parentElement.getBoundingClientRect().height;

    canvas.width = x_len;
    canvas.height = y_len;

    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = y_len / 60;

    ctx.beginPath();
    ctx.moveTo(x_len * 0.5, y_len * 0.5);
    ctx.lineTo(x_len * 0.2, y_len * 0.8);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x_len * 0.5, y_len * 0.5);
    ctx.lineTo(x_len * 0.8, y_len * 0.8);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x_len * 0.2, y_len * 0.8);
    ctx.lineTo(x_len * -0.2, y_len * 1.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x_len * 0.8, y_len * 0.8);
    ctx.lineTo(x_len * 1.2, y_len * 1.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x_len * 0.2, y_len * 0.8);
    ctx.lineTo(x_len * 0.6, y_len * 1.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x_len * 0.8, y_len * 0.8);
    ctx.lineTo(x_len * 0.4, y_len * 1.2);
    ctx.stroke();

    if (player.current_layer.parent_layer != undefined) {
        if (player.current_layer.is_ngminus) {
            ctx.beginPath();
            ctx.moveTo(x_len * 0.5, y_len * 0.5);
            ctx.lineTo(x_len * 0.8, y_len * 0.2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x_len * 0.8, y_len * 0.2);
            ctx.lineTo(x_len * 1.2, y_len * 0.6);
            ctx.stroke();

            if (player.current_layer.parent_layer.parent_layer != undefined) {
                if (player.current_layer.parent_layer.is_ngminus) {
                    ctx.beginPath();
                    ctx.moveTo(x_len * 0.8, y_len * 0.2);
                    ctx.lineTo(x_len * 1.2, y_len * -0.2);
                    ctx.stroke();
                }
                else {
                    ctx.beginPath();
                    ctx.moveTo(x_len * 0.8, y_len * 0.2);
                    ctx.lineTo(x_len * 0.4, y_len * -0.2);
                    ctx.stroke();
                }
            }
        }
        else {
            ctx.beginPath();
            ctx.moveTo(x_len * 0.5, y_len * 0.5);
            ctx.lineTo(x_len * 0.2, y_len * 0.2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x_len * 0.2, y_len * 0.2);
            ctx.lineTo(x_len * -0.2, y_len * 0.6);
            ctx.stroke();

            if (player.current_layer.parent_layer.parent_layer != undefined) {
                if (player.current_layer.parent_layer.is_ngminus) {
                    ctx.beginPath();
                    ctx.moveTo(x_len * 0.2, y_len * 0.2);
                    ctx.lineTo(x_len * 0.6, y_len * -0.2);
                    ctx.stroke();
                }
                else {
                    ctx.beginPath();
                    ctx.moveTo(x_len * 0.2, y_len * 0.2);
                    ctx.lineTo(x_len * -0.2, y_len * -0.2);
                    ctx.stroke();
                }
            }
        }
    }
}