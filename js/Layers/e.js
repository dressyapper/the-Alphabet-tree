addLayer("E", {
    name: "E", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        energy: new Decimal(0),
    }},
    color: "rgb(0, 255, 255)",
    requires() {
        let req = new Decimal(100000)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "E", // Name of prestige currency
    baseResource: "D", // Name of resource prestige is based on
    baseAmount() {return player.D.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        let effect = player.E.total.add(1)
        return effect
    },
    onPrestige() {
        
    },
    effectDescription() {
        return "but your total is boosting LP & D by "+format(this.effect())+"x"
    },
    branches: ["C", "D"],
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "e: Reset for E", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (player.D.points.gte(50000) && hasUpgrade("D", 15)) {
            player[this.layer].shown = true
        }
        return player[this.layer].shown
    }, 
    doReset(reset) {
        if (layers[reset].row <= this.row) return 

        let keep = [""]


        layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "Energy",
            description: "Unlock",
            cost: new Decimal(Infinity),
            unlocked() {return hasAchievement("Ach", 51)},
        },
    },
    
    clickables: {
        11: {
            title: "Time",
            canClick() {return true},
            onClick() {
                if (player.offTime && player.D.mode != "Dusk") {
                    player.D.nuhuh = true
                }
                else {
                    if (player.D.mode == "Day") {
                        player.D.mode = "Dusk"
                    }
                    else {
                        player.D.mode = !(player.D.mode == "Dawn") ? "Dawn" : "Dusk"
                    }
                }
            },
            display() {
                return "<h3>"+player.D.mode+"<h3>"
            },
            onHold() {
                if (player.offTime && player.D.mode != "Dusk") {
                    player.D.nuhuh = true
                }
                else {
                    player.D.mode = "Day"
                }
            }
            
        },
    },
    infoboxes: {
        info: {
            title: "Dawn & Dusk",
            body: "Dawn & Dusk is a feature where you can effect stats based on if your mode is dawn or dusk. <br>Dawn effects stats when you're online/active and Dusk effects stats when offline.<br> You can hold the button to set it to 'Day' which provides no effects (hold and move off the button to set it)",
        },
    },
    /*challenges: {
        11: {
            name: "Chopped Point Count",
            challengeDescription() { 
                let x = "LP is divided by /"+this.inChallengeEffect()+" and more upgrades"
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
                let x = "Boost points by "+this.rewardEffect()+"x"
                return x
            },
            onEnter() {
                player.points = player.points
            }
        },
        12: {
            name: "Cut A Generation",
            challengeDescription() { 
                let x = "A is divided by /"+this.inChallengeEffect()
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
                return new Decimal(16).pow(new Decimal(challengeCompletions(this.layer, this.id)).add(1))
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
    },

})
