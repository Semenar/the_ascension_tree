class Player {
    constructor() {
        this.reset();
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

        requestAnimationFrame(() => {
            this.current_layer.selectLayer(true);
        });
    }
};

