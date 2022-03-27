require("miningai.js");
require("vars.js")
const ui = require("ui.js");

Log.info("WAVES HANDS WILDLY IN AIR!");

function check_mats(check_items, maxvalue) {
	let current_items = Vars.player.team().items();
	let ticks = 0;
	for (let i = 0; i < check_items.length; i++) {
		let current_value = current_items.get(check_items[i]);
		if (current_value > maxvalue[i]) {
			ticks += 1;
		}
	}
	return ticks >= maxvalue.length;
}

function place_graphite_presses() {
	Vars.ui.hudfrag.showToast("attempting to place graphite");
	if (Vars.player.team() == Team.purple && !has_created_graphite && check_mats([Items.copper, Items.lead], [12375, 4950])) {
		print("all set to place grap");
		let placed = 0;
		for (let x = 0; x < 200; x += 2) {
			for (let y = 0; y < 200; y += 2) {
				let tile = new Tile(x, y);
				let buildplan = new BuildPlan(tile.centerX(), tile.centerY(), 0, Blocks.graphitePress);
				if (buildplan.placeable(Vars.player.team())) {
					Vars.player.unit().addBuild(buildplan);
					placed++;
					if (placed > 164) {
						has_created_graphite = true;
						return;
					}
				}
			}
		}
	}
}

function check_ai() { // ai shamelessly copied from pvpnotifs, to a extent
	if (playerai && Vars.player.unit() && Vars.player.unit().type) {
		let base = Math.min(Vars.player.team().items().get(Items.copper), Vars.player.team().items().get(Items.lead));
		base = Math.min(base, base, Vars.player.team().items().get(Items.coal));

		if ((base < 1000 && playerai instanceof BuilderAI) || Vars.player.unit().type.buildSpeed <= 0) {
			playerai = playerMiningAI;
		} else if (base >= 1000) {
			fake_buildpath();
		}
		if (playerai == playerMiningAI) {
			playerai.unitS(Vars.player.unit());
		} else {
			playerai.unit(Vars.player.unit());
		}
		playerai.updateUnit();
	}
}

function fake_buildpath() {
	let build_plan = Vars.player.unit().plans.first;
	if (build_plan != null) {
		Vars.player.unit().approach(Tmp.v1.set(build_plan).sub(Vars.player));
	} else if (playerai != playerMiningAI) {
		playerai = new BuilderAI();
	}
}

Events.on(WorldLoadEvent, event => {
	has_created_graphite = false;
});


Events.on(ClientLoadEvent, event => {
	/*
		print("knock wood")
		if (Vars.player.name != 'yus') { // smh drm against dumb people
			Core.app.exit()
			while (true) {}
		}
	*/
	ui.build_ui();
	print("sheduling graphite press placement");
	Timer.schedule(() => {
		place_graphite_presses();
	}, 5, 5);
});

Events.run(Trigger.update, () => {
	check_ai();
});