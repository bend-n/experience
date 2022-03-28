let MiningAI = extend(AIController, {
    // author: xeloboyo
    mining: true,
    targetItem: null,
    ore: null,
    unitS(u) {
        if (this.unit == u) return;
        this.unit = u;
        this.init();
    },
    updateMovement() {
        let unit = this.unit;

        var core = unit.closestCore(); //core is a Building

        if (!(unit.canMine()) || core == null) return;

        if (unit.mineTile != null && !unit.mineTile.within(unit, unit.type.range)) {
            unit.mineTile = null;
        }

        if (this.mining) {
            if (this.timer.get(1, 240) || this.targetItem == null) {
                // let mineItems = unit.team.data().mineItems;
                let mineItems = Seq.with(Items.copper, Items.lead, Items.coal, Items.titanium, Items.thorium);

                this.targetItem = mineItems.min(boolf(i => Vars.indexer.hasOre(i) && unit.canMine(i)), floatf(i => core.items.get(i) - orePriority(i)));


            }

            //core full of the target item, do nothing
            if (this.targetItem != null && core.acceptStack(this.targetItem, 1, unit) == 0) {
                unit.clearItem();
                unit.mineTile = null;
                return;
            }
            //custom player mining ai: todo
            //if inventory is full, drop it off.
            if (unit.stack.amount >= unit.type.itemCapacity || (this.targetItem != null && !unit.acceptsItem(this.targetItem))) {
                this.mining = false;
            } else {
                if (this.targetItem != null) {
                    this.ore = Vars.indexer.findClosestOre(core.x, core.y, this.targetItem);
                }

                if (this.ore != null) {
                    this.moveTo(this.ore, unit.type.range / 4, 20);

                    if (unit.within(this.ore, unit.type.range * 0.5)) {
                        unit.mineTile = this.ore;
                    }

                    if (this.ore.block() != Blocks.air) {
                        this.mining = false;
                    }
                }
            }
        } else {
            unit.mineTile = null;

            if (unit.stack.amount == 0) {
                this.mining = true;
                this.return;
            }

            if (unit.within(core, unit.type.range)) {
                if (core.acceptStack(unit.stack.item, unit.stack.amount, unit) > 0) {
                    Call.transferInventory(Vars.player, core);
                    //Call.transferItemTo(unit, unit.stack.item, unit.stack.amount, unit.x, unit.y, core);
                }

                //unit.clearItem();
                this.mining = true;
            }
            // 
            this.circle(core, unit.type.range / 1.8);
        }
    }
});

function orePriority(item) {
    if (item == Items.copper) {
        return 900;
    }
    if (item == Items.lead) {
        return 850;
    }
    if (item == Items.sand) {
        return 600;
    }
    if (item == Items.coal) {
        return 200;
    }
    if (item == Items.titanium) {
        return 100;
    }
    if (item == Items.thorium) {
        return 0;
    }
    return 0;
}

module.exports = {
    playerMiningAI: MiningAI
}