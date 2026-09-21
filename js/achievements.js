addLayer("Ach", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: "side", // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    resource: "Achievement Points",
    color: "rgb(255, 255, 255)",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tooltip: false,
    achievements: {
        11: {
            name: "The beginning",
            done() {
                return player.A.points.gte(1)
            },
            tooltip: "Reset for the first time",
            unlocked() {
                return true
            },
            style() {
                return {

                }
            },
            onComplete() {
                addTheme("Alphabet")
            }
        },
        12: {
            name: "Newbie",
            done() {
                return hasUpgrade("A", 16)
            },
            tooltip: "Buy the first row of upgrades",
            unlocked() {
                return true
            },
            style() {
                return {

                }
            }
        },
        13: {
            name: "I mean, its called the Alphabet tree for a reason...",
            done() {
                return player.B.points.gte(1)
            },
            tooltip: "Reset for B",
            unlocked() {
                return true
            },
            style() {
                return {

                }
            },
            onComplete() {
                addTheme("Alphabet")
            }
        },
        14: {
            name: "Shopping?",
            done() {
                return hasUpgrade("B", 16)
            },
            tooltip: "Unlock your first buyable",
            unlocked() {
                return true
            },
            style() {
                return {

                }
            }
        },
        15: {
            name: "They weren't important anyways",
            done() {
                return player.A.upgrades.length == 0 && player.A.points.gte(2000)
            },
            tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    let desc = "Get 2000 A without any A upgrades"
                    let effectdesc = "Boost A for every A upgrade you bought"
                    return desc+"<br>Reward: "+effectdesc+"<br>Currently: "+this.effect()+"x"
                }
                else {
                    let desc = "Get 2000 A without any A upgrades"
                    return desc
                }
            },
            unlocked() {
                return true
            },
            effect() {
                return new Decimal(1).add(new Decimal(0.05).times(player.A.upgrades.length))
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        16: {
            name: "print('AAAAAAAAAA' * 1e6)",
            done() {
                return player.A.points.gte(1e7)
            },
            tooltip: "Get over 1e7 A",
            unlocked() {
                return true
            },
            style() {
                return {

                }
            }
        },
        21: {
            name: "This took a mile",
            done() {
                return player.B.points.gte(25)
            },
            tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    let desc = "Get 25 B"
                    let effectdesc = "You now unlock milestones"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    let desc = "Get 25 B"
                    return desc
                }
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        22: {
            name: "Speedrun Any%",
            done() {
                return player.A.points.gte(5e7) && player.B.resetTime < 10
            },
            tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    let desc = "Get 5e7 A under 10 seconds after resetting B"
                    let effectdesc = "You generate 1% of your A reset"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    let desc = "Get 5e7 A under 10 seconds after resetting B"
                    return desc
                }
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        23: {
            name: "World B star",
            done() {
                return player.B.points.gte(100)
            },
            tooltip: "Get 100 B"
        },
        24: {
            name: "No more stock",
            done() {
                return getBuyableAmount("B", 11).gte(25)
            },
            tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    let desc = "Buy 25 of Bottom Layer Support"
                    let effectdesc = "Every Bottom Layer Support bought gives a +0.02x to B"
                    return desc+"<br>Reward: "+effectdesc+"<br>Currently: "+new Decimal(0.02).times(getBuyableAmount("B", 12)).add(1)+'x'
                }
                else {
                    let desc = "Buy 25 of Bottom Layer Support"
                    return desc
                }
            },
            effect() {
                return new Decimal(0.02).times(getBuyableAmount("B", 12)).add(1)
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        25: {
            name: "'&' * 1e6",
            done() {
                return player["&"].points.gte(1e6)
            },
            tooltip: "Get 1e6 &"
        },
        26: {
            name: "C",
            done() {
                return player.C.points.gte(1)
            },
            tooltip: "Reset C for the first time",
            onComplete() {
                addTheme("Christmas")
            },
        },
        31: {
            name: "Truly no more stock",
            done() {
                return getBuyableAmount("B", 11).gte(625)
            },
            tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    let desc = "Buy 625 of Bottom Layer Support"
                    let effectdesc = "Every Bottom Layer Support bought gives an additional +0.05x to LP, capped at 100"
                    return desc+"<br>Reward: "+effectdesc+"<br>Currently: "+new Decimal(0.05).times(getBuyableAmount("B", 12)).add(1)+'x'
                }
                else {
                    let desc = "Buy 625 of Bottom Layer Support"
                    return desc
                }
            },
            effect() {
                if (+new Decimal(0.05).times(getBuyableAmount("B", 12)).add(1).gte(100)) {
                    return new Decimal(100)
                }
                else {
                    return new Decimal(0.05).times(getBuyableAmount("B", 12)).add(1)
                }
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        32: {
            name: "Challenged",
            done() {
                return challengeCompletions("C", 11) > 0
            },
            tooltip: "Beat your first challenge"
        },
        33: {
            name: "I hate to be the bearer of bad news but...",
            done() {
                return player["&"].upgrades.length > 0 && inChallenge("C", 14)
            },
            tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    let desc = "Buy an ampersand upgrade in Creatorless challenge... or just enter creatorless challenge with it"
                    let effectdesc = "Add 1 ampersand to A reset... what"
                    return desc+"<br>Reward: "+effectdesc+"<br>Currently: +"+new Decimal(1)
                }
                else {
                    let desc = "Buy an ampersand upgrade in Creatorless challenge"
                    return desc
                }
            },
            effect() {
                return new Decimal(1)
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        34: {
            name: "& pro",
            done() {
                return player["&"].upgrades.length >= 2
            },
            tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    let desc = "Buy two & upgrades"
                    let effectdesc = "Improve the & formula"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    let desc = "Buy two & upgrades"
                    return desc
                }
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        35: {
            name: "Constant phase",
            done() {
                return player.B.points.gte(tmp.C.requires) && player.C.resetTime < 3
            },
            tooltip: "Reach the C requirement in less than 3 seconds after resetting C"
        },
        36: {
            name: "Challenger",
            done() {
                return hasChallenge("C", 11) && hasChallenge("C", 12) && hasChallenge("C", 13) && hasChallenge("C", 14)
            },
            tooltip: "Beat 4 challenges"
        },
        41: {
            name: "Dawn of D",
            done() {
                return player.D.points.gte(1)
            },
            tooltip: "Reset D",
            onComplete() {
                addTheme("Diamond")
            },
        },
        42: {
            name: "Not letting you off that easlily",
            done() {
                return upgradeEffect("C", 34).gte(250)
            },
            tooltip: "Realise that Upgrade 33 on C makes C grow exponentially and try to beat the game using this<br>or just get to the cap in general."
        },
        43: {
            name: "nuh uh",
            done() {
                return player.D.nuhuh == true
            },
            tooltip: "Attempt to turn to dusk while offline generation but fail miserably"
        },
        44: {
            name: "that took an ETERNITY",
            done() {
                return player.D.points.gte(2)
            },
            tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    let desc = "Reset for D again"
                    let effectdesc = "10x B"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    let desc = "Reset for D again"
                    return desc
                }
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        45: {
            name: "Progression pace of the century",
            done() {
                return player.C.points.gte(tmp.D.requires) && player.D.resetTime < 20
            },
            tooltip() {
                return "Get the D requirement in less then 20 seconds (I underestimated the upgrades a little)"
            },
        },
        46: {
            name: "Dill pickle",
            done() {
                return hasUpgrade("D", 41) && hasUpgrade("D", 42) && hasUpgrade("D", 43) && hasUpgrade("D", 44) && hasUpgrade("D", 45) && hasUpgrade("D", 46)
            },
            tooltip() {
                if (hasAchievement(this.layer, this.id)) {
                    return "Dill pickle (buy D row 4)"
                }
                else {
                    return "Dill pickle"
                }
            },
        },
        51: {
            name: "Energy",
            done() {
                return player.E.points.gte(1)
            },
            tooltip: "Reset for E",
            onComplete() {
                addTheme("Energized")
            },
        },
        52: {
            name: "$25 seperate for the charger",
            done() {
                return challengeCompletions("E", 11) >= 5
            },
            tooltip: "Reach Energy Charge tier 5",
        },
        53: {
            name: "Infinite energy glitch",
            done() {
                return challengeCompletions("E", 11) >= 10
            },
            tooltip: "Reach Energy Charge tier 10",
        },
        54: {
            name: "World E star",
            done() {
                return player.E.total.gte(100)
            },
            tooltip() {
                let desc = "Get a total of 100 E"
                if (hasAchievement(this.layer, this.id)) {
                    let effectdesc = "Unlock 1 upgrade"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    return desc
                }
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        55: {
            name: "No point in charging now...",
            done() {
                return hasUpgrade("E", 21)
            },
            tooltip: "Unlock Perpetual Energy"
        },
        56: {
            name: "Row of E",
            done() {
                return player.E.total.gte(1e6)
            },
            tooltip: "Get a total of 1e6 E",
        },
        61: {
            name: "Well you see... What if there was a point?",
            done() {
                return challengeCompletions("E", 11) >= 31
            },
            tooltip() {
                let desc = "Reach energy tier 31"
                if (hasAchievement(this.layer, this.id)) {
                    let effectdesc = "Energy tier boosts energy gain<br>Currently: "+new Decimal(challengeCompletions("E", 11)).add(1)+'x'
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    return desc
                }
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        62: {
            name: "When is buy max????",
            done() {
                return getBuyableAmount("B", 11).gt(25000)
            },
            tooltip: "Buy Bottom Layer Boost over 25000 times",
        },
        62: {
            name: "Your only 7.45834073120067e-155% of the way there!",
            done() {
                return player.points.gte(new Decimal(2).pow(512))
            },
            tooltip: "Get ~1.34e154 points",
        },
        63: {
            name: "Factory reset",
            done() {
                return player.F.points.gte(1)
            },
            tooltip: "Reset for a factory",
            onComplete() {
                addTheme("Fish")
            },
        },
        64: {
            name: "Not reaching that anytime soon",
            done() {
                return upgradeEffect("B", 24).gte("1ee6")
            },
            tooltip: "Get the B passive generation cap above 1ee6",
            tooltip() {
                let desc = "Get the B passive generation cap above 1ee6"
                if (hasAchievement(this.layer, this.id)) {
                    let effectdesc = "Boost points by B passive generation cap<br>Currently: 1.00x<br> Formula: x/x"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    return desc
                }
            },
            style() {
                return {
                    "border-color": "white",
                    "border-width": "2px"
                }
            }
        },
        65: {
            name: "Forever Factory",
            done() {
                return player.F.points.gte(1)
            },
            tooltip: "Reset for another factory",
        },
        
    },
    pointeff() {
        let pts = player.Ach.points

        return new Decimal(1).add(pts.div(1.5))
    },
    tabFormat: {
        "Achievements": {
            content: [
                () => {
                    if (hasUpgrade("$", 13)) {
                        player.Ach.points = new Decimal(player.Ach.achievements.length)
                        return "main-display"
                    }
                },
                () => {
                    if (hasUpgrade("$", 13)) {
                        let x = () => {return "Which is bosting your points by "+format(tmp.Ach.pointeff)+"x"}
                        return ["display-text", x()]
                    }
                },
                "achievements",
                "blank",
            ],
    
            unlocked() {return true}
        },
    },
})
