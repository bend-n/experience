require("vars.js")

export function build_ui() {
	print("starting ui build...");
	Vars.ui.hudGroup.fill(t => {
		let togglestyle = Styles.clearToggleTransi;
		t.button(Icon.units, togglestyle, () => {
			if (playerai == null) {
				playerai = true
			} else {
				playerai = null
			}
		}).update(b => b.setChecked(playerai)).width(26).height(26).name("autoxp").tooltip("toggle automatic xp farm");
	})
}