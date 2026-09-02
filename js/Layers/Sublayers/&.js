addLayer("&", {
    name: "&", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "&", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        shown: false,
        
		points: new Decimal(0),
        keep: {
            upgs: []
        },

        unlockedextra: false,
        resetrow: 3, //the minimum row reset to be done for & to reset and not save everything

    }},
    color: "rgb(91, 91, 91)",
    glowColor: "rgb(150,150,150)",
    requires: new Decimal(1e20), // Can be a function that takes requirement increases into account
    resource: "&", // Name of prestige currency
    baseResource: "A", // Name of resource prestige is based on
    baseAmount() {return player.A.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    doReset(reset) {
        if (layers[reset].row <= this.row) return 
        let keep = []

        if (hasUpgrade("$", 12)) {keep.push("upgrades")}

        layerDataReset(this.layer, keep)

    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetsNothing: true,
    branches: ["A", "&"],
    layerShown(){
        if (hasUpgrade("$",11) || hasMilestone("A", 2)) {
            player[this.layer].shown = true
        }
        return player[this.layer].shown
    },
    constant() {
        if (hasUpgrade("&", 71) && player.auto.bbuyables && !inChallenge("C", 14)) {
            buyBuyable("B", 11)
            if (hasUpgrade("B", 31)) {
                buyBuyable("B", 12)
            }
        }   
    },
    infoboxes: {
        format: {
            title: "Format",
            body: "Reset A to earn & for upgrades relating to automation<br>FORMAT: {TYPE}-{LAYER}{ID}<br>Example:<br> U-A11 would be the upgrade of the A layer with id 11, or the first upgrade of the first row<br> M-B2 would be the second milestone of layer B<br>U-B12-16 would be all upgrades between the upgrades with the id 12 and 16",
        }
    },
    upgrades: {
        11: {
            title: "& Introduction",
            description: "Automate A upgrades",
            cost: new Decimal(1),
            unlocked() {return true},
            onPurchase() {
   
            }
        },
        12: {
            title: "Automator II",
            description: "Automate B upgrades",
            cost: new Decimal(1e60),
            unlocked() {return hasAchievement("Ach", 26)},
            onPurchase() {
  
            }
        },
        13: {
            title: "Automator III",
            description: "Automate C upgrades",
            cost: new Decimal(1e180),
            unlocked() {return hasAchievement("Ach", 41)},
            onPurchase() {
  
            }
        },

        71: {
            title: "B Buyable Automator",
            description: "Permanently buy both B buyables constantly",
            cost: new Decimal(1e100),
            unlocked() {return true},
            onPurchase() {
                player.auto.bbuyables = true
            }
        },
        72: {
            title: "B Buyable? More like B requirementable! im sorry.",
            description: "Both B buyables no longer take away B",
            cost: new Decimal(1e200),
            unlocked() {return true},
        },
        73: {
            title: "B buyable keepers",
            description: "B buyables do not reset on prestige",
            cost: new Decimal(1e300),
            unlocked() {return true},
        }

    },
    milestones: {
        1: {
            requirementDescription: "1e9 &",
            effectDescription: "Improve the & gain formula",
            unlocked() {return true},
            done() {return player["&"].points.gte(1e9)},
        },
        2: {
            requirementDescription: "1e100 &",
            effectDescription: "Unlock extras",
            unlocked() {return true},
            done() {return player["&"].points.gte(1e100)},
        },
    },
    tabFormat: {
        "A": {
            content: [
                "main-display",
                ["display-text", function() {
                    if (tmp.A.ampersandformula.lt(0.01)) {
                        let x = "On A reset, you will earn >0.01 &"
                        return x
                    }
                    else {
                        let x = "On A reset, you will earn "+formatWhole(tmp.A.ampersandformula)+"   &"
                        return x
                    }
                }],
                "blank",
                ["upgrades", [1]],
                "blank",
                ["infobox", "format"],
            ],
    
            unlocked() {return true}
        },
        "Extra": {
            content: [
                "main-display",
                ["display-text", function() {
                    if (tmp.A.ampersandformula.lt(0.01)) {
                        let x = "On A reset, you will earn >0.01 &"
                        return x
                    }
                    else {
                        let x = "On A reset, you will earn "+formatWhole(tmp.A.ampersandformula)+"   &"
                        return x
                    }
                }],
                "blank",
                ["upgrades", [7]],
                "blank",
                ["infobox", "format"],
            ],
    
            unlocked() {
                return hasMilestone("&", 2) || hasUpgrade("&", 71)
            }
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
