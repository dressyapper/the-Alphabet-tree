addLayer("C", {
    name: "C", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "rgb(255, 255, 0)",
    requires() {
        let req = new Decimal(1e9)
        if (hasUpgrade("C", 26)) req = req.div(2)
        if (hasUpgrade("C", 31)) req = req.div(100)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "C", // Name of prestige currency
    baseResource: "B", // Name of resource prestige is based on
    baseAmount() {return player.B.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("C", 34)) mult = mult.times(upgradeEffect("C", 34))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        let effect = player.B.total.pow(0.1).add(1)
        return new Decimal(0)
    },
    /*effectDescription() {
        return ""
    },*/
    branches: ["B", "C"],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (player.B.points.gte(5e8)) {
            player[this.layer].shown = true
        }
        return player[this.layer].shown
    }, 
    effect() {
        let p = new Decimal(10)

        let effect = player.C.total.add(1).log(p).add(1)
        return effect
    },
    effectDescription() {
        return "but your total C boosts A and LP by "+format(this.effect())+"x"
    },
    upgrades: {
        11: {
            title: "Challenges",
            description: "Unlock challenges",
            cost() {
                if (player.D.shown) {
                    return new Decimal(1)
                }
                else {
                    return new Decimal(0)
                }
            },
            unlocked() {return true},
        },
        12: {
            title: "Cool boost",
            description: "1.2x LP & A & B",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade("C", 11)},
        },
        13: {
            title: "Cool Balanced",
            description: "10x LP",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade("C", 12)},
        },
        14: {
            title: "BAassive Generation",
            description: "Generate 35% of your A gain and 20% of your B gain",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade("C", 13)},
        },
        15: {
            title: "Formula &",
            description: "Improve the & formula",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade("C", 13)},
        },
        16: {
            title: "The Constant",
            description: "Upgrades that give a higher and lower effect at some point now give another effect inbetween (upgrades where it gives 100x LP when LP is less than x but 10x when above)",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade("C", 13)},
        },
        21: {
            title: "UnCassive generate",
            description: "B passive generation is boosted by ^1.5",
            cost: new Decimal(2),
            unlocked() {return hasChallenge("C", 11) && hasUpgrade("C", 16) && hasUpgrade("C", 15) && hasUpgrade("C", 14)},
        },
        22: {
            title: "Cost upgrade scale increase",
            description: "I think this upgrade might have a bit to do with the number 2, 22x B",
            cost: new Decimal(4),
            unlocked() {return hasUpgrade("C", 21)},
        },
        23: {
            title: "Cool Effect",
            description: "Boost LP based on C",
            cost: new Decimal(4),
            unlocked() {return hasUpgrade("C", 22)},
            effectCap() {
                let cap = new Decimal(1000)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.C.points.div(2).add(1)
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
        24: {
            title: "Cost jump alert!!!",
            description: "1e4x LP",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade("C", 23)},
        },
        25: {
            title: "Take this, its on the house",
            description: "Improve the & formula",
            cost: new Decimal(0),
            unlocked() {return hasUpgrade("C", 24)},
        },
        26: {
            title: "Cut in half",
            description: "Half the C requirement",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade("C", 25)},
        },
        31: {
            title: "Not really cut in half",
            description: "/100 the C & B requirement",
            cost: new Decimal(12),
            unlocked() {return hasUpgrade("C", 26)},
        },
        32: {
            title: "You'll really need this for &",
            description: "Improve the & formula by alot",
            cost: new Decimal(16),
            unlocked() {return hasUpgrade("C", 31)},
        },
        33: {
            title: "And thats all for now folks!",
            description: "Boost B based on C",
            cost: new Decimal(25),
            unlocked() {return hasUpgrade("C", 31)},
        },
        33: {
            title: "33BC",
            description: "Boost B based on C",
            cost: new Decimal(25),
            unlocked() {return hasUpgrade("C", 32)},
            effectCap() {
                let cap = new Decimal(1000)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.C.points.times(2).add(1)
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
        34: {
            title: "Team carry",
            description: "Boost C based on itself",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade("C", 33)},
            effectCap() {
                let cap = new Decimal(250)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.C.points.div(10).add(1)
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
    challenges: {
        11: {
            name: "Chopped Point Count",
            challengeDescription() { 
                let x = "LP is divided by /"+this.inChallengeEffect()
                return x
            },
            goalDescription() {
                return "Get 1e6 B"
            },
            canComplete(){
                return player.B.points.gte(1e6)
            },
            unlocked() { 
                return (true) 
            },
            rewardEffect() {
                return new Decimal(1.1).pow(new Decimal(challengeCompletions(this.layer, this.id))).add(1).floor()
            },
            inChallengeEffect() {
                return new Decimal(4).pow(new Decimal(challengeCompletions(this.layer, this.id)).add(1))
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "Boost points by "+this.rewardEffect()+"x and more upgrades"
                return x
            },
            onEnter() {
                player.points = player.points
            }
        },
        12: {
            name: "Cut A Generation",
            challengeDescription() { 
                let x = "A is divided by /16"
                return x
            },
            goalDescription() {
                return "Get 1e6 B"
            },
            canComplete(){
                return player.B.points.gte(1e6)
            },
            unlocked() { 
                return (hasChallenge("C", 11)) 
            },
            rewardEffect() {
                return new Decimal(2)
            },
            inChallengeEffect() {
                return new Decimal(16)
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "Boost A by "+this.rewardEffect()+"x"
                return x
            },
            onEnter() {
                player.points = player.points
            }
        },
        13: {
            name: "Catastrophic Challenge",
            challengeDescription() { 
                let x = "LP, A & B is divided by /1024 <br> Autoupgrading is disabled in this challenge"
                return x
            },
            goalDescription() {
                return "Get 1e9 B"
            },
            canComplete(){
                return player.B.points.gte(1e9)
            },
            unlocked() { 
                return (hasChallenge("C", 12)) 
            },
            rewardEffect() {
                return new Decimal(16)
            },
            inChallengeEffect() {
                return new Decimal(1024).pow(new Decimal(challengeCompletions("C", 13)).add(1))
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "Boost points by "+this.rewardEffect()+"x"
                return x
            },
            onEnter() {
                player.A.upgrades = []
                player.B.upgrades = []
            }
        },
        14: {
            name: "Creatorless Challenge",
            challengeDescription() { 
                let x = "Remember all that automation we gave you? Yeah well we're taking it away now. <br> You dont generate A or B and & no longer works"
                return x
            },
            goalDescription() {
                return "Get 1e10 B"
            },
            canComplete(){
                return player.B.points.gte(1e10)
            },
            unlocked() { 
                return (hasChallenge("C", 12)) 
            },
            inChallengeEffect() {
                return false
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "B passive generation cap is ^10 (woah), you generate 50% of your A reset and 35% of your B reset and the ampersand formula is even better "
                return x
            },
            onEnter() {
                player.points = player.points
            }
        },
        15: {
            name: "Calamity",
            challengeDescription() { 
                let x = "LP, A and B are raised to the ^0.25 power"
                return x
            },
            goalDescription() {
                return "Get 1000 B"
            },
            canComplete(){
                return player.B.points.gte(1000)
            },
            unlocked() { 
                return (hasChallenge("C", 11) && hasChallenge("C", 12) && hasChallenge("C", 13) && hasChallenge("C", 14)) 
            },
            inChallengeEffect() {
                return false
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "LP is raised to the ^1.1 and a new layer"
                return x
            },
            onEnter() {
                player.A.upgrades = []
                player.B.upgrades = []
            }
        }
    },
    /*buyables: {
        11: {
            title: "Bottom Layer Support",
            description: "Boost A and LP<br>",
            unlocked() { return true },
            cost(x) {
                return x.pow(2)
            },
            display() {
                return ""+this.description+"<br>Cost: " + format(this.cost()) + " B" + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = x.add(1)
                return eff
            },
        },
    },*/
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
        "Challenges": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "challenges",
                "blank",
            ],
    
            unlocked() {return hasUpgrade("C", 11)}
        },
    }
})
