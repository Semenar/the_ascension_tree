function chooseDict(dict, rand=Math.random) {
    if (Object.keys(dict).length == 0) return undefined;

    let sum = 0;
    for (let key of Object.keys(dict)) {
        sum += dict[key];
    }

    sum *= rand();
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

function choose(list, rand=Math.random) {
    return list[Math.min(Math.floor(rand() * list.length), list.length - 1)];
}

function openModal(id) {
    closeModal();
    document.getElementById(id).style.display = "";
}
function closeModal() {
    for (let element of document.getElementsByClassName('modal-container')) {
        element.style.display = "none";
    }
}

// Simple Fast Counter is a part of PractRand suite by Chris Doty-Humphrey.

function sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}