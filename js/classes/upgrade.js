class Upgrade {
    constructor(layer, id, type, effect=new Decimal(1), target="points", cost=new Decimal(1), rand=Math.random) {
        this.layer = layer; 
        this.id = id;
        this.type = type; // type: add, mul, pow, mul_log, mul_pow
        this.effect = effect;
        this.target = target;
        this.cost = cost;

        this.name = choose(VERBS, rand);

        this.bought = false;

        this.depends_on = [];
        // subscribe
        if (this.target != "points") {
            this.layer.upgrades[this.target].depends_on.push(this.id);
        }
    }

    copyUpgrade(other) {
        this.id = other.id;
        this.type = other.type;
        this.effect = other.effect;
        this.target = other.target;
        this.cost = other.cost;

        this.name = other.name;

        this.depends_on = [];
        // subscribe
        if (this.target != "points") {
            this.layer.upgrades[this.target].depends_on.push(this.id);
        }
    }

    buy() {
        if (!this.canBuy()) return;
        this.bought = true;
        this.layer.points = this.layer.points.sub(this.cost);
    }

    canBuy() {
        return this.cost.lte(this.layer.points);
    }

    getEffect() {
        if (this.type == "add" || this.type == "mul" || this.type == "pow") return this.effect;

        let affected_number = this.layer.points;
        if (this.target != "points") affected_number = this.layer.upgrades[this.target].getEffect();

        if (this.type == "mul_log") return affected_number.max(1).log10().max(1).pow(this.effect);
        if (this.type == "mul_pow") return affected_number.max(1).pow(this.effect);
    }

    applyEffect(number, total=this.layer.points) {
        if (!(number instanceof Decimal)) number = new Decimal(number);
        if (!this.bought) return number;

        let effect = new Decimal(this.effect);
        for (let dependency of this.depends_on) effect = this.layer.upgrades[dependency].applyEffect(effect);

        if (this.type == "add") return number.add(effect);
        if (this.type == "mul") return number.mul(effect);
        if (this.type == "pow") return number.pow(effect);
        if (this.type == "mul_log") return number.mul(total.max(1).log10().max(1).pow(effect));
        if (this.type == "mul_pow") return number.mul(total.max(1).pow(effect));
    }

    applyReverseEffect(number, total=this.layer.points) {
        if (!(number instanceof Decimal)) number = new Decimal(number);
        if (!this.bought) return number;

        let effect = new Decimal(this.effect);
        for (let dependency of this.depends_on) effect = this.layer.upgrades[dependency].applyEffect(effect, total);

        if (this.type == "add") return number.sub(effect);
        if (this.type == "mul") return number.div(effect);
        if (this.type == "pow") return number.root(effect);
        if (this.type == "mul_log") return number.div(total.max(1).log10().max(1).pow(effect));
        if (this.type == "mul_pow") return number.div(total.max(1).pow(effect));
    }

    screenUpdate() {
        let container = document.getElementById(this.id);
        if (container !== null && container !== undefined) {
            if (!this.canBuy() || this.bought) container.disabled = true;
            else container.disabled = false;
            if (this.bought) container.classList.add("complete");
            else container.classList.remove("complete");
            container.getElementsByClassName('upgrade-name')[0].textContent = this.name;
            container.getElementsByClassName('effect')[0].textContent = formatNumber(this.getEffect(), !(this.type == "add" || this.type == "mul" || this.type == "pow"));
            container.getElementsByClassName('cost')[0].textContent = formatNumber(this.cost, false, true);
        }
    }

    getDescCode() {
        if (this.target == "points") {
            if (this.type == "add") return 'Get <span class="effect"></span> <span class="point-name"></span> per second';
            if (this.type == "mul") return 'Get <span class="effect"></span>&times; more <span class="point-name"></span>';
            if (this.type == "pow") return 'Raise <span class="point-name"></span> gain to the power of <span class="effect"></span>';
            if (this.type == "mul_log") return 'Boost <span class="point-name"></span> gain based on them<br>Current: <span class="effect"></span>';
            if (this.type == "mul_pow") return 'Boost <span class="point-name"></span> gain based on them<br>Current: <span class="effect"></span>';
        }
        else {
            if (this.type == "add") return 'Add <span class="effect"></span> to the power of "' + this.layer.upgrades[this.target].name + '" upgrade';
            if (this.type == "mul") return '"' + this.layer.upgrades[this.target].name + '" upgrade is <span class="effect"></span>&times; more powerful';
            if (this.type == "pow") return 'Raise the power of "' + this.layer.upgrades[this.target].name + '" upgrade to the power of <span class="effect"></span>';
        }
    }

    save() {
        let data = [];
        data.push(this.id);
        data.push(this.name);
        data.push(this.type);
        data.push([this.effect.sign, this.effect.layer, this.effect.mag]);
        data.push(this.target);
        data.push([this.cost.sign, this.cost.layer, this.cost.mag]);
        data.push(this.bought);
        return data;
    }

    load(layer, data) {
        this.layer = layer;
        this.id = data[0];
        this.name = data[1];
        this.type = data[2];
        this.effect.fromComponents(data[3][0], data[3][1], data[3][2]);
        this.target = data[4];
        this.cost.fromComponents(data[5][0], data[5][1], data[5][2]);
        this.bought = data[6];
        // subscribe
        if (this.target != "points") {
            this.layer.upgrades[this.target].depends_on.push(this.id);
        }
    }
}
