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

async function import_save() {
	player.load(JSON.parse(atob(await navigator.clipboard.readText())));
}

function export_save() {
	navigator.clipboard.writeText(btoa(JSON.stringify(player.save())));
}