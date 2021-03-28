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

// those two are not used
async function import_save() {
    player.load(JSON.parse(atob(await navigator.clipboard.readText())));
}

function export_save() {
	navigator.clipboard.writeText(btoa(JSON.stringify(player.save())));
}

//

function exportToClipboard() {
    navigator.clipboard.writeText(document.getElementById('export_save').value);
}

function importFromClipboard() {
    navigator.clipboard.readText().then(clipText => document.getElementById('import_save').value = clipText);
}

function importSave() {
    let backup = player.save();
    try {
        player.load(JSON.parse(atob(document.getElementById('import_save').value)));
        closeModal();
    }
    catch (e) {
        player.load(backup);
    }
}