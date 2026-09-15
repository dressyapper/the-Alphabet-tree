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

        energygalaxy: new Decimal(0),
        EGreq: new Decimal(1e9),
        EGeffect: new Decimal(1)
    }},
    update(diff) {
        if (player.E.input != "max" &&player.E.input.eq(0)) {
            player.E.input = new Decimal(1)
        }

        if (player.E.energygalaxy.gte(43)) {
            player.E.EGreq = new Decimal(1e50).add(new Decimal(10).pow(player.E.energygalaxy.add(player.E.energygalaxy.sub(43)).add(7)))
        }
        else {
            player.E.EGreq = new Decimal(10).pow(player.E.energygalaxy.add(7))
        }
        player.E.EGeffect = new Decimal(1).times(new Decimal(1.10).pow(player.E.energygalaxy).sub(1)).add(1)
    },
    color: "rgb(0, 255, 255)",
    requires() {
        let req = new Decimal(150000)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "E", // Name of prestige currency
    baseResource: "D", // Name of resource prestige is based on
    baseAmount() {return player.D.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    directMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainMult() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    getResetGain() {
        let req = player.E.points.add(1)
        console.log
        if (req.gte(1000)) {
            req = new Decimal(1000).add(player.E.points.sub(1000).add(1).log(1.1))
        }

        if (hasUpgrade("E", 31)) {
            req = req.times(upgradeEffect("E", 31))
        }
        return req
    },
    getNextAt() {
        let req = tmp.E.requires.times(new Decimal(2).pow(player.E.points))

        return req
    },
    canReset() {
        try {
            return player.D.points.gte(tmp.E.nextAt)
        }
        catch {
            return false
        }
    },
    doReset(reset) {
        if (layers[reset].row <= this.row) return 

        let keep = ["input"]

        layerDataReset(this.layer, keep)
    },
    prestigeButtonText() {
        try {
            return `${tmp.E.resetDescription !== undefined ? tmp.E.resetDescription : "Reset for "}+<b>${formatWhole(tmp.E.resetGain)}</b> ${tmp.E.resource}<br><br>${player.E.points.lt(30) ? (tmp.E.baseAmount.gte(tmp.E.nextAt) && (tmp.E.canBuyMax !== undefined) && tmp.E.canBuyMax ? "Next:" : "Req:") : ""} ${formatWhole(tmp.E.baseAmount)} / ${(tmp[layer].roundUpCost ? formatWhole(tmp.E.nextAtDisp) : format(tmp.E.nextAtDisp))} ${tmp.E.baseResource}		
		`
        }
        catch {
            return "Please wait..."
        }
    },
    generate() {
        if (tmp.E.resetGain instanceof Decimal) {
            let pg = player.E.points.add(1).log(10).div(1000).min(2)

        

            if (hasUpgrade("E", 21)) {
                addPoints("E", tmp.E.resetGain.times(pg))
            } 
        }
    },
    
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        let effect = player.E.total.add(1).pow(0.9)
        return effect
    },
    effectDescription() {
        return "but your total is boosting LP by "+format(this.effect())+"x"
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
            title: "Perpetual Energy",
            description: "Passively generate energy at a rate based on energy (capped at 200%)",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade("E", 12) && hasUpgrade("E", 13) && hasUpgrade("E", 14) && hasUpgrade("E", 15) && hasUpgrade("E", 16)},
        },
        22: {
            title: "Energy powered automation",
            description: "Generate 150% of A reset, 75% of B reset & ^25 the cap (woahwoahwo (2.5 woahs)), 50% of C reset and +25% of D reset and improve the & formula",
            cost: new Decimal(50000),
            unlocked() {return hasUpgrade("E", 12) && hasUpgrade("E", 13) && hasUpgrade("E", 14) && hasUpgrade("E", 15) && hasUpgrade("E", 16)},
        },
        23: {
            title: "Lexicon Charger",
            description: "Boost LP by EC tier",
            cost: new Decimal(150000),
            effectCap() {
                let cap = new Decimal(250)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = new Decimal(challengeCompletions("E", 11)).add(1)
                

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
            unlocked() {return hasUpgrade("E", 22)},
        },
        24: {
            title: "Electric Energizer",
            description: "All energizer buffs are boosted based on E",
            cost: new Decimal(300000),
            effectCap() {
                let cap = new Decimal(250)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = new Decimal(player.E.points).pow(0.2).add(1)
                

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
            unlocked() {return hasUpgrade("E", 23)},
        },
        25: {
            title: "Quite alot for a static layer...",
            description: "Total E divides energy charge challenge effect",
            cost: new Decimal(1.5e6),
            unlocked() {return hasUpgrade("E", 24)},
        },
        26: {
            title: "Energy^0.5",
            description: "Boost LP based on energy",
            cost: new Decimal(7.77e6),
            effectCap() {
                let cap = new Decimal(1e6)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = new Decimal(player.E.points).pow(0.5)
                

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
            unlocked() {return hasUpgrade("E", 23)},
        },

        31: {
            title: "Extra bonuses",
            description: "All allocated energy nerfs E requirement",
            cost: new Decimal(75),
            effectCap() {
                let cap = new Decimal(1000)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let en = player.E.energizer
                let eff = en.lp.add(en.a.add(en.b.add(en.c.add(en.d)))).add(1).log(2).add(1)
                

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
 x               }
            },
            unlocked() {return hasAchievement("Ach", 54)},
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
        10002: {
            title: "Reset for Energy Galaxy",
            style() {
                return {
                    "width": "250px"
                }
            },
            display() {
                return "Reset all of E for an Energy Galaxy which boosts all of pre E by +10% compounding<br>"+format(player.E.points)+"/"+format(player.E.EGreq)
            },
            canClick() {return player.E.points.div(player.E.EGreq).gte(1)},
            onClick() {
                doReset("E", true)
                player.E.energizer = {
                    lp: new Decimal(0),
                    a: new Decimal(0),
                    b: new Decimal(0),
                    c: new Decimal(0),
                    d: new Decimal(0),
                }
                player.E.points = new Decimal(0)
                player.E.upgrades = []
                player.E.energygalaxy = player.E.energygalaxy.add(1)
            },
        },
        10003: {
            title() {
                if (player.E.input == "max") {
                    return "Amount: Max"
                }
                else {
                    return "Amount: "+player.E.input 
                }},
            canClick() {return true},
            onClick() {
                let e = player.E.input

                if (e == "max") {
                    player.E.input = new Decimal(1)
                }
                else if (e.eq(1)) {
                    player.E.input = new Decimal(5)
                }
                else if (e.eq(5)) {
                    player.E.input = new Decimal(10)
                }
                else if (e.eq(10)) {
                    player.E.input = new Decimal(25)
                }
                else if (e.eq(25)) {
                    player.E.input = new Decimal(50)
                }
                else if (e.eq(50)) {
                    player.E.input = new Decimal(100)
                }
                else if (e.eq(100)) {
                    player.E.input = new Decimal(500)
                }
                else if (e.eq(500)) {
                    player.E.input = new Decimal(1000)
                }
                else if (e.eq(1000)) {
                    player.E.input = "max"
                }
                else {
                    e = "max"
                }

                
            },
            onHold() {
                player.E.input = "max"
            },
            unlocked() {
                return hasUpgrade("$", 15)
            }
        },
        10: {
            title: "Energize LP",
            canClick() { return player.E.points.gte(1) && player.E.points.sub(player.E.input).gte(0) && ((player.E.energizer.lp.add(player.E.input).lte(tmp.E.energizerCaps.lp) || player.E.input == "max"))},
            onClick() {
                if (player.E.input == "max") {
                    if (tmp.E.energizerCaps.lp.sub(player.E.energizer.lp).gt(player.E.points)) {
                        player.E.energizer.lp = player.E.energizer.lp.add(player.E.points.floor())
                        player.E.points = new Decimal(0)
                    }
                    else {
                        player.E.points = player.E.points.sub(tmp.E.energizerCaps.lp.sub(player.E.energizer.lp))
                        player.E.energizer.lp = player.E.energizer.lp.add(tmp.E.energizerCaps.lp.sub(player.E.energizer.lp))
                    }
                }
                else {
                    player.E.points = player.E.points.sub(player.E.input)
                    player.E.energizer.lp = player.E.energizer.lp.add(player.E.input)
                }
            },
            display() {
                return "You have "+player.E.energizer.lp+" energy in LP <b> which is giving a "+format(layerE.earnformula.lp(player.E.energizer.lp))+"x to LP"
            },
        },
        11: {
            title: "Energize A",
            canClick() {return player.E.points.gte(1) && player.E.points.sub(player.E.input).gte(0) && ((player.E.energizer.a.add(player.E.input).lte(tmp.E.energizerCaps.a) || player.E.input == "max"))},
            onClick() {
                if (player.E.input == "max") {
                    if (tmp.E.energizerCaps.a.sub(player.E.energizer.a).gt(player.E.points)) {
                        player.E.energizer.a = player.E.energizer.a.add(player.E.points.floor())
                        player.E.points = new Decimal(0)
                    }
                    else {
                        player.E.points = player.E.points.sub(tmp.E.energizerCaps.a.sub(player.E.energizer.a))
                        player.E.energizer.a = player.E.energizer.a.add(tmp.E.energizerCaps.a.sub(player.E.energizer.a))
                    }
                }
                else {
                    player.E.points = player.E.points.sub(player.E.input)
                    player.E.energizer.a = player.E.energizer.a.add(player.E.input)
                }
            },
            display() {
                return "You have "+player.E.energizer.a+" energy in A <b> which is giving a "+format(layerE.earnformula.a(player.E.energizer.a))+"x to A"
            },
        },
        12: {
            title: "Energize B",
            canClick() {return player.E.points.gte(1) && player.E.points.sub(player.E.input).gte(0) && ((player.E.energizer.b.add(player.E.input).lte(tmp.E.energizerCaps.b) || player.E.input == "max"))},
            onClick() {
                if (player.E.input == "max") {
                    if (tmp.E.energizerCaps.b.sub(player.E.energizer.b).gt(player.E.points)) {
                        player.E.energizer.b = player.E.energizer.b.add(player.E.points.floor())
                        player.E.points = new Decimal(0)
                    }
                    else {
                        player.E.points = player.E.points.sub(tmp.E.energizerCaps.b.sub(player.E.energizer.b))
                        player.E.energizer.b = player.E.energizer.b.add(tmp.E.energizerCaps.b.sub(player.E.energizer.b))
                    }
                }
                else {
                    player.E.points = player.E.points.sub(player.E.input)
                    player.E.energizer.b = player.E.energizer.b.add(player.E.input)
                }
            },
            display() {
                return "You have "+player.E.energizer.b+" energy in B <b> which is giving a "+format(layerE.earnformula.b(player.E.energizer.b))+"x to B"
            },
        },
        13: {
            title: "Energize C",
            canClick() {return player.E.points.gte(1) && player.E.points.sub(player.E.input).gte(0) && (player.E.energizer.c.add(player.E.input).lte(tmp.E.energizerCaps.c) || player.E.input == "max")},
            onClick() {
                if (player.E.input == "max") {
                    if (tmp.E.energizerCaps.c.sub(player.E.energizer.c).gt(player.E.points)) {
                        player.E.energizer.c = player.E.energizer.c.add(player.E.points.floor())
                        player.E.points = new Decimal(0)
                    }
                    else {
                        player.E.points = player.E.points.sub(tmp.E.energizerCaps.c.sub(player.E.energizer.c))
                        player.E.energizer.c = player.E.energizer.c.add(tmp.E.energizerCaps.c.sub(player.E.energizer.c))
                    }
                }
                else {
                    player.E.points = player.E.points.sub(player.E.input)
                    player.E.energizer.c = player.E.energizer.c.add(player.E.input)
                }
            },
            display() {
                return "You have "+player.E.energizer.c+" energy in C <b> which is giving a "+format(layerE.earnformula.c(player.E.energizer.c))+"x to C"
            },
        },
        14: {
            title: "Energize D",
            canClick() {return player.E.points.gte(1) && player.E.points.sub(player.E.input).gte(0) && ((player.E.energizer.d.add(player.E.input).lte(tmp.E.energizerCaps.d) || player.E.input == "max"))},
            onClick() {
                if (player.E.input == "max") {
                    if (tmp.E.energizerCaps.d.sub(player.E.energizer.d).gt(player.E.points)) {
                        player.E.energizer.d = player.E.energizer.d.add(player.E.points.floor())
                        player.E.points = new Decimal(0)
                    }
                    else {
                        player.E.points = player.E.points.sub(tmp.E.energizerCaps.d.sub(player.E.energizer.d))
                        player.E.energizer.d = player.E.energizer.d.add(tmp.E.energizerCaps.d.sub(player.E.energizer.d))
                    }
                }
                else {
                    player.E.points = player.E.points.sub(player.E.input)
                    player.E.energizer.d = player.E.energizer.d.add(player.E.input)
                }
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
                if (hasUpgrade("E", 25)) {
                    return new Decimal(2).pow(new Decimal(challengeCompletions(this.layer, this.id)).add(1)).div(player.E.total.pow(2)).add(1)
                }
                else {
                    return new Decimal(2).pow(new Decimal(challengeCompletions(this.layer, this.id)).add(1))
                }
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
                ["upgrades", [1,2,3]],
                "blank",
            ],
    
            unlocked() {return true}
        },
        "Energizer": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["clickable", [10003]],
                ["clickable", [10001]],
                "blank",
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
        },
    },
})

let layerE = {
    earnformula: {
        lp(x) {
            if (hasUpgrade("E", 24)) {
                return x.times(1000).add(1).pow(1.05).times(upgradeEffect("E", 24))
            }
            else {
                return x.times(1000).add(1).pow(1.05)
            }
        },
        a(x) {
            if (hasUpgrade("E", 24)) {
                return x.times(100).pow(0.9).add(1).times(upgradeEffect("E", 24))
            }
            else {
                return x.times(100).pow(0.9).add(1)
            }
        },
        b(x) {
            if (hasUpgrade("E", 24)) {
                return x.times(50).pow(0.7).add(1).times(upgradeEffect("E", 24))
            }
            else {
                return x.times(50).pow(0.7).add(1)
            }
        },
        c(x) {
            if (hasUpgrade("E", 24)) {
                return x.times(25).pow(0.5).add(1).times(upgradeEffect("E", 24))
            }
            else {
                return x.times(25).pow(0.5).add(1)
            }
        },
        d(x) {
            if (hasUpgrade("E", 24)) {
                return x.times(5).pow(0.3).add(1).times(upgradeEffect("E", 24))
            }
            else {
                return x.times(5).pow(0.3).add(1)
            }
        },
    },
}
