function chooseDict(dict) {
    if (Object.keys(dict).length == 0) return undefined;

    let sum = 0;
    for (let key of Object.keys(dict)) {
        sum += dict[key];
    }

    sum *= Math.random();
    for (let key of Object.keys(dict)) {
        sum -= dict[key];
        if (sum <= 0) return key;
    }

    return Object.keys(dict)[0];
}

function mixColors(color_a, color_b) {
    return [Math.round(Math.sqrt(color_a[0] * color_a[0] / 2 + color_b[0] * color_b[0] / 2)),
    Math.round(Math.sqrt(color_a[1] * color_a[1] / 2 + color_b[1] * color_b[1] / 2)),
    Math.round(Math.sqrt(color_a[2] * color_a[2] / 2 + color_b[2] * color_b[2] / 2))];
}

function formAsRGB(color) {
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
}

function properPrecision(number, digits) {
    let sign = number.sign;

    let result = "";
    if (sign < 0) result += "-";

    let numlog = number.abs().max(1e-100).log10();
    if (numlog.gt(1e9)) {
        result += "e";
        numlog = numlog.log10();
    }
    numlog = numlog.toNumber();

    if (round_prec(Math.pow(10, numlog - Math.floor(numlog)), Math.pow(10, digits)) == 10) numlog = Math.round(numlog);

    result += pad_number(Math.pow(10, numlog - Math.floor(numlog)), digits);
    result += "e";
    result += Math.floor(numlog);

    return new Decimal(result);
}

function choose(list) {
    return list[Math.min(Math.floor(Math.random() * list.length), list.length - 1)];
}