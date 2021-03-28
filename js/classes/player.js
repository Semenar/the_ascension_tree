class Player {
    constructor() {
        this.reset();
        // Explicitly don't reset settings in the reset() function
        this.animations = true;
        this.singleclick = false;
        this.zoomModifier = 1;
    }

    reset() {
        this.last_time_ts = Date.now();

        this.layers = [];
        this.layers.push(new Layer());

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
        return data;
    }

    load(data) {
        this.last_time_ts = data[0];

        for (let layer of this.layers) {
            layer.el.remove();
        }
        this.layers = [];
        for (let layer of data[1]) {
            this.layers.push(new Layer());
            this.layers[this.layers.length - 1].load(this, layer);
        }

        this.current_layer = this.layers[data[2]];
        this.animations = data.length > 3 ? data[3] : true;
        this.singleclick = data.length > 4 ? data[4] : false;
        this.zoomModifier = data.length > 5 ? data[5] : 1;
        document.getElementById("animations-toggle").innerText = this.animations ? "Enabled" : "Disabled";
        document.getElementById("singleclick-toggle").innerText = this.singleclick ? "Single Click" : "Double Click";
        document.getElementById("zoomModifier").value =
            Object.entries(zoomOptions).find(([key, value]) => value === this.zoomModifier)[0];

        requestAnimationFrame(() => {
            this.current_layer.selectLayer(true, true);
        });
    }
};

