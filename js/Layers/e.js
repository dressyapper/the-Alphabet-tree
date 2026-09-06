addLayer("E", {
    name: "E", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        energy: new Decimal(0),
        input: new Decimal(1),
        energizer: {
            lp: new Decimal(0),
            a: new Decimal(0),
            b: new Decimal(0),
            c: new Decimal(0),
            d: new Decimal(0),
        },
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
    effectDescription() {
        return "but your total is boosting LP & D by "+format(this.effect())+"x"
    },
    energizerCaps() {
        obj = {
            lp: new Decimal(250),
            a: new Decimal(100),
            b: new Decimal(25),
            c: new Decimal(10),
            d: new Decimal(5)
        }

        if (hasUpgrade("E", 12)) obj.lp = obj.lp.pow(2)
        if (hasUpgrade("E", 13)) obj.a = obj.a.pow(2)
        if (hasUpgrade("E", 14)) obj.b = obj.b.pow(2)
        if (hasUpgrade("E", 15)) obj.c = obj.c.pow(2)
        if (hasUpgrade("E", 16)) obj.d = obj.d.pow(2)


        for (i in obj) {
            obj[i] = obj[i].floor()
        }
        return obj
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
            description: "Unlock Energizer & Charging",
            cost: new Decimal(0),
            unlocked() {return hasAchievement("Ach", 51)},
        },
        12: {
            title: "Extension Installer LP",
            description: "Square LP cap (square the cap for the LP energizer)",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade("E", 11)},
        },
        13: {
            title: "Extension Installer A",
            description: "Square A cap",
            cost: new Decimal(30),
            unlocked() {return hasUpgrade("E", 11)},
        },
        14: {
            title: "Extension Installer B",
            description: "Square B cap",
            cost: new Decimal(40),
            unlocked() {return hasUpgrade("E", 11)},
        },
        15: {
            title: "Extension Installer C",
            description: "Square C cap",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade("E", 11)},
        },
        16: {
            title: "Extension Installer D",
            description: "Square D cap",
            cost: new Decimal(60),
            unlocked() {return hasUpgrade("E", 11)},
        },
        21: {
            title: "Extension Installer E",
            description: "Square D cap",
            cost: new Decimal(100),
            unlocked() {return false && hasUpgrade("E", 12) && hasUpgrade("E", 13) && hasUpgrade("E", 14) && hasUpgrade("E", 15) && hasUpgrade("E", 16)},
        },
    },

    
    clickables: {
        10001: {
            title: "Respec all",
            canClick() {return true},
            onClick() {
                if (confirm("Are you sure you want to reset? This will reset E")) {
                    player.E.points = player.E.points.add(player.E.energizer.lp)
                    player.E.points = player.E.points.add(player.E.energizer.a)
                    player.E.points = player.E.points.add(player.E.energizer.b)
                    player.E.points = player.E.points.add(player.E.energizer.c)
                    player.E.points = player.E.points.add(player.E.energizer.d)
                    player.E.energizer.lp = new Decimal(0)
                    player.E.energizer.a = new Decimal(0)
                    player.E.energizer.b = new Decimal(0)
                    player.E.energizer.c = new Decimal(0)
                    player.E.energizer.d = new Decimal(0)
                    doReset("E", true)
                }
            },
        },
        10: {
            title: "Energize LP",
            canClick() {return player.E.points.gte(1) && player.E.energizer.lp.add(player.E.input).lte(tmp.E.energizerCaps.lp) && player.E.input.lte(player.E.points)},
            onClick() {
                player.E.points = player.E.points.sub(1)
                player.E.energizer.lp = player.E.energizer.lp.add(player.E.input)
            },
            display() {
                return "You have "+player.E.energizer.lp+" energy in LP <b> which is giving a "+format(layerE.earnformula.lp(player.E.energizer.lp))+"x to LP"
            },
        },
        11: {
            title: "Energize A",
            canClick() {return player.E.points.gte(1) && player.E.energizer.a.add(player.E.input).lte(tmp.E.energizerCaps.a) && player.E.input.lte(player.E.points)},
            onClick() {
                player.E.points = player.E.points.sub(1)
                player.E.energizer.a = player.E.energizer.a.add(player.E.input)
            },
            display() {
                return "You have "+player.E.energizer.a+" energy in A <b> which is giving a "+format(layerE.earnformula.a(player.E.energizer.a))+"x to A"
            },
        },
        12: {
            title: "Energize B",
            canClick() {return player.E.points.gte(1) && player.E.energizer.b.add(player.E.input).lte(tmp.E.energizerCaps.b) && player.E.input.lte(player.E.points)},
            onClick() {
                player.E.points = player.E.points.sub(1)
                player.E.energizer.b = player.E.energizer.b.add(player.E.input)
            },
            display() {
                return "You have "+player.E.energizer.b+" energy in B <b> which is giving a "+format(layerE.earnformula.b(player.E.energizer.b))+"x to B"
            },
        },
        13: {
            title: "Energize C",
            canClick() {return player.E.points.gte(1) && player.E.energizer.c.add(player.E.input).lte(tmp.E.energizerCaps.c) && player.E.input.lte(player.E.points)},
            onClick() {
                player.E.points = player.E.points.sub(1)
                player.E.energizer.c = player.E.energizer.c.add(player.E.input)
            },
            display() {
                return "You have "+player.E.energizer.c+" energy in C <b> which is giving a "+format(layerE.earnformula.c(player.E.energizer.c))+"x to C"
            },
        },
        14: {
            title: "Energize D",
            canClick() {return player.E.points.gte(1) && player.E.energizer.d.add(player.E.input).lte(tmp.E.energizerCaps.d) && player.E.input.lte(player.E.points)},
            onClick() {
                player.E.points = player.E.points.sub(1)
                player.E.energizer.d = player.E.energizer.d.add(player.E.input)
            },
            display() {
                return "You have "+player.E.energizer.d+" energy in D <b> which is giving a "+format(layerE.earnformula.d(player.E.energizer.d))+"x to D"
            },
        },
    },
    bars: {
        lp: {
            direction: RIGHT,
            width: 500,
            height: 50,
            display() {try{return player.E.energizer[this.id]+"/"+tmp.E.energizerCaps[this.id]} catch{return "Please wait..."}},
            progress() { return player.E.energizer[this.id].div(tmp.E.energizerCaps[this.id]) },
            fillStyle() {
                return {"background": "grey"}
            }
        },
        a: {
            direction: RIGHT,
            width: 500,
            height: 50,
            display() {try{return player.E.energizer[this.id]+"/"+tmp.E.energizerCaps[this.id]} catch{return "Please wait..."}},
            progress() { return player.E.energizer[this.id].div(tmp.E.energizerCaps[this.id]) },
            fillStyle() {
                return {"background": tmp.A.color}
            }
        },
        b: {
            direction: RIGHT,
            width: 500,
            height: 50,
            display() {try{return player.E.energizer[this.id]+"/"+tmp.E.energizerCaps[this.id]} catch{return "Please wait..."}},
            progress() { return player.E.energizer[this.id].div(tmp.E.energizerCaps[this.id]) },
            fillStyle() {
                return {"background": tmp.B.color}
            }
        },
        c: {
            direction: RIGHT,
            width: 500,
            height: 50,
            display() {try{return player.E.energizer[this.id]+"/"+tmp.E.energizerCaps[this.id]} catch{return "Please wait..."}},
            progress() { return player.E.energizer[this.id].div(tmp.E.energizerCaps[this.id]) },
            fillStyle() {
                return {"background": tmp.C.color}
            }
        },
        d: {
            direction: RIGHT,
            width: 500,
            height: 50,
            display() {try{return player.E.energizer[this.id]+"/"+tmp.E.energizerCaps[this.id]} catch{return "Please wait..."}},
            progress() { return player.E.energizer[this.id].div(tmp.E.energizerCaps[this.id]) },
            fillStyle() {
                return {"background": tmp.D.color}
            }
        },
    },
    challenges: {
        11: {
            name() {return "Energy Charge Tier "+challengeCompletions(this.layer, this.id)},
            challengeDescription() { 
                let x = "Charge your energy up using LP gain, LP is divided by /"+format(this.inChallengeEffect())+"<br> You can complete this as many times as you want."
                return x
            },
            goalDescription() {
                return "Get 1e"+new Decimal(challengeCompletions("E",11)).add(1).times(3)+" LP"
            },
            canComplete(){
                return player.points.gte(new Decimal(10).pow(new Decimal(challengeCompletions("E",11)).add(1).times(3)))
            },
            unlocked() { 
                return (true) 
            },
            inChallengeEffect() {
                return new Decimal(2).pow(new Decimal(challengeCompletions(this.layer, this.id)).add(1))
            },
            currencyDisplayName: "points",
            completionLimit: Infinity,
            rewardDescription() {
                let x = "+"+new Decimal(challengeCompletions(this.layer, this.id)).add(1)+" E"
                return x
            },
            onEnter() {
                player.points = player.points
            },
            onComplete() {
                addPoints("E", new Decimal(challengeCompletions(this.layer, this.id)))
            }
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
        "Energizer": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["clickable", [10001]],
                ["clickable", [10]],
                ["bar", "lp"],
                "blank",
                ["clickable", [11]],
                ["bar", "a"],
                "blank",
                ["clickable", [12]],
                ["bar", "b"],
                "blank",
                ["clickable", [13]],
                ["bar", "c"],
                "blank",
                ["clickable", [14]],
                ["bar", "d"],
                "blank",
            ],
    
            unlocked() {return hasUpgrade("E", 11)}
        },
        "Charging": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "challenges",
                "blank",
            ],

            unlocked() {return hasUpgrade("E", 11)}
        }
    },
})
let layerE = {
    earnformula: {
        lp(x) {
            return x.times(1000).add(1).pow(1.05)
        },
        a(x) {
            return x.times(100).pow(0.9).add(1)
        },
        b(x) {
            return x.times(50).pow(0.7).add(1)
        },
        c(x) {
            return x.times(25).pow(0.5).add(1)
        },
        d(x) {
            return x.times(5).pow(0.3).add(1)
        },
    },
}
