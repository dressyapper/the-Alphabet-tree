addLayer("$", {
    name: "$", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "$", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        shown: false,
        
		points: new Decimal(0),
    }},
    color: "rgb(64, 255, 0)",
    glowColor: "rgb(255, 0, 0)",
    requires() {return new Decimal(0).add(new Decimal(1e20).pow(player["$"].total.sub(1)))}, // Can be a function that takes requirement increases into account
    resource: "$", // Name of prestige currency
    baseResource: "LP", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        exp = player[this.layer].points.times(1e20).add(1)
        return exp
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetsNothing: true,
    layerShown(){
        if (player.C.shown) {
            player[this.layer].shown = true
        }
        return player[this.layer].shown
    },
    infoboxes: {
        format: {
            title: "Perma",
            body: "This layer includes upgrades that stay forever and is not a layer full of microtransations despite how the layer looks<br>",
        }
    },
    upgrades: {
        11: {
            title: "& Love",
            description: "Always show &",
            cost: new Decimal(1),
            unlocked() {return true},
        },
        12: {
            title: "& Nation",
            description: "Keep & upgrades",
            cost: new Decimal(2),
            unlocked() {return tmp["&"].layerShown},
        },
        13: {
            title: "Achievement Points",
            description: "Unlock Achievement Points which boost point gain depending on how many you have",
            cost: new Decimal(2),
            unlocked() {return tmp["&"].layerShown},
        },
        14: {
            title: "AutoTime 3000",
            description: "Unlock AutoTime which changes the Daytime on D automatically",
            cost: new Decimal(3),
            unlocked() {return tmp["&"].layerShown && tmp["D"].layerShown},
        },
        
        
    },
    clickables: {
        11: {
            title: "Respec",
            canClick() {return true},
            onClick() {
                for (i in player["$"].upgrades) {
                    player["$"].points = player["$"].points.add(tmp['$'].upgrades[player["$"].upgrades[i]].cost)
                }
                doReset(Object.values(ROW_LAYERS[getHighestUnlockedRow()])[0], true)
                player["$"].upgrades = []
            },
            display() {
                return "Respec all your upgrades but reset your highest layer without any bonuses"
            },
            
        },
    },
    tabFormat: {
        "Start": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "clickables",
                "upgrades",
                "blank",
                ["infobox", "format"],
            ],
    
            unlocked() {return true}
        },
        "Milestones": {
            content: [
                "main-display",
                "blank",
                "milestones",
                "blank",
            ],
    
            unlocked() {return hasAchievement("Ach", 21)}
        },
    },
})
