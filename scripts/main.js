// jshint esversion: 6
const vars = require("vars");
const miningai = require("experience/miningai");
const ui = require("ui-lib/library");
try {
  ui.addButton("toggle-playerai", "units", () => {
    if (vars.playerai == null) vars.playerai = true;
    else vars.playerai = null;
    Vars.ui.hudfrag.showToast(
      vars.playerai == true ? "enabled playerai" : "disabled playerai"
    );
  });
} catch (e) {
  Log.info(e);
}

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
  if (
    Vars.player.team() == Team.purple &&
    !vars.has_created_graphite &&
    check_mats([Items.copper, Items.lead], [12375, 4950])
  ) {
    Log.info("all set to place grap");
    let placed = 0;
    for (let x = 0; x < 200; x += 2) {
      for (let y = 0; y < 200; y += 2) {
        let tile = new Tile(x, y);
        let buildplan = new BuildPlan(
          tile.centerX(),
          tile.centerY(),
          0,
          Blocks.graphitePress
        );
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
    let base = Math.min(
      Vars.player.team().items().get(Items.copper),
      Vars.player.team().items().get(Items.lead)
    );

    base = Math.min(base, base, Vars.player.team().items().get(Items.coal));
    place_graphite_presses();
    if (Vars.player.unit().plans.size != 0) {
      let build_plan = Vars.player.unit().plans.first();
      Vars.player.unit().approach(Tmp.v1.set(build_plan).sub(Vars.player));
      vars.playerai = "fakebuildpath";
    } else if (vars.playerai != miningai.playerMiningAI && base < 1000) {
      Log.info("becoming miningai");
      vars.playerai = miningai.playerMiningAI;
    } else if (!vars.playerai instanceof BuilderAI) {
      vars.playerai = new BuilderAI();
      Log.info("becoming builderai");
    }

    updateunits();
  }
}

function updateunits() {
  if (
    vars.playerai == miningai.playerMiningAI ||
    vars.playerai instanceof BuilderAI
  ) {
    if (vars.playerai == miningai.playerMiningAI) {
      vars.playerai.unitS(Vars.player.unit());
    } else if (vars.playerai instanceof BuilderAI) {
      vars.playerai.unit(Vars.player.unit());
    }
    vars.playerai.updateUnit();
  }
}

Events.on(EventType.PlayerConnect, (event) => {
  print(Strings.stripColors(event.player.name));
});

Events.on(WorldLoadEvent, (event) => {
  Log.info("debug: cleared all");
});

Events.run(Trigger.update, () => {
  check_ai();
});
