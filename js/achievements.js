addLayer("Ach", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: "side", // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
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
            name: "Very normal cost jump",
            done() {
                return hasUpgrade("&", 12)
            },
            tooltip: "Get the second ampersand upgrade"
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
                    let desc = "Buy an ampersand upgrade in Creatorless challenge"
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
                    let desc = "Buy the first two rows of & upgrades"
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
            tooltip: "Reset D"
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
    },
    tabFormat: {
        "Achievements": {
            content: [
                "achievements",
                "blank",
            ],
    
            unlocked() {return true}
        },
    },
})
