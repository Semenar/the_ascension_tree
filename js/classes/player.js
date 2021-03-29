class Player {
    constructor() {
        this.reset();
        // Explicitly don't reset settings in the reset() function
        this.animations = true;
        this.singleclick = false;
        this.zoomModifier = 0.5;
    }

    reset(seed) {
        this.last_time_ts = Date.now();

        this.seed = seed || Math.floor(Math.random() * 4294967296);
        this.incompleteSeed = false;
        document.getElementById("seedDisplay").innerText = `Seed: ${this.seed}`;
        document.getElementById("seedDisplay").className = '';
        
        if (this.layers) {
            for (let layer of this.layers) {
                layer.el.remove();
            }
        }
        this.layers = [];
        this.layers.push(new Layer(this.seed));

        this.current_layer = this.layers[0];
    }

    save() {
        let data = [];
        data.push(this.last_time_ts);

        let layer_data = [];
        for (let layer of this.layers) {
            layer_data.push(layer.save());
        }
        data.push(layer_data);

        data.push(this.current_layer.id);

        data.push(this.animations);
        data.push(this.singleclick);
        data.push(this.zoomModifier);
        data.push(this.seed);
        data.push(this.incompleteSeed);
        return data;
    }

    load(data) {
        this.last_time_ts = data[0];
        
        if (data.length > 7) {
            this.seed = data[6];
            this.incompleteSeed = data[7];
        } else if (data.length > 6) {
            this.seed = data[6];
            this.incompleteSeed = true;
        } else {
            this.seed = Math.floor(Math.random() * 4294967296);
            this.incompleteSeed = true;
        }

        for (let layer of this.layers) {
            layer.el.remove();
        }
        this.layers = [];
        for (let layer of data[1]) {
            this.layers.push(new Layer(this.seed));
            this.layers[this.layers.length - 1].load(this, layer);
        }

        this.current_layer = this.layers[data[2]];
        this.animations = data.length > 3 ? data[3] : true;
        this.singleclick = data.length > 4 ? data[4] : false;
        this.zoomModifier = data.length > 5 ? data[5] : 0.5;
        document.getElementById("animations-toggle").innerText = this.animations ? "Enabled" : "Disabled";
        document.getElementById("singleclick-toggle").innerText = this.singleclick ? "Single Click" : "Double Click";
        if (Object.entries(zoomOptions).find(([key, value]) => value === this.zoomModifier) !== undefined)
            document.getElementById("zoomModifier").value =
                Object.entries(zoomOptions).find(([key, value]) => value === this.zoomModifier)[0];
        document.getElementById("seedDisplay").innerText = `Seed: ${this.seed}`;
        document.getElementById("seedDisplay").className = this.incompleteSeed ? 'incompleteSeed' : '';

        requestAnimationFrame(() => {
            this.current_layer.selectLayer(true, true);
        });
    }
};

