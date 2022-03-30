let vars = require("vars")
let ui = require("ui")
let miningai = require("experience/miningai")


Log.info("hi werld");

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
	if (Vars.player.team() == Team.purple && !vars.has_created_graphite && check_mats([Items.copper, Items.lead], [12375, 4950])) {
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
						vars.has_created_graphite = true;
						return;
					}
				}
			}
		}
	}
}

function check_ai() {
	if (vars.playerai && Vars.player.unit() && Vars.player.unit().type) {
		let base = Math.min(Vars.player.team().items().get(Items.copper), Vars.player.team().items().get(Items.lead));
		base = Math.min(base, base, Vars.player.team().items().get(Items.coal));
		place_graphite_presses();
		if (Vars.player.unit().plans.size != 0) {
			let build_plan = Vars.player.unit().plans.first();
			Vars.player.unit().approach(Tmp.v1.set(build_plan).sub(Vars.player));
			vars.playerai = "fakebuildpath"
		} else if (vars.playerai != miningai.playerMiningAI && base < 1000) {
			Log.info("becoming miningai")
			vars.playerai = miningai.playerMiningAI;
		} else if (!vars.playerai instanceof BuilderAI) {
			vars.playerai = new BuilderAI();
			Log.info("becoming builderai")
		}

		// updateunit block
		if (vars.playerai == miningai.playerMiningAI || vars.playerai instanceof BuilderAI) {
			if (vars.playerai == miningai.playerMiningAI) {
				vars.playerai.unitS(Vars.player.unit());
			} else if (vars.playerai instanceof BuilderAI) {
				vars.playerai.unit(Vars.player.unit());
			}
			vars.playerai.updateUnit();
		}
		//end updateunit block
	}
}

Events.on(WorldLoadEvent, event => {
	vars.has_created_graphite = false;
});

let faggots = ['dark'];

Events.on(ClientLoadEvent, event => { // do not modify or else i sue you	
	print("client load?????");
	if (faggots.includes(Vars.player.name)) { // do not remove this code if you remove this code the game will break
		print("i hate u")
		Core.app.exit();
		while (true) {} // how
	}
	ui.build_ui();
});

Events.run(Trigger.update, () => {
	check_ai();
});