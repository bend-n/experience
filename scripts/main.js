let has_created_graphite = false;

function check_mats(check_items, maxvalue) {
    let current_items = Vars.player.team().items();
    let ticks = 0;
    for (let i = 0; i < check_items.length; i++) {
        let current_value = current_items.get(check_items[i])
        if (current_value > maxvalue[i]) {
            ticks += 1;
        }
    }
    return ticks >= maxvalue.length;
}

function place_graphite_presses() {
    if (!has_created_graphite && check_mats([Items.copper, Items.lead], [12375, 4950])) {
        let placed = 0;
        for (let x = 0; x < 200; x += 2) { 
            for (let y = 0; y < 200; y += 2) {
                let tile = new Tile(x, y);
                let buildplan = new BuildPlan(tile.centerX(), tile.centerY(), 0, Blocks.graphitePress); 
                if (buildplan.placeable(Vars.player.team())) {
                    Vars.player.unit().addBuild(buildplan); 
                    placed++;
                    print(placed);
                    if (placed > 164) {
                        has_created_graphite = true;
                        return;
                    }
                }
            }
        }
    }
}

Events.on(WorldLoadEvent, event => {
    has_created_graphite = false
});

Timer.schedule(() => {
    place_graphite_presses();
}, 0.3, 0.3)