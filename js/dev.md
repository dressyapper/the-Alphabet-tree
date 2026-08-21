upgrades: {
    11: {
        title: "Example",
        description: "Does something",
        cost: new Decimal(1),
        unlocked() { return true },
    },
    12: {
        title: "effect upgrade",
        description: "",
        cost: new Decimal(12),
        unlocked() {return true},
        effectCap() {
            let cap = new Decimal(10)
            return cap
        },
        effect() {
            let cap = this.effectCap()
            let eff = player.points.add(1).log(x).add(1)
            if (eff.gte(cap)) {
                return cap
            }
            else {
                return eff
            }
        },
        effectDisplay() {
            if (this.effect().gte(this.effectCap())) {
                return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
            }
            else {
                return format(upgradeEffect(this.layer, this.id))+"x"
            }
        },
    }
}

tabFormat: {
    "Tab": {
        content: [
            ["display-text",
                function(){
                    let a = "tab"
                    return a
                }
            ],
            ["upgrades", [1]],
            "buyables"
            ["infobox", "name"],
        ],

        unlocked() {return true}
    },
},

clickables: {
    11: {
        title: "click",
        canClick() {return true},
        onClick() {
            
        },
        display() {
            return "this is so display"
        },
        style() {return {
            'width': '100px',
        }},
        
    },
}

milestones: {
    1: {
        requirementDescription: "milestone",
        effectDescription: "effect",
        unlocked() {return true},
        done() { return true }
        effect() {
            return new Decimal(1)
        }
    },
}

achievements: {
    11: {
        name: "Acheievement",
        done() {
            return true
        },
        tooltip: "this shows when your did it!!!",
        unlocked() {
            return true
        },
        style() {
            return {
                
            }
        }
    },
    12: {
        name: "Amazing",
        done() {
            return true
        },
         tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    let desc = "shwo when comepteltety"
                    let effectdesc = "boo"
                    return desc+"<br>"+effectdesc+"<br>Currently: "+this.effect()+""
                }
                else {
                    let desc = "no get ackh"
                    return desc
                }
            },
        unlocked() {
            return true
        },
        style() {
            return {
                
            }
        }
        effect() {
            return new Decimal(1)
        }
        effectDisplay() {
            return "hi"
        }
    }
}
challenges: {
    12: {
        name: "challenge",
        challengeDescription() { 
            let x = "win"
            return x
        },
        canComplete(){
            return player.points.gte(3)
        },
        unlocked() { 
            return (true) 
        },
        currencyDisplayName: "points",
        completionLimit: 2,
        rewardDescription() {
            let x = "win"
            return x
        },
        onEnter() {
            player.points = player.points
        }
    }
}

infoboxes: {
    infobox: {
        title: "box",
        body() { return "hi" },
    },
},  

buyables: {
    11: {
        title: "Buyable",
        unlocked() { return true },
        cost(x) {
            return x.add(1)
        },
        display() {
            return "Cost: " + format(this.cost()) + " things." + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
        },
        canAfford() {
            return player[this.layer].points.gte(this.cost())
        },
        buy() {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
            let eff = new Decimal(2)
            return eff
        },
    },
}
















**Additive glow color**
glowColor() {
        let color = String(this.color).slice(4, this.color.length-1).split(",")
        let glowColor = ["50", "50", "50"]

        let newColor = [Number(color[0])+Number(glowColor[0]),Number(color[1])+Number(glowColor[1]),Number(color[2])+Number(glowColor[2])]
        return "rgb("+newColor[0]+","+newColor[1]+","+newColor[2]+")"
    },


























onPrestige(gain) {
        if (hasMilestone("A", 2)) {
            player["&"].points = player["&"].points.add(player[this.layer].ampersandformula(gain))
        }
    },
    prestigeButtonText(gain) {
        try {
            if (tmp[this.layer].layerShown && player[this.layer].ampersandformula(tmp[this.layer].resetGain).gte(1)) {
                return `${player[this.layer].points.lt(1e3) ? (tmp[this.layer].resetDescription !== undefined ? tmp[this.layer].resetDescription : "Reset for ") : ""}+<b>${formatWhole(tmp[this.layer].resetGain)}</b> ${tmp[this.layer].resource} ${tmp[this.layer].resetGain.lt(100) && player[this.layer].points.lt(1e3) ? `<br><br>Next at ${(tmp[this.layer].roundUpCost ? formatWhole(tmp[this.layer].nextAt) : format(tmp[this.layer].nextAt))} ${tmp[this.layer].baseResource}` : ""}` + "<b><br> and +"+formatWhole(player[this.layer].ampersandformula(tmp[this.layer].resetGain))+" &"
            }
            else {
                return `${player[this.layer].points.lt(1e3) ? (tmp[this.layer].resetDescription !== undefined ? tmp[this.layer].resetDescription : "Reset for ") : ""}+<b>${formatWhole(tmp[this.layer].resetGain)}</b> ${tmp[this.layer].resource} ${tmp[this.layer].resetGain.lt(100) && player[this.layer].points.lt(1e3) ? `<br><br>Next at ${(tmp[this.layer].roundUpCost ? formatWhole(tmp[this.layer].nextAt) : format(tmp[this.layer].nextAt))} ${tmp[this.layer].baseResource}` : ""}`
            }
        }
        catch {
            return "Please wait..."
        }
    },
    passiveGeneration() {
        let pg = new Decimal(0.01)

        if (hasUpgrade("B", 24)) pg = new Decimal(0.1)
        return pg
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    infoboxes: {
        start: {
            title: "The beginning",
            body: "Welcome to the Alphabet tree! This is going to be pretty long so good luck!<br>LP = Lexiconal Points",
        },
    },  
    upgrades: {
        11: {
            title: "A first upgrade",
            description: "+1 LP gain",
            cost: new Decimal(1),
            unlocked() {return true},
        },
        12: {
            title: "The second upgrade",
            description: "+1 LP gain",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade("A", 11)},
        },
        13: {
            title: "Self Powering",
            description: "Boost A based on itself",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade("A", 12)},
            effectCap() {
                let cap = new Decimal(10)
                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.A.points.add(1).log(1e3).add(1)
                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },
        },
        14: {
            title: "Point Powering",
            description: "Boost LP based on A",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade("A", 13)},
            effectCap() {
                let cap = new Decimal(100)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.A.points.add(1).log(100).add(1)
                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },
        },
        15: {
            title: "Very simple",
            description: "1.3x LP",
            cost: new Decimal(7),
            unlocked() {return hasUpgrade("A", 14)},
        },
        16: {
            title: "Not very simple",
            description: "Boost LP based on LP",
            cost: new Decimal(12),
            unlocked() {return hasUpgrade("A", 15)},
            effectCap() {
                let cap = new Decimal(10)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.points.add(1).log(75).add(1)
                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },
        },
        21: {
            title: "Two birds with one stone",
            description: "1.25x LP and A",
            cost: new Decimal(15),
            unlocked() {return hasUpgrade("A", 16)},
        },
        22: {
            title: "Guys I think this upgrade might be associated with the number 2",
            description: "2.22x LP",
            cost: new Decimal(22),
            unlocked() {return hasUpgrade("A", 21)},
        },
        23: {
            title: "Something new",
            description: "-1 A requirement",
            cost: new Decimal(30),
            unlocked() {return hasUpgrade("A", 22)},
        },
        24: {
            title: "LPLP",
            description: "2x LP",
            cost: new Decimal(40),
            unlocked() {return hasUpgrade("A", 23)},
        },
        25: {
            title: "LPLPLP",
            description: "3x LP",
            cost: new Decimal(60),
            unlocked() {return hasUpgrade("A", 24)},
        },
        26: {
            title: "AAAAAAA",
            description: "7x A and a new layer",
            cost: new Decimal(100),
            unlocked() {return hasUpgrade("A", 25)},
        },
        31: {
            title: "A not so new beginning",
            description: "Boost A based on total A",
            cost: new Decimal(1.5e7),
            unlocked() {return hasUpgrade("B", 23)},
            effectCap() {
                let cap = new Decimal(10)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.A.total.add(1).log(25).add(1)
                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },
        },
        32: {
            title: "Quite Simple",
            description: "Boost LP by LP but wait...",
            cost: new Decimal(4.5e8),
            unlocked() {return hasUpgrade("A", 31)},
            effectCap() {
                let cap = new Decimal(1e15)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.A.total.add(1).log(1.01).add(1)
                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return "+"+format(upgradeEffect(this.layer, this.id))+" (CAPPED)"
                }
                else {
                    return "+"+format(upgradeEffect(this.layer, this.id))
                }
            },
        },
        33: {
            title: "Very Simple",
            description: "If LP is greater than A then 1.5x LP but if lower then 4.5x LP but if you have a specific upgrade always 3x",
            cost: new Decimal(4.5e9),
            unlocked() {return hasUpgrade("A", 32)},
            effect() {
                if (player.points.gte(player.A.points)) {
                    return new Decimal(1.5)
                }
                else {
                    return new Decimal(4.5)
                }
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },
        34: {
            title: "Very Complex",
            description: "2x LP",
            cost: new Decimal(1.5e10),
            unlocked() {return hasUpgrade("A", 33)},
        },
        35: {
            title: "Maybe overpowered",
            description: "The requirement for A is /1.5",
            cost: new Decimal(4.5e10),
            unlocked() {return hasUpgrade("A", 34)},
        },
        36: {
            title: "Aoost",
            description: "10x A",
            cost: new Decimal(1e11),
            unlocked() {return hasUpgrade("A", 35)},
        },
    },
    milestones: {
        1: {
            requirementDescription: "1e12 A",
            effectDescription: "5x A",
            unlocked() {return true},
            done() {return player.A.points.gte(1e12)},
        },
        2: {
            requirementDescription: "1e18 A",
            effectDescription: "Unlock Ampersand",
            unlocked() {return true},
            done() {return player.A.points.gte(1e15)},
        },
    },
    tabFormat: {
        "Start": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "upgrades",
                "blank",
                ["infobox", "start"],
            ],
    
            unlocked() {return true}
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "milestones",
                "blank",
            ],
    
            unlocked() {return hasAchievement("Ach", 21)}
        },
    },
})

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
	if (hasUpgrade("B", 23)) gain = gain.times(2)
	if (hasUpgrade("A", 32)) gain = gain.add(upgradeEffect("A", 32))	
	if (hasUpgrade("A", 33)) gain = gain.times(upgradeEffect("A", 33))
	if (hasUpgrade("A", 34)) gain = gain.times(2)
	if (hasMilestone("B", 1)) gain = gain.times(2)
	if (hasMilestone("B", 2)) gain = gain.times(10)
	if (hasMilestone("B", 3)) gain = gain.times(25)
