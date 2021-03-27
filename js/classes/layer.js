class Layer {
    constructor(id=0, parent_layer=undefined, is_ngminus=false) {
        this.parent_layer = parent_layer;
        this.is_ngminus = is_ngminus;

        this.id = id;

        this.points = new Decimal(0);

        this.upgrades = {};

        this.child_left = undefined;
        this.child_right = undefined;

        this.boost = new Decimal(1);

        if (parent_layer !== undefined) {
            if (this.is_ngminus) parent_layer.child_left = this;
            else parent_layer.child_right = this;

            if (this.is_ngminus) {
                this.upgrade_time = parent_layer.upgrade_time.mul(2);
                this.final_goal = parent_layer.final_goal.pow(1.2);
            }
            else {
                this.upgrade_time = parent_layer.upgrade_time.mul(1.5);
                this.final_goal = parent_layer.final_goal.pow(3);
            }

            this.name = parent_layer.name;
            if (this.name == "Original") this.name = "NG";
            if (this.is_ngminus) this.name += "-";
            else this.name += "+";

            this.points_name = choose(ITY_WORDS);

            this.depth = parent_layer.depth + 1;

            if (this.is_ngminus) this.color = mixColors(parent_layer.color, [72, 159, 181]);
            else this.color = mixColors(parent_layer.color, [214, 40, 40]);
        }
        else {
            this.upgrade_time = new Decimal(10);
            this.final_goal = new Decimal(1e10);
            this.name = "Original";
            this.points_name = "";
            this.depth = 0;
            this.color = [19, 138, 54];
        }

        this.generateUpgrades();
        this.balanceUpgrades();
    }

    generateUpgrade() {
        let type_probs = {
            "add": Object.keys(this.upgrades).length == 0 ? (this.depth == 0 ? 0 : 1) : 1 / Object.keys(this.upgrades).length,
            "mul": 0.5,
            "pow": Math.pow(Object.keys(this.upgrades).length, 2) / 100,
            "mul_log": Math.pow(Object.keys(this.upgrades).length, 0.5) / 10,
            "mul_pow": 0//Math.pow(Object.keys(this.upgrades).length, 1) / 50
        }
        let type = chooseDict(type_probs);

        let target_probs = {
            "points": 10
        }
        if (type != "mul_log" && type != "mul_pow") {
            for (let key of Object.keys(this.upgrades)) {
                if (this.upgrades[key].type == type) continue;
                if (this.upgrades[key].type == "mul_log" || this.upgrades[key].type == "mul_pow" || this.upgrades[key].target != "points") continue;
                if (type == "mul" && this.upgrades[key].type != "pow") target_probs[key] = 1;
                if (type == "pow" && this.upgrades[key].type != "add") target_probs[key] = 2;
            }
        }
        let target = chooseDict(target_probs);
        
        let upgrade = new Upgrade(this, this.depth + "_" + Object.keys(this.upgrades).length, type, 0, target, 0);

        this.upgrades[upgrade.id] = upgrade;
    }

    generateUpgrades() {
        if (this.is_ngminus) for (let i = 0; i < 4; i++) this.generateUpgrade();
        if (this.parent_layer == undefined) for (let i = 0; i < 8; i++) this.generateUpgrade();
        else {
            for (let key of Object.keys(this.parent_layer.upgrades)) {
                this.upgrades[key] = new Upgrade(this, key, 0, 0, "points", 0);
                this.upgrades[key].copyUpgrade(this.parent_layer.upgrades[key]);
            }
            if (!this.is_ngminus) for (let i = 0; i < 4; i++) this.generateUpgrade();
        }
    }

    balanceUpgrades() {
        let upgrades_left = Object.keys(this.upgrades).length;
        let last_target = new Decimal(1);
        let inflation_precaution = 1;
        for (let key of Object.keys(this.upgrades)) {
            let separation_pow = upgrades_left;
            if (this.upgrades[key].type == "add") separation_pow = Math.pow(separation_pow, 1.9 + 0.2 * Math.random());
            if (this.upgrades[key].type == "mul") separation_pow = Math.pow(separation_pow, 1.15 + 0.2 * Math.random());
            if (this.upgrades[key].type == "pow") separation_pow = Math.pow(separation_pow, 0.65 + 0.2 * Math.random());
            if (this.upgrades[key].type == "mul_log") separation_pow = Math.pow(separation_pow, 0.9 + 0.2 * Math.random());
            if (this.upgrades[key].type == "mul_pow") separation_pow = Math.pow(separation_pow, 0.6 + 0.2 * Math.random());

            let base_production = this.calculateProduction(this.depth == 0 ? 1 : 0.1 / this.depth, last_target);
            let base_last_target = last_target.max(base_production.mul(this.upgrade_time)).min(this.final_goal.div(last_target).pow(1 / Math.pow(separation_pow, 0.25)).mul(last_target));

            let base_target = properPrecision(this.final_goal.div(base_last_target).pow(1 / separation_pow).mul(base_last_target).round().max(last_target.add(1)).min(this.final_goal), 1);

            let target_production = new Decimal(base_target);
            target_production = target_production.div(this.upgrade_time).max(base_production);

            this.upgrades[key].cost = new Decimal(last_target);

            //console.log(key + ", base: " + formatNumber(base_production));
            //console.log(key + ", target: " + formatNumber(target_production));

            if (this.upgrades[key].target != "points") {
                let root_upgrade = this.upgrades[key].target;
                while (this.upgrades[root_upgrade].target != "points") root_upgrade = this.upgrades[root_upgrade].target;
                for (let key2 of Object.keys(this.upgrades).reverse()) {
                    if (key2 == root_upgrade) break;
                    if (this.upgrades[key2].target != "points") continue;
                    base_production = this.upgrades[key2].applyReverseEffect(base_production, last_target);
                    target_production = this.upgrades[key2].applyReverseEffect(target_production, last_target);
                }
                if (this.upgrades[root_upgrade].type == "add") {
                    //console.log(key + " unraveling, base: " + formatNumber(base_production));
                    //console.log(key + " unraveling, target: " + formatNumber(target_production));
                    let other_prod = base_production.sub(this.upgrades[root_upgrade].applyEffect(1));
                    //console.log("other_prod: " + formatNumber(other_prod));
                    base_production = this.upgrades[root_upgrade].applyEffect(1);
                    target_production = target_production.sub(other_prod);
                }
                if (this.upgrades[root_upgrade].type == "mul") {
                    //console.log(key + " unraveling, base: " + formatNumber(base_production));
                    //console.log(key + " unraveling, target: " + formatNumber(target_production));
                    let other_prod = base_production.div(this.upgrades[root_upgrade].applyEffect(1));
                    //console.log("other_prod: " + formatNumber(other_prod));
                    base_production = this.upgrades[root_upgrade].applyEffect(1);
                    target_production = target_production.div(other_prod);
                }
                if (this.upgrades[root_upgrade].type == "pow") {
                    //console.log(key + " unraveling, base: " + formatNumber(base_production));
                    //console.log(key + " unraveling, target: " + formatNumber(target_production));
                    let other_prod = base_production.root(this.upgrades[root_upgrade].applyEffect(1)).max(2);
                    //console.log("other_prod: " + formatNumber(other_prod));
                    base_production = this.upgrades[root_upgrade].applyEffect(1);
                    target_production = target_production.log(other_prod);
                }

                //console.log(key + ", result base: " + formatNumber(base_production));
                //console.log(key + ", result target: " + formatNumber(target_production));
            }

            this.upgrades[key].bought = true;
            
            if (this.upgrades[key].type == "add") this.upgrades[key].effect = properPrecision(new Decimal(target_production.sub(base_production).max(this.upgrades[key].target == "points" ? 1 : 0.001)), 0);
            if (this.upgrades[key].type == "mul") this.upgrades[key].effect = properPrecision(new Decimal(target_production.div(base_production).max(1.1)), 1);
            if (this.upgrades[key].type == "pow") this.upgrades[key].effect = properPrecision(new Decimal(target_production.log(base_production.max(2)).max(1.001)), 3);
            if (this.upgrades[key].type == "mul_log") this.upgrades[key].effect = new Decimal(target_production.div(base_production).log(last_target.max(1).log10().max(2)).max(0.1));
            if (this.upgrades[key].type == "mul_pow") {
                this.upgrades[key].effect = new Decimal(target_production.div(base_production).log(last_target.max(2)).max(0.001).min(inflation_precaution * 0.3));
                inflation_precaution -= this.upgrades[key].effect.toNumber();
            }

            last_target = new Decimal(base_target);
            upgrades_left -= 1;
        }

        for (let key of Object.keys(this.upgrades)) this.upgrades[key].bought = false;
    }

    calculateProduction(base=1, total=this.points, ignore_add=false) {
        let production = new Decimal(base);
        for (let key of Object.keys(this.upgrades)) {
            if (this.upgrades[key].target == "points" && (!ignore_add || this.upgrades[key].type != "add")) production = this.upgrades[key].applyEffect(production, total);
        }
        production = production.mul(this.boost);
        return production;
    }

    calculateReverseProduction(base=1, total=this.points, ignore_add=false) {
        let production = new Decimal(base);
        production = production.div(this.boost);
        for (let key of Object.keys(this.upgrades).reverse()) {
            if (this.upgrades[key].target == "points" && (!ignore_add || this.upgrades[key].type != "add")) production = this.upgrades[key].applyReverseEffect(production, total);
        }
        return production;
    }

    getBoostValue() {
        let boost = this.points.add(1).log(this.final_goal).pow(0.5).mul(3).add(1);
        // Softcaps
        if (boost.gt(10)) boost = boost.div(10).log10().add(1).mul(10);
        if (boost.gt(1000)) boost = boost.div(1000).log10().add(1).mul(1000);
        if (boost.gt(1e10)) boost = boost.div(1e10).log10().add(1).mul(1e10);

        return boost;
    }

    propagateBoost() {
        this.boost = new Decimal(1);
        if (this.child_left != undefined) this.child_left.propagateBoost();
        if (this.child_right != undefined) this.child_right.propagateBoost();
        if (this.parent_layer != undefined) this.parent_layer.boost = this.parent_layer.boost.mul(this.boost).mul(this.getBoostValue());
    }

    processTimedelta(delta) {
        this.points = this.points.add(this.calculateProduction(this.depth == 0 ? 1 : 0).mul(delta / 1000));
    }

    screenUpdate(id) {
        let obj = document.getElementsByClassName(id)[0];
        obj.style.backgroundColor = formAsRGB(this.color);
    }

    screenUpdateCurrent() {
        let layer_container = document.getElementById('layer_info');

        layer_container.style.setProperty("--color-layer", formAsRGB(this.color));

        layer_container.getElementsByClassName('type')[0].textContent = this.name;
        layer_container.getElementsByClassName('point-amount')[0].textContent = formatNumber(this.points, true, true);
        layer_container.getElementsByClassName('gain-amount')[0].textContent = formatNumber(this.calculateProduction(this.depth == 0 ? 1 : 0), true);

        layer_container.getElementsByClassName('boost-from-value')[0].textContent = formatNumber(this.boost, true);
        layer_container.getElementsByClassName('boost-to-value')[0].textContent = formatNumber(this.getBoostValue(), true);

        if (this.parent_layer == undefined) layer_container.getElementsByClassName('boost-to')[0].style.visibility = "hidden";
        else layer_container.getElementsByClassName('boost-to')[0].style.visibility = "";

        for (let element of layer_container.getElementsByClassName('point-name')) {
            if (this.points_name == "") element.textContent = "points";
            else element.textContent = this.points_name + " points";
        }

        for (let element of layer_container.getElementsByClassName('prev-point-name')) {
            if (this.parent_layer == undefined) element.textContent = "April fools";
            else if (this.parent_layer.points_name == "") element.textContent = "points";
            else element.textContent = this.parent_layer.points_name + " points";
        }

        if (this.parent_layer == undefined) layer_container.getElementsByClassName('prestige')[0].style.visibility = "hidden";
        else layer_container.getElementsByClassName('prestige')[0].style.visibility = "";

        if (this.canPrestige()) {
            layer_container.getElementsByClassName('prestige')[0].disabled = false;
            layer_container.getElementsByClassName('cannot-prestige')[0].style.display = "none";
            layer_container.getElementsByClassName('can-prestige')[0].style.display = "";
        }
        else {
            layer_container.getElementsByClassName('prestige')[0].disabled = true;
            layer_container.getElementsByClassName('cannot-prestige')[0].style.display = "";
            layer_container.getElementsByClassName('can-prestige')[0].style.display = "none";
        }

        for (let element of layer_container.getElementsByClassName('prestige-need')) {
            element.textContent = formatNumber(this.prestigeNeed(), true, true);
        }

        if (this.prestigeGain().gt(100)) layer_container.getElementsByClassName('next-at')[0].style.display = "none";
        else layer_container.getElementsByClassName('next-at')[0].style.display = ""; 

        layer_container.getElementsByClassName('prestige-gain')[0].textContent = formatNumber(this.prestigeGain(), true, true);

        for (let key of Object.keys(this.upgrades)) {
            this.upgrades[key].screenUpdate();
        }
    }

    selectLayer() {
        let layer_container = document.getElementById('layer_info');
        let upgrade_container = layer_container.getElementsByClassName('upgrades-list')[0];

        let upgrade_elements = "";
        for (let key of Object.keys(this.upgrades)) {
            upgrade_elements += '<button class="upgrade" id="' + key + '" onclick="player.current_layer.upgrades[this.id].buy()"><div class="content"><p class="upgrade-name">&nbsp;</p><p class="upgrade-desc">' + this.upgrades[key].getDescCode() + '</p><p class="divider"></p><p class="upgrade-cost">Cost: <span class="cost"></span> <span class="point-name"></span></p></div></button>';
        }

        upgrade_container.innerHTML = upgrade_elements;

        player.current_layer = this;

        screenUpdate();
    }

    canPrestige() {
        return this.prestigeGain().gt(0);
    }

    prestigeGain() {
        if (this.parent_layer == undefined) return new Decimal(0);

        return this.calculateProduction(this.parent_layer.points.max(1).log(this.parent_layer.final_goal).pow(Math.log2(Math.max(1, this.depth) + 1)), this.points, true).floor();
    }

    prestigeNeed() {
        if (this.parent_layer == undefined) return new Decimal(0);

        return this.parent_layer.final_goal.pow(this.calculateReverseProduction(this.prestigeGain().add(1), this.points, true).pow(1 / Math.log2(Math.max(1, this.depth) + 1)));
    }

    prestige() {
        this.points = this.points.add(this.prestigeGain()).round();

        if (this.parent_layer != undefined) this.parent_layer.reset();
        screenUpdate();
    }

    reset() {
        for (let key of Object.keys(this.upgrades)) {
            this.upgrades[key].bought = false;
        }
        this.points = new Decimal(0);
        //if (this.parent_layer != undefined) this.parent_layer.reset();
    }

    save() {
        let data = [];
        data.push(this.id);
        if (this.parent_layer != undefined) data.push(this.parent_layer.id);
        else data.push(-1); 
        data.push(this.is_ngminus);
        data.push([this.points.sign, this.points.layer, this.points.mag]);
        data.push([this.upgrade_time.sign, this.upgrade_time.layer, this.upgrade_time.mag]);
        data.push([this.final_goal.sign, this.final_goal.layer, this.final_goal.mag]);
        data.push(this.name);
        data.push(this.points_name);
        data.push(this.depth);
        data.push(this.color);

        let upgrade_data = [];
        for (let key of Object.keys(this.upgrades)) upgrade_data.push(this.upgrades[key].save());

        data.push(upgrade_data);
        return data;
    }

    load(player, data) {
        this.id = data[0];
        if (data[1] == -1) this.parent_layer = undefined;
        else this.parent_layer = player.layers[data[1]];
        this.is_ngminus = data[2];
        this.points.fromComponents(data[3][0], data[3][1], data[3][2]);
        this.upgrade_time.fromComponents(data[4][0], data[4][1], data[4][2]);
        this.final_goal.fromComponents(data[5][0], data[5][1], data[5][2]);
        this.name = data[6];
        this.points_name = data[7];
        this.depth = data[8];
        this.color = data[9];

        this.upgrades = {};
        for (let upg of data[10]) {
            this.upgrades[upg[0]] = new Upgrade();
            this.upgrades[upg[0]].load(this, upg);
        }

        this.child_left = undefined;
        this.child_right = undefined;

        if (this.parent_layer != undefined) {
            if (this.is_ngminus) this.parent_layer.child_left = this;
            else this.parent_layer.child_right = this;
        }
    }
};
