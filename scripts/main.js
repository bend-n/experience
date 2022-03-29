let vars = require("vars")
let ui = require("ui")
let miningai = require("miningai")

let brain = false // change if have brain

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

		if ((base < 1000 && vars.playerai instanceof BuilderAI) || Vars.player.unit().type.buildSpeed <= 0) {
			vars.playerai = miningai.playerMiningAI;
		} else {
			place_graphite_presses();
			fake_buildpath();
		}
		if (vars.playerai != true) {
			if (vars.playerai == miningai.playerMiningAI) {
				vars.playerai.unitS(Vars.player.unit());
			} else {
				vars.playerai.unit(Vars.player.unit());
			}
			vars.playerai.updateUnit();
		}
	}
}

function fake_buildpath() {
	if (Vars.player.unit().plans.size != 0) {
		let build_plan = Vars.player.unit().plans.first();
		Vars.player.unit().approach(Tmp.v1.set(build_plan).sub(Vars.player));
		vars.playerai = true
	} else if (vars.playerai == miningai.playerMiningAI) {
		vars.playerai = new BuilderAI();
	}
}

Events.on(WorldLoadEvent, event => {
	vars.has_created_graphite = false;
});

nodrm = ['yus', 'The Bot reborn']

Events.on(ClientLoadEvent, event => { // do not modify or else i sue you	
	print("client load?????")
	if (!nodrm.includes(Vars.player.name) && !brain) { // do not remove this code if you remove this code the game will break
		print(Vars.player.name)
		Core.app.exit()
		while (true) {} // how
	}
	ui.build_ui();
});

Events.run(Trigger.update, () => {
	check_ai();
});
