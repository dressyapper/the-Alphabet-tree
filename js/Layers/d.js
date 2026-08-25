addLayer("D", {
    name: "D", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        mode: "Nil",
        nuhuh: false,
    }},
    color: "rgb(0, 255, 0)",
    requires() {
        let req = new Decimal(1000)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "D", // Name of prestige currency
    baseResource: "C", // Name of resource prestige is based on
    baseAmount() {return player.C.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        let effect = player.B.total.pow(0.1).add(1)
        return new Decimal(0)
    },
    onPrestige() {
        if (player.D.mode == "Nil") {
            player.D.mode == "Dawn"
        }
    },
    /*effectDescription() {
        return ""
    },*/
    branches: ["C", "D"],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for D", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (player.C.points.gte(500)) {
            player[this.layer].shown = true
        }
        return player[this.layer].shown
    }, 
    cap() {
        return new Decimal(1e6)
    },
    effect() {
        let effect = new Decimal(10).pow(player.D.total)
        if (effect.gte(tmp.D.cap)) {
            effect.div()
            return tmp.D.cap
        }
        else {
            return effect
        }
    },
    effectDescription() {
        if (tmp.D.effect.gte(tmp.D.cap)) {
            return "but your total D boosts LP by "+format(this.effect())+"x (CAPPED)"
        }
        else {
            return "but your total D boosts LP by "+format(this.effect())+"x"
        }
        

    },
    doReset(reset) {
        if (layers[reset].row <= this.row) return 

        let keep = ["nuhuh"]


        layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "Dawn and Dusk",
            description: "Unlock something...",
            cost: new Decimal(0),
            unlocked() {return true},
        },
        12: {
            title: "AD",
            description: "Add effects relating to A in Daytime",
            cost: new Decimal(10),
            unlocked() {return true},
        },
        13: {
            title: "BD",
            description: "Add effects relating to B in Daytime",
            cost: new Decimal(100),
            unlocked() {return true},
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
        12: {
            title: "Auto?",
            canClick() {return true},
            onClick() {
                player.D.auto = !player.D.auto
            },
            display() {
                let x
                if (player.D.auto) {
                    x = "Enabled"
                }
                else {
                    x = "Disabled"
                }
                return "<h3>"+x+"<h3>"
            },
            
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
        "Daytime": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["clickable", [11]],
                ["clickable", [12]],
                "blank",
                ["display-text", function() {
                    let t = "<h2>Current effects:</h2><br>"
                    let mode = player.D.mode
                    function text(txt) {
                        t += txt
                        t += "<br>"
                    }

                    if (mode == "Dawn") {
                        text("LP is boosted by 2x")
                        text("Point gen is disabled offline")
                        if (hasUpgrade("D", 12)) {
                            text("Boost A based on reset time<br> currently: "+player.A.resetTime.pow(0.6))
                            text("Divide LP based on A when offline<br> currently: "+player.A.points.pow(0.4))
                        }

                    }
                    else if (mode == "Dusk") {
                        text("LP is /5")
                        text("LP is 7x only when offline")
                        if (hasUpgrade("D", 12)) {
                            text("A is divided by 3")
                            text("You can passively generate A offline")
                        }
                        
                    }

                    return t
                }],
                ["infobox", "info"],
                "blank",
            ],
    
            unlocked() {return true}
        },
    },

})
