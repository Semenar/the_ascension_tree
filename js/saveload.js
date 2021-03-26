const SAVENAME = "tahperaislcfeonodlesd";

function local_save() {
    localStorage.setItem(SAVENAME, JSON.stringify(player.save()));
}

function local_load() {
    if (SAVENAME in localStorage) player.load(JSON.parse(localStorage.getItem(SAVENAME)));
}

function hard_reset() {
    localStorage.removeItem(SAVENAME);
    player.reset();
    player.current_layer.selectLayer();
}