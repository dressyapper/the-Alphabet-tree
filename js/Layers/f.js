addLayer("F", {
    name: "F", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        product: new Decimal(0),
        productname: "",
        generation: new Decimal(0),
        rate: new Decimal(1000),

        energydrink: new Decimal(0),
    }},
    color: "rgb(0, 0, 255)",
    milestonePopups: true,
    update(diff) {
        //rate: player.F.generation.times(new Decimal(1).div(player.F.rate).times(50))
        if (player.paused) {
            return
        }
        player.F.product = player.F.product.add(player.F.generation.times(new Decimal(1).div(player.F.rate).times(50)).times(player.F.points))
    },
    energydrink() {
        if (player.F.energydrink.gt(0)) {
            if (new Decimal(Math.random()).times(100000).times(player.F.upgrades.length) > new Decimal(99999).div(player.F.energydrink.add(1).log(100).add(1)).div(new Decimal(1+hasUpgrade("F",16)).min(1.25))) {
                player.F.energydrink = player.F.energydrink.sub(1)
            }
        }
    },
    rate() {
        let rate = new Decimal(1000)

        rate = rate.div(player.F.energydrink.add(1).log(10).add(1))
        if (hasUpgrade("F", 22)) rate = rate.div(2)

        player.F.rate = rate
    },
    productgeneration() {
        let gen = new Decimal(0)

        if (hasUpgrade("F", 11)) {gen = gen.add(1)}
        if (hasUpgrade("F", 12)) {gen = gen.add(2)}
        if (hasUpgrade("F", 13)) {gen = gen.add(3)}
        if (hasUpgrade("F", 14)) {gen = gen.add(5)}
        if (hasUpgrade("F", 16)) {gen = gen.times(1.7).floor()}
        if (hasUpgrade("F", 21)) {gen = gen.add(24)}
        if (hasUpgrade("F", 22)) {gen = gen.add(48)}

        player.F.generation = gen
    },
    gainMult() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    getResetGain() {
        let req = new Decimal(1)
        return req
    },
    getNextAt() {
        let req = new Decimal(10).pow(player.F.total.times(9))

        if (player.F.total.eq(0)) {
            req = new Decimal(0)
        }
        return req
    },
    canReset() {
        try {
            return player.E.points.gte(tmp.F.nextAt)
        }
        catch {
            return false
        }
    },
    resource: "F", // Name of prestige currency
    baseResource: "E", // Name of resource prestige is based on
    baseAmount() {return player.E.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["E", "F"],
    exponent() {
        let exp = new Decimal(1)

        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    doReset(reset) {
        if (layers[reset].row <= this.row) return 

        let keep = []

        layerDataReset(this.layer, keep)
    },
    /*prestigeButtonText() {
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
    },*/
    passiveGeneration() {
        function cangenerate() {
            let cangen = true
            return cangen
        }
        let pg = new Decimal(0)

        if (!cangenerate()) {
            pg = new Decimal(0)
        }
        return pg
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        return exp
    },
    callablefunction() {
        player.F.productname = document.getElementById("F-prodname1").value
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "f: Reset for F", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    effect() {
        let effect = player.F.product.add(1).log(10).times(5).add(1)
        return effect
    },
    effectDescription() {
        return "and your "+format(player.F.product)+" "+player.F.productname+" boost LP by "+format(this.effect())+"x"
    },
    layerShown(){
        if (hasUpgrade("E", 36)) {
            player[this.layer].shown = true
        }
        return player[this.layer].shown
    },
    upgrades: {
        11: {
            title: "Factory Initalisation",
            description: "First person employed! ...its you. Start generating +1 product",
            cost: new Decimal(0),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return true},
        },
        12: {
            title: "Advertisement",
            description: "Advertise your factory so you can get more workers. Its not very effective. Generate +2 product",
            cost: new Decimal(10),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",11)},
        },
        13: {
            title: "Friends and family",
            description: "Invite friends and family to help you, but they want a price... Generate +3 product",
            cost: new Decimal(25),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",12)},
        },
        14: {
            title: "Social Media",
            description: "Advertise your factory on social media so more people can contribute. Generate +5 product",
            cost: new Decimal(75),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",13)},
        },
        15: {
            title: "Free energy drinks",
            description: "Finally starting to see some progress! Also you have alot more money than you need so why not buy an energy drink vending machine? Unlock a clickable.",
            cost: new Decimal(150),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",14)},
        },
        16: {
            title: "Invite a friend promo",
            description: "You decide that you need more people and should probably start working a bit outside the box. Whoever invites a friend to work gets 10 free energy drinks. Generate x1.7 product but ED (Energy Drinks) are twice the demand",
            cost: new Decimal(500),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",15)},
        },
        21: {
            title: "Redesign your company",
            description: "Your company logo looks bad, your factory looks bad. Redesign it all and make it look better for more people to work. Generate +24 product",
            cost: new Decimal(1000),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",16)},
        },
        22: {
            title: "Limited Edition",
            description: 'Limited Edition "Energy" Drink. Who even knows what they put into this anymore. Generate +48 product and workers work twice as fast',
            cost: new Decimal(2500),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",21)},
        },
        
        
        
    },
    milestones: {
       
    },
    buyables: {
       
    },
    clickables: {
        11: {
            title: "Buy energy drinks",
            cost() {
                return new Decimal(50)
            },
            canClick() {return player.F.product.gte(this.cost())},
            onClick() {
                if (player.F.product.gte(this.cost())) {
                    player.F.product = player.F.product.sub(this.cost())
                    player.F.energydrink = player.F.energydrink.add(10)
                }
                else {
                }
            },
            display() {
                return "Costs "+this.cost()+" Product<br><b>You have "+player.F.energydrink+" Energy Drinks"
            },
            unlocked() {
                return hasUpgrade("F", 15)
            }
            
        },
    },
    tabFormat: {
        "Start": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["upgrades",[1,2,3,4,5]],
                "blank",
                ["infobox", "start"],
            ],
    
            unlocked() {return true}
        },
        "Factory": {
            content: [
                "blank",
                ["raw-html",function() {
                    return "<h3>Enter a product name</h3><br><br><input type='text' id='F-prodname1' value='' placeholder='Product'></input><button onclick='tmp.F.callablefunction()'>Confirm</button>"
                }],
                "blank",
                "main-display",
                ["display-text", function() { 
                    return 'You have <h2 style="color: calc(' + tmp[this.layer].color + 'rgb(50,50,50)) ; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;">' + formatWhole(player[this.layer].product) +'</h2><span> '+player.F.productname+'</span>';
                }],
                "blank",
                "prestige-button",
                "blank",
                ["display-text", function() {
                    return "You are generating "+format(player.F.generation)+" "+player.F.productname+" every ~"+format(player.F.rate)+"ms"
                }],
                "blank",
                "upgrades",
                "clickables",

            ],
    
            unlocked() {return hasAchievement("Ach", 63)}
        },
    },
})
