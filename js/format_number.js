function formatNumber(number, fixed=false, integer=false) {
    if (!(number instanceof Decimal)) number = new Decimal(number);

    let sign = number.sign;

    let result = "";
    if (sign < 0) result += "-";

    let numlog = number.abs().max(1e-100).log10();
    if (numlog.gt(1e9)) {
        result += "e";
        numlog = numlog.log10();
    }
    numlog = numlog.toNumber();

    // Non-exponential
    if (numlog < 6) {
        let extra_digits = 3;
        if (numlog >= 1) extra_digits = 2;
        if (numlog >= 3) extra_digits = 1;
        if (numlog >= 5) extra_digits = 0;

        if (!integer) result += pad_number(Math.pow(10, numlog), extra_digits, fixed);
        else result += prettify_integer(Math.floor(Math.pow(10, numlog) + 1e-6), ',');
    }
    // Exponential
    else {
        if (round_prec(Math.pow(10, numlog - Math.floor(numlog)), 100) == 10) numlog = Math.round(numlog);

        result += pad_number(Math.pow(10, numlog - Math.floor(numlog)), 2, fixed);
        result += "e";
        result += prettify_integer(Math.floor(numlog), ',');
    }

    return result;
}

function round_prec(x, prec) {
    return Math.round(x * prec) / prec;
}

function pad_number(number, extra_digits, fixed=false) {
    let num = String(round_prec(number, Math.pow(10, extra_digits)));
    if (fixed && extra_digits > 0) {
        if (!num.includes('.')) num += '.';
        for (let rem = extra_digits - num.length + num.indexOf('.') + 1; rem > 0; rem--) num += '0';
    }
    return num;
}

function prettify_integer(number, delimiter="'") {
    let num = String(number);
    let result = "";
    for (let i = 0; i < num.length; i++) {
        result += num[i];
        if (i < num.length - 1 && (num.length - i) % 3 == 1) result += delimiter;
    }
    return result;
}