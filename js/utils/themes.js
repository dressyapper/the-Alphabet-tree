// ************ Themes ************
var themes =  ["default"]

var colors = {
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	Alphabet: {
		1: "rgb(255, 255, 255)",
		2: "rgb(255, 255, 255)",
		3: "rgb(255, 255, 255)",
		color: "rgb(255, 255, 255)",
		points: "rgb(255, 255, 255)",
		locked: "rgb(44, 0, 0)",
		background: "rgb(95, 0, 0)",
		background_tooltip: "rgba(255, 255, 255, 0.5)",
	},
	Black: {
		1: "rgb(0, 0, 0)",
		2: "rgb(0, 0, 0)",
		3: "rgb(0, 0, 0)",
		color: "rgb(46, 46, 46)",
		points: "rgb(255, 255, 255)",
		locked: "rgb(0, 0, 0)",
		background: "rgb(0, 0, 0)",
		background_tooltip: " rgba(0, 0, 0, 0.5)",
	},
	Christmas: {
		1: "rgb(255, 255, 255)",
		2: "rgb(255, 255, 255)",
		3: "rgb(255, 255, 255)",
		color: "rgb(255, 0, 0)",
		points: "rgb(0, 255, 0)",
		locked: "rgb(64, 0, 0)",
		background: "rgb(200, 200, 200)",
		background_tooltip: " rgba(0, 0, 0, 0.5)",
	},
	Diamond: {
		1: "rgb(255, 255, 255)",
		2: "rgb(255, 255, 255)",
		3: "rgb(255, 255, 255)",
		color: "rgb(255, 255, 255)",
		points: "rgb(255, 255, 255)",
		locked: "rgb(0, 99, 112)",
		background: "rgb(0, 225, 255)",
		background_tooltip: " rgba(0, 125, 255, 0.5)",
	},
}
function changeTheme() {

	colors_theme = colors[options.theme || "default"];
	document.body.style.setProperty('--background', colors_theme["background"]);
	document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
	document.body.style.setProperty('--color', colors_theme["color"]);
	document.body.style.setProperty('--points', colors_theme["points"]);
	document.body.style.setProperty("--locked", colors_theme["locked"]);
}
function getThemeName() {
	return options.theme? options.theme : "default";
}

function switchTheme() {
	let index = themes.indexOf(options.theme)
	if (options.theme === null || index >= themes.length-1 || index < 0) {
		options.theme = themes[0];
	}
	else {
		index ++;
		options.theme = themes[index];
	}
	changeTheme();
	resizeCanvas();
}



function addTheme(theme) {
	if (!themes.includes(theme)) {
		themes.push(theme)
	}
}
