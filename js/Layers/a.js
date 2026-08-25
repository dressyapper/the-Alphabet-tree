addLayer("A", {
    name: "A", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "rgb(255, 0, 0)",
    milestonePopups: false,
    requires() {
        let req = new Decimal(10)
        if (hasUpgrade("A", 23)) req = req.sub(1)
        if (hasUpgrade("A", 35)) req = req.div(1.5)
        if (hasUpgrade("A", 43)) req = req.div(upgradeEffect("A", 43))
        if (hasUpgrade("A", 46)) req = req.div(1.5)
        return req
    },
    autoUpgrade() {
        return hasUpgrade("&", 11) && !(inChallenge("C", 14) || inChallenge("C", 15))
    },
    ampersandformula() {
        let x = tmp[this.layer].resetGain
        let d = new Decimal(1e20)
        if (hasMilestone("&", 1)) {d = d.div(1e2)}
        if (hasUpgrade("C", 15)) {d = d.div(1e8)}
        if (hasChallenge("C", 14)) {d = d.div(1e9)}
        if (hasAchievement("Ach", 34)) {d = d.div(1e1)}
        if (hasUpgrade("C", 25)) {d = d.div(1e10)}
        if (buyableEffect("A", 11).gte(1)) {d = d.div(buyableEffect("A",11))}
        if (hasUpgrade("C", 32)) {d = d.div(1e30)}
        try {
            return x.div(d).add(new Decimal(hasAchievement("Ach", 33)+0))
        }
        catch {
            return new Decimal(0)
        }
    }, // Can be a function that takes requirement increases into account
    resource: "A", // Name of prestige currency
    baseResource: "Lexiconal Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let exp = new Decimal(0.5)

        if (hasUpgrade("A", 41)) {exp = exp.times(1.1)}

        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("A", 13)) mult = mult.times(upgradeEffect("A", 13))
        if (hasUpgrade("A", 21)) mult = mult.times(1.25)
        if (hasUpgrade("A", 26)) mult = mult.times(7)
        mult = mult.times(layerEffect("B"))
        mult = mult.times(layerEffect("C"))
        mult = mult.times(buyableEffect("B", 11))
        if (hasUpgrade("B", 12)) mult = mult.times(2)	
        if (hasUpgrade("B", 14)) mult = mult.times(upgradeEffect("B", 14))
        if (hasUpgrade("B", 15)) mult = mult.times(2)	
        if (hasUpgrade("A", 31)) mult = mult.times(upgradeEffect("A", 31))
        if (hasUpgrade("A", 36)) mult = mult.times(10)
        if (hasUpgrade("A", 45)) mult = mult.times(2)
        if (hasUpgrade("A", 46)) mult = mult.times(1.5)
        if (hasMilestone("A", 1)) mult = mult.times(5)
        if (hasMilestone("B", 2)) mult = mult.times(10)
        if (hasMilestone("B", 3)) mult = mult.times(25)
        if (hasUpgrade("C", 12)) mult = mult.times(1.2)
        if (hasUpgrade("B", 36)) mult = mult.times(6)
        if (inChallenge("C", 12)) mult = mult.div(tmp.C.challenges["12"].inChallengeEffect)
        if (hasChallenge("C", 12)) mult = mult.times(challengeEffect("C", 12))
        if (inChallenge("C", 13)) mult = mult.div(tmp.C.challenges["13"].inChallengeEffect)
        if (hasUpgrade("B", 41)) mult = mult.times(15)
        if (hasUpgrade("D", 12) && player.D.mode == "Dusk") mult = mult.div(3)
        if (hasUpgrade("D", 12) && player.D.mode == "Dawn") mult = mult.times(player.A.resetTime.pow(0.6))
        if (hasUpgrade("D", 12) && player.D.mode == "Dawn" && player.offTime) mult = mult.times(player.A.resetTime.pow(0.4))
        
        return mult
    },
    onPrestige(gain) {
        if (tmp[this.layer].ampersandformula.gte(0.01)) {
            player["&"].points = player["&"].points.add(tmp[this.layer].ampersandformula)
        }
    },
    doReset(reset) {
        if (layers[reset].row <= this.row) return 

        let keep = []

        layerDataReset(this.layer, keep)
    },
    prestigeButtonText() {
        try {
            if (tmp[this.layer].layerShown && tmp[this.layer].ampersandformula.gte(1)) {
                return `${player[this.layer].points.lt(1e3) ? (tmp[this.layer].resetDescription !== undefined ? tmp[this.layer].resetDescription : "Reset for ") : ""}+<b>${formatWhole(tmp[this.layer].resetGain)}</b> ${tmp[this.layer].resource} ${tmp[this.layer].resetGain.lt(100) && player[this.layer].points.lt(1e3) ? `<br><br>Next at ${(tmp[this.layer].roundUpCost ? formatWhole(tmp[this.layer].nextAt) : format(tmp[this.layer].nextAt))} ${tmp[this.layer].baseResource}` : ""}` + "<b><br> and +"+formatWhole(tmp[this.layer].ampersandformula)+" &"
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
        function cangenerate() {
            let cangen = true

            if (inChallenge("C", 14)) cangen = false

            if (player.offTime) cangen = false
            if (hasUpgrade("D", 12) && player.D.mode == "Dusk") cangen = true


            return cangen
        }
        let pg = new Decimal(0)
        if (hasAchievement("Ach", 22)) {pg = new Decimal(0.01)}
        if (hasUpgrade("B", 24)) pg = new Decimal(0.1)
        if (hasUpgrade("C", 14)) pg = new Decimal(0.35)
        if (hasChallenge("C", 14)) pg = new Decimal(0.5)
        if (!cangenerate()) {
            pg = new Decimal(0)
        }
        return pg
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (inChallenge("C", 15)) exp = new Decimal(0.25)


        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for A", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
                if (hasUpgrade("C", 16)) {
                    return new Decimal(3)
                }
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
        41: {
            title: "Axponent",
            description: "Slightly reduce cost scaling for A",
            cost: new Decimal(1e19),
            unlocked() {return hasUpgrade("A", 36)},
        },
        42: {
            title: "Sub boost",
            description: "& boosts LP slightly",
            cost: new Decimal(1e22),
            unlocked() {return hasUpgrade("A", 41)},
            effectCap() {
                let cap = new Decimal(15)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player["&"].points.pow(0.1).add(1)
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
        43: {
            title: "AntiAnti Boost",
            description: "Divide the requirement for A based on B",
            cost: new Decimal(5e23),
            unlocked() {return hasUpgrade("A", 42)},
            effectCap() {
                let cap = new Decimal(1000)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.B.points.add(1).slog().add(1).times(4)
                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return "/"+format(upgradeEffect(this.layer, this.id))+" (CAPPED)"
                }
                else {
                    return "/"+format(upgradeEffect(this.layer, this.id))
                }
            },
        },
        44: {
            title: "Basic Upgrade",
            description: "22x LP",
            cost: new Decimal(1e24),
            unlocked() {return hasUpgrade("A", 43)},
        },
        45: {
            title: "Big cost jump",
            description: "2x A & 3x LP",
            cost: new Decimal(1e36),
            unlocked() {return hasUpgrade("A", 44)},
        },
        46: {
            title: "Jack of almost all trades",
            description: "1.5x A & 3x LP & 1.2x B & 1.4x B layer effect & /1.2 A requirement",
            cost: new Decimal(4.44e44),
            unlocked() {return hasUpgrade("A", 45)},
        },
        51: {
            title: "You really like big numbers dont you",
            description: "1e3x LP",
            cost: new Decimal(1e50),
            unlocked() {return hasUpgrade("A", 46)},
        }
        
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
            done() {return player.A.points.gte(1e18)},
        },
        3: {
            requirementDescription: "1e43 A",
            effectDescription: "Unlock a buyable",
            unlocked() {return true},
            done() {return player.A.points.gte(1e43)},
        },
    },
    buyables: {
        11: {
            title: "Ampersand Booster",
            description: "Gain more Ampersand",
            purchaseLimit: function() {
                let limit = new Decimal(100)

                if (false) {limit = limit.pow(2)}

                return limit.floor()
            },
            unlocked() {return hasMilestone("A", 3)},
            cost(x) {
                return new Decimal(10).pow(x)
            },
            display() {
                if (this.purchaseLimit()) {
                    return ""+this.description+"<br>Cost: " + format(this.cost()) + " A" + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "/"+this.purchaseLimit()+"<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x" 
                }
                else {
                    return ""+this.description+"<br>Cost: " + format(this.cost()) + " A" + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = new Decimal(10).pow(x)

                return eff
            },
        },
    },
    clickables: {
        11: {
            title: "Popups",
            canClick() {return true},
            onClick() {
                tmp.A.milestonePopups = !tmp.A.milestonePopups
            },
            display() {
                if (tmp.A.milestonePopups) {
                    return "Enabled"
                }
                else {
                    return "Disabled"
                }
            },
            
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
                ["clickables", ["1"]],
                "milestones",
                "blank",
            ],
    
            unlocked() {return hasAchievement("Ach", 21)}
        },
        "Buyables": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "buyables",
                "blank",
            ],
    
            unlocked() {return hasMilestone("A", 3)}
        },
    },
})
