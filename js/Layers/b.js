addLayer("B", {
    name: "B", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    autoUpgrade() {
        return hasUpgrade("&", 12) && !inChallenge("C", 14)
    },
    color: "rgb(255, 106, 0)",
    milestonePopups: true,
    requires() {
        let req = new Decimal(1000)

        if (hasMilestone("B", 3)) req = req.div(2)
        if (hasUpgrade("C", 31)) req = req.div(100)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "B", // Name of prestige currency
    baseResource: "A", // Name of resource prestige is based on
    baseAmount() {return player.A.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let exp = new Decimal(0.1)
        
        return exp
    },
    doReset(reset) {
        if (layers[reset].row <= this.row) return 

        let keep = []


        layerDataReset(this.layer, keep)
    },
    passiveGeneration() {
        function cangenerate() {
            let cangen = true

            if (player.B.points.gte(upgradeEffect("B", 24))) {
                cangen = false
            }
            if (inChallenge("C", 14)) cangen = false

            return cangen
        }
        let pg = new Decimal(0)

        if (hasUpgrade("B", 24)) pg = new Decimal(0.01)
        if (hasUpgrade("B", 34)) pg = new Decimal(0.1)
        if (hasUpgrade("C", 14)) pg = new Decimal(0.2)
        if (hasChallenge("C", 14)) pg = new Decimal(0.35)


        if (player.offTime || !cangenerate()) {
            pg = new Decimal(0)
        }
        return pg
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade("B", 31)) mult = mult.times(buyableEffect("B", 12))
        if (hasAchievement("Ach", 24)) mult = mult.times(new Decimal(0.02).times(getBuyableAmount("B", 12)).add(1))
        if (hasMilestone("B", 6)) mult = mult.times(10)
        if (hasMilestone("B", 7)) mult = mult.times(25)
        if (hasMilestone("B", 8)) mult = mult.times(100)
        if (hasUpgrade("C", 12)) mult = mult.times(1.2)
        if (hasUpgrade("A", 46)) mult = mult.times(1.2)
        if (hasUpgrade("C", 22)) mult = mult.times(22)
        if (inChallenge("C", 13)) mult = mult.div(tmp.C.challenges["13"].inChallengeEffect)
        if (hasUpgrade("C", 33)) mult = mult.times(upgradeEffect("C", 33))
        if (hasAchievement("Ach", 44)) mult = mult.times(10)

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (inChallenge("C", 15)) exp = new Decimal(0.25)
        
        return exp
    },
    effect() {
        let p = new Decimal(0.1)
        if (hasUpgrade("B", 22)) p = p.times(3)
        let effect = player.B.total.pow(p).add(1)
        
        if (hasUpgrade("B", 32)) effect = effect.pow(2)
        if (hasUpgrade("A", 46)) effect = effect.times(1.4)
        return effect
    },
    effectDescription() {
        return "but your total B boosts A by "+format(this.effect())+"x"
    },
    branches: ["A", "B"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "b: Reset for B", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("A", 26)) {
            player[this.layer].shown = true
        }
        return player[this.layer].shown
    },
    upgrades: {
        11: {
            title: "Back to the beginning",
            description: "2x LP",
            cost: new Decimal(2),
            unlocked() {return true},
        },
        12: {
            title: "Rebirth",
            description: "2x A",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade("B", 11)},
        },
        13: {
            title: "Two Birds",
            description: "Boost LP based on B",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade("B", 12)},
            effectCap() {
                let cap = new Decimal(1e15)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.B.points.add(1).log(10).add(1)
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
            title: "Two Stones",
            description: "Boost LP based on A",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade("B", 13)},
            effectCap() {
                let cap = new Decimal(10)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.A.points.add(1).log(15).add(1)
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
            title: "Double Trouble",
            description: "2x LP & A",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade("B", 14)},
        },
        16: {
            title: "B for Buyables",
            description: "Unlock a buyable",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade("B", 15)},
        },
        21: {
            title: "Big Complex",
            description: "Under 10 points, boost points by 100x, but if you have a specific upgrade boost points by 5x always, otherwise boost points by 1.5x",
            cost: new Decimal(5),
            effect() {
                if (hasUpgrade("C", 16)) {
                    return new Decimal(5)
                }
                else if (player.points.lte(10)) {
                    return new Decimal(100)
                }
                else {
                    return new Decimal(1.5)
                }
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            unlocked() {return hasUpgrade("B", 16)},
        },
        22: {
            title: "B for Boost",
            description: "Boost the layer effect for B",
            cost: new Decimal(4),
            unlocked() {return hasUpgrade("B", 21)},
        },
        23: {
            title: "Apgrades",
            description: "1.2x more A and more A upgrades",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade("B", 22)},
        },
        24: {
            title: "Bassive generation",
            description: "Generate 1% of your B reset and 10% of your A reset every second but you can only generate up to a certain amount of B, also does not generate while offline.",
            cost: new Decimal(50),
            effect() {
                let cap = new Decimal(100)
                if (hasUpgrade("B", 26)) {cap = cap.times(3)}
                if (hasUpgrade("B", 33)) {cap = cap.pow(3)}
                if (hasUpgrade("C", 21)) {cap = cap.pow(1.5)}
                if (hasChallenge("C", 14)) {cap = cap.pow(10)}
                return cap
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+" B"
            },
            unlocked() {return hasUpgrade("B", 23)},
        },
        25: {
            title: "Buyable boost",
            description: "Bottom Layer Boost effect is squared",
            cost: new Decimal(125),
            unlocked() {return hasUpgrade("B", 24)},
        },
        26: {
            title: "Big more!",
            description: "Triple how much B you can passively generate",
            cost: new Decimal(200),
            unlocked() {return hasUpgrade("B", 25)},
        },
        31: {
            title: "Buyable 2",
            description: "Unlock a new buyable",
            cost: new Decimal(500),
            unlocked() {return hasUpgrade("B", 26)},
        },
        32: {
            title: "Big Jump",
            description: "The layer effect for B is squared",
            cost: new Decimal(10000),
            unlocked() {return hasUpgrade("B", 31)},
        },
        33: {
            title: "Bassive Generation ^ 3",
            description: "Square how much B you can passively generate",
            cost: new Decimal(25000),
            unlocked() {return hasUpgrade("B", 32)},
        },
        34: {
            title: "Bassive Generation 2",
            description: "Generate 10% of your B",
            cost: new Decimal(50000),
            unlocked() {return hasUpgrade("B", 33)},
        },
        35: {
            title: "Bottom Layer Support Support",
            description: "Square the amount of times you can buy BLS",
            cost: new Decimal(150000),
            unlocked() {return hasUpgrade("B", 34)},
        },
        36: {
            title: "Basket of A's",
            description: "6x A",
            cost: new Decimal(2e9),
            unlocked() {return hasUpgrade("B", 35)},
        },
        41: {
            title: "Vault of A's",
            description: "15x A",
            cost: new Decimal(1.5e11),
            unlocked() {return hasUpgrade("B", 36)},
        },
        42: {
            title: "Vault of LP's",
            description: "30x LP",
            cost: new Decimal(5e13),
            unlocked() {return hasUpgrade("B", 41)},
        },
        43: {
            title: "A of LP's",
            description: "Boost LP based on A",
            cost: new Decimal(1e15),
            unlocked() {return hasUpgrade("B", 42)},
            effectCap() {
                let cap = new Decimal(1e3)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.A.points.add(1).log(10).add(1)
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
        
    },
    buyables: {
        11: {
            title: "Bottom Layer Support",
            description: "Boost A and LP<br>",
            purchaseLimit: function() {
                let limit = new Decimal(25)

                if (hasUpgrade("B", 35)) {limit = limit.pow(2)}

                return limit.floor()
            },
            unlocked() {return hasUpgrade("B", 16)},
            cost(x) {
                return x.pow(2)
            },
            display() {
                if (this.purchaseLimit()) {
                    return ""+this.description+"<br>Cost: " + format(this.cost()) + " B" + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "/"+this.purchaseLimit()+"<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x" 
                }
                else {
                    return ""+this.description+"<br>Cost: " + format(this.cost()) + " B" + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                if (!hasUpgrade("&", 72)) {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = x.add(1)
                if (hasUpgrade("B", 25)) eff = eff.pow(2)

                return eff
            },
        },
        12: {
            title: "Big B boost",
            description: "Boost B",
            purchaseLimit: new Decimal(25),
            unlocked() {return hasUpgrade("B", 31)},
            cost(x) {
                return new Decimal(50).pow(x)
            },
            display() {
                if (this.purchaseLimit) {
                    return ""+this.description+"<br>Cost: " + format(this.cost()) + " B" + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "/"+this.purchaseLimit+"<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x" 
                }
                else {
                    return ""+this.description+"<br>Cost: " + format(this.cost()) + " B" + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                if (!hasUpgrade("&", 72)) {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = new Decimal(2).times(x.add(1))

                return eff
            },
        },
    },
    clickables: {
        11: {
            title: "Autobuy",
            canClick() {return true},
            onClick() {
                player.auto.bbuyables = !player.auto.bbuyables
            },
            display() {
                if (player.auto.bbuyables) {
                    return "Enabled"
                }
                else {
                    return "Disabled"
                }
            },
            unlocked() {
                return hasUpgrade("&", 71)
            }
            
        },
        12: {
            title: "Popups",
            canClick() {return true},
            onClick() {
                tmp.B.milestonePopups = !tmp.B.milestonePopups
            },
            display() {
                if (tmp.B.milestonePopups) {
                    return "Enabled"
                }
                else {
                    return "Disabled"
                }
            },
            
        },
    },
    milestones: {
        1: {
            requirementDescription: "25 B",
            effectDescription: "2x LP",
            unlocked() {return true},
            done() {return player.B.points.gte(25)},
        },
        2: {
            requirementDescription: "50 B & 7 Bottom Layer Support",
            effectDescription: "10x LP & A",
            unlocked() {return true},
            done() {return player.B.points.gte(50) && getBuyableAmount("B", 11).gte(7)},
        },
        3: {
            requirementDescription: "100 B & 10 Bottom Layer Support",
            effectDescription: "25x LP & A and half the B requirement",
            unlocked() {return true},
            done() {return player.B.points.gte(100) && getBuyableAmount("B", 11).gte(10)},
        },
        4: {
            requirementDescription: "2500 B & 25 Bottom Layer Support",
            effectDescription: "100x LP",
            unlocked() {return true},
            done() {return player.B.points.gte(2500) && getBuyableAmount("B", 11).gte(25)},
        },
        5: {
            requirementDescription: "10000 B",
            effectDescription: "250x LP",
            unlocked() {return true},
            done() {return player.B.points.gte(10000)},
        },
        6: {
            requirementDescription: "15000 B",
            effectDescription: "10x B",
            unlocked() {return true},
            done() {return player.B.points.gte(15000)},
        },
        7: {
            requirementDescription: "500000 B",
            effectDescription: "25x B",
            unlocked() {return true},
            done() {return player.B.points.gte(500000)},
        },
        8: {
            requirementDescription: "2.7e7 B & 125 Bottom layer support & 5 Big B boost",
            effectDescription: "100x B",
            unlocked() {return true},
            done() {return player.B.points.gte(2.7e7) && getBuyableAmount("B", 11).gte(125) && getBuyableAmount("B", 12).gte(5)},
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "upgrades",
                "blank",
            ],
    
            unlocked() {return true}
        },
        "Buyables": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["clickable", [11]],
                "buyables",
                "blank",
            ],
    
            unlocked() {return hasUpgrade("B", 16)}
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["clickable", [12]],
                "milestones",
                "blank",
            ],
    
            unlocked() {return hasAchievement("Ach", 21)}
        },
    },
    
})
