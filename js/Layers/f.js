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
        enabledrobots: true,
    }},
    color: "rgb(0, 0, 255)",
    milestonePopups: true,
    update(diff) {
        let p = player.F.product.add(player.F.generation.times(new Decimal(1).div(player.F.rate).times(50)))
        //rate: player.F.generation.times(new Decimal(1).div(player.F.rate).times(50))
        if (player.paused || (!player.F.enabledrobots && hasUpgrade("F", 31))) {
            return
        }
        if (hasUpgrade("F", 31)) {
            if (hasUpgrade("F", 31) && player.E.points.gt(1)) {
                player.F.product = p
                player.E.points = player.E.points.div(player.E.points.pow(0.1).div(100).add(1))
            }
            else {

            }
        }
        else {
            player.F.product = p
        }
    },
    energydrink() {
        if (player.F.energydrink.gt(0) && ((player.F.enabledrobots && hasUpgrade("F", 31))||!hasUpgrade("F",31)) && player.E.points.gt(1)) {
            if (new Decimal(Math.random()).times(100000).times(player.F.upgrades.length) > new Decimal(99999).div(player.F.energydrink.add(1).log(100).add(1)).div(new Decimal(1+hasUpgrade("F",16)).min(1.25))) {
                player.F.energydrink = player.F.energydrink.sub(1)
            }
        }
    },
    rate() {
        let rate = new Decimal(1000)

        if (hasUpgrade("F", 22)) rate = rate.div(2)
        if (hasUpgrade("F", 31)) rate = rate.div(4)
        if (hasUpgrade("F", 32)) rate = rate.div(player.F.energydrink.add(1).log(1.01).add(1))
        else {rate = rate.div(player.F.energydrink.add(1).log(10).add(1))}

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
        if (hasUpgrade("F", 31) && !player.E.points.eq(0)) {gen = gen.times(player.E.points.log(10).add(1))}
        if (hasUpgrade("F", 33)) {gen = gen.times(7)}



        gen = gen.times(player.F.points)

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
    onPrestige() {
        player.F.upgrades = []
        player.F.energydrink = new Decimal(0)
        player.F.product = new Decimal(0)
        player.F.enabledrobots = true
        
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

        if (hasUpgrade("F", 23)) effect = effect.times(40)
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
        23: {
            title: "Forty Fold",
            description: "Multiply the layer effect by 40x",
            cost: new Decimal(10000),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",22)},
        },
        24: {
            title: "Factory Automation",
            description: "Generate A based on your Product (capped at 1000%)",
            cost: new Decimal(10000),
            effect() {
                return player.F.product.add(1).log(2).add(1).min(10)
            },
            effectDisplay() {
                if (this.effect().gte(10)) {
                    return "+"+format(upgradeEffect(this.layer, this.id).times(100))+"% (CAPPED)"
                }
                else {
                    return "+"+format(upgradeEffect(this.layer, this.id).times(100))+"%"
                }
            },

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",23)},
        },
        25: {
            title: "Factory Butomation",
            description: "Generate B based on your Product (capped at 500%) and raise the B generation cap to Product... (omega woah)",
            cost: new Decimal(15000),
            effect() {
                return player.F.product.add(1).log(3).add(1).min(5)
            },
            effectDisplay() {
                if (this.effect().gte(5)) {
                    return "+"+format(upgradeEffect(this.layer, this.id).times(100))+"% (CAPPED)"
                }
                else {
                    return "+"+format(upgradeEffect(this.layer, this.id).times(100))+"%"
                }
            },

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",24)},
        },
        26: {
            title: "Factory Cutomation",
            description: "Generate C based on your Product (capped at 250%)",
            cost: new Decimal(25000),
            effect() {
                return player.F.product.add(1).log(5).add(1).min(2.5)
            },
            effectDisplay() {
                if (this.effect().gte(2.5)) {
                    return "+"+format(upgradeEffect(this.layer, this.id).times(100))+"% (CAPPED)"
                }
                else {
                    return "+"+format(upgradeEffect(this.layer, this.id).times(100))+"%"
                }
            },


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",25)},
        },
        31: {
            title: "AI",
            description: "Lets just replace everyone with robots. Robots work 4x faster and more based on energy but they also take energy. Oh and energy drinks are replaced with superchargers branded as energy drinks.",
            cost: new Decimal(100000),


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",26)},
        },
        32: {
            title: "Premium Energy Superchargers",
            description: "The energy drink price is tripled but is way more efficient",
            cost: new Decimal(125000),


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",31)},
        },
        33: {
            title: "Worldwide shipping",
            description: "Use your money to become world wide. 7x more product.",
            cost: new Decimal(1e8),


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",32)},
        },
        34: {
            title: "Where do we even store these things???",
            description: "We keep expanding the factory to add more robots and boost production. Its time we become fully worldwide. Boost energy by 100x when under the next factory requirement.",
            cost: new Decimal(2.5e9),


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",33)},
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
                let c = new Decimal(50)

                if (hasUpgrade("F", 32)) c = c.times(3)
                return c
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
        12: {
            title: "Respect Product for Energy",
            cost() {
                let c = new Decimal(50)

                if (hasUpgrade("F", 32)) c = c.times(3)
                return c
            },
            canClick() {return player.F.product.gte(this.cost()) && !player.E.points.eq(0)},
            onClick() {
                player.E.points = player.E.points.add(player.F.product.div(5))
                player.F.product = new Decimal(0)
                player.F.enabledrobots = false
            },
            display() {
                if (player.E.points.eq(0)) {
                    return "<h3>You cannot have 0 E to do this</h3>"
                }
                else {
                    return "Through some sort of dark magic you can sell all your product for "+format(player.F.product.div(5))+" Energy and disable robots"
                }
            },
            unlocked() {
                return hasUpgrade("F", 31)
            }
            
        },
        13: {
            title: "Robot Status",
            canClick() {return true},
            onClick() {
                player.F.enabledrobots = !player.F.enabledrobots
            },
            display() {
                if (player.F.enabledrobots) {
                    return "Generate"
                }
                else {
                    return "Idle"
                }
            },
            unlocked() {
                return hasUpgrade("F", 31)
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
                ["display-text", function() {
                    return "You have "+format(player.F.energydrink)+" Energy Drinks"
                }],
                "blank",
                "upgrades",
                "clickables",

            ],
    
            unlocked() {return hasAchievement("Ach", 63)}
        },
    },
})
