let vars = require("vars")

function build_ui() {
    print("starting ui build...");
    Vars.ui.hudGroup.fill(cons(t => {
        let togglestyle = Styles.clearToggleTransi;
        t.button(Icon.units, togglestyle, () => {
            if (vars.playerai == null) {
                vars.playerai = true;
            } else {
                vars.playerai = null;
            }
        }).update(b => b.setChecked(!!vars.playerai)).width(46).height(46).name("autoxp").tooltip("toggle automatic xp farm");
    }));
}


module.exports = {
    build_ui: build_ui
}