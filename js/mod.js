let modInfo = {
	name: "The Alphabet Tree",
	author: "me",
	pointsName: "Lexiconal Points",
	modFiles: ["Layers/a.js","Layers/b.js","Layers/c.js","Layers/d.js","Layers/e.js","Layers/f.js","Layers/g.js","Layers/h.js","Layers/i.js","Layers/j.js","Layers/k.js","Layers/l.js","Layers/m.js","Layers/n.js","Layers/o.js","Layers/p.js","Layers/q.js","Layers/r.js","Layers/s.js","Layers/t.js","Layers/u.js","Layers/v.js","Layers/w.js","Layers/x.js","Layers/y.js","Layers/z.js","achievements.js", "tree.js","Layers/Sublayers/&.js", "Layers/Sublayers/$.js", "Layers/Sublayers/QM.js", "Layers/Sublayers/^.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	let x = true

	if (player.D.mode == "Dawn" && player.offTime) x = false
	if (player.paused) x = false
	
	return x
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)

	if (hasAchievement("Ach", 15)) gain = gain.times(achievementEffect("Ach", 15))


	if (hasUpgrade("A", 11)) gain = gain.add(1)
	if (hasUpgrade("A", 12)) gain = gain.add(1)
	if (hasUpgrade("A", 14)) gain = gain.times(upgradeEffect("A", 14))
	if (hasUpgrade("A", 15)) gain = gain.times(1.3)
	if (hasUpgrade("A", 16)) gain = gain.times(upgradeEffect("A", 16))
	if (hasUpgrade("A", 22)) gain = gain.times(2.22)
	if (hasUpgrade("A", 24)) gain = gain.times(2)
	if (hasUpgrade("A", 25)) gain = gain.times(3)	

	if (hasUpgrade("B", 11)) gain = gain.times(2)	
	if (hasUpgrade("B", 13)) gain = gain.times(upgradeEffect("B", 13))
	if (hasUpgrade("B", 14)) gain = gain.times(upgradeEffect("B", 14))
	if (hasUpgrade("B", 15)) gain = gain.times(2)	
	if (hasUpgrade("B", 21)) gain = gain.times(upgradeEffect("B", 21))
	gain = gain.times(buyableEffect("B", 11))
	gain = gain.times(layerEffect("C"))
	if (hasUpgrade("B", 23)) gain = gain.times(2)
	if (hasUpgrade("A", 32)) gain = gain.add(upgradeEffect("A", 32))	
	if (hasUpgrade("A", 33)) gain = gain.times(upgradeEffect("A", 33))
	if (hasUpgrade("A", 34)) gain = gain.times(2)
	if (hasMilestone("B", 1)) gain = gain.times(2)
	if (hasMilestone("B", 2)) gain = gain.times(10)
	if (hasMilestone("B", 3)) gain = gain.times(25)
	if (hasMilestone("B", 4)) gain = gain.times(100)
	if (hasMilestone("B", 5)) gain = gain.times(100)
	if (hasUpgrade("A", 42)) gain = gain.times(upgradeEffect("A", 42))
	if (hasUpgrade("A", 44)) gain = gain.times(22)
	if (inChallenge("C", 11)) gain = gain.div(tmp.C.challenges["11"].inChallengeEffect)
	if (hasChallenge("C", 11)) gain = gain.times(challengeEffect("C", 11))
	if (hasUpgrade("C", 12)) gain = gain.times(1.2)
	if (hasUpgrade("C", 13)) gain = gain.times(10)	
	if (hasAchievement("Ach", 31)) gain = gain.times(achievementEffect("Ach", 31))
	if (hasUpgrade("A", 45)) gain = gain.times(3)
	if (hasUpgrade("A", 46)) gain = gain.times(3)
	if (hasUpgrade("C", 23)) gain = gain.times(upgradeEffect("C", 23))
	if (inChallenge("C", 13)) gain = gain.div(tmp.C.challenges["13"].inChallengeEffect)
	if (hasUpgrade("C", 24)) gain = gain.times(1e4)	
	if (hasUpgrade("B", 44)) gain = gain.times(30)	
	if (hasUpgrade("B", 44)) gain = gain.times(upgradeEffect("B", 44))
	if (hasChallenge("C", 13)) gain = gain.times(challengeEffect("C", 13))
	if (inChallenge("C", 15)) gain = gain.pow(0.25)
	if (hasChallenge("C", 15)) gain = gain.pow(1.1)
	gain = gain.times(layerEffect("D"))
	if (hasUpgrade("$", 13)) gain = gain.times(tmp.Ach.pointeff)











	if (player.D.mode == "Dawn") gain = gain.times(2)
	if (player.D.mode == "Dusk" && !player.offTime) gain = gain.div(5)
	if (player.D.mode == "Dusk" && player.offTime) gain = gain.times(7)
	if (player.D.mode == "Dusk" && !player.offTime && hasUpgrade("D", 12)) gain = gain.div(player.A.points.pow(0.4))

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	paused: false,
	currentChallenge: false,

	hidemilestones: {
		a: false,
		b: false,
	},
	auto: {
		bbuyables: false,
	}
}}

// Display extra things at the top of the page
var displayThings = [
	()=>{
		if (player.paused) {
			return "[DISABLED GENERATION]"
		}
	},
	()=>{
		if (player.currentChallenge) {
			return "Current Challenge: "+player.currentChallenge
		}
		else {
			return ""
		}
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

function changeUpgSize(size) {
	for (i in document.getElementsByClassName("upg")) {
		document.getElementsByClassName("upg")[i].style.width = size+"px"
		document.getElementsByClassName("upg")[i].style.minHeight = size+"px"
		document.getElementsByClassName("upg")[i].style.height = size+"px"
	}
}

function getHighestUnlockedRow() {
	let highest = 0
	for (i in ROW_LAYERS) {
		if (Number(i) == i) {
			for (j in ROW_LAYERS[i]) {
				if (layerShown(j)) {
					if (i > highest) {
						highest = i
					}
				}
			}
		}
	}

	return highest
}

onkeydown = (ev) => {
	if (ev.key == "t") {
		player.paused = !player.paused
	}
	if (ev.key == "r") {
		player.points = new Decimal(0)
	}
}

function offtime(bool) {
	if (hasUpgrade("$", 14) && player.D.auto) {
		if (bool) {
			if (player.D.mode != "Dusk") {
				player.D.mode = "Dusk"
			}
		}
		else {
			if (player.D.mode != "Dawn") {
				player.D.mode = "Dawn"
			}
		}
	}

}

function validateThemes() {
	if (!player || !tmp["Ach"]) return

	themes = player.themes
	let validate = {
		Alphabet: true,
		Black: hasAchievement("Ach", 13),
		Christmas: hasAchievement("Ach", 26),
		Diamond: hasAchievement("Ach", 41),
	}

	for (i in validate) {
		if (validate[i] && !themes.includes(i)) {
			addTheme(i)
			doPopup("milestone", "Added "+i, "Theme added", 2, "red")
		}
	}
}
