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

        currentTrading: [],
        maxCompanies: 1,
        companies: [],

        Cconverter: "C",
        CconvertPercent: new Decimal(0.5),

    }},
    color: "rgb(0, 0, 255)",
    milestonePopups: true,
    update(diff) {
        let p = player.F.product.add(player.F.generation.times(new Decimal(1).div(player.F.rate).times(50)))
        //rate: player.F.generation.times(new Decimal(1).div(player.F.rate).times(50))
        if (player.paused || (!player.F.enabledrobots && hasUpgrade("F", 31))) {
            
        }
        else {
            if (hasUpgrade("F", 31)) {
                if (hasUpgrade("F", 31) && player.E.points.gt(1)) {
                    player.F.product = p

                    let e = (player.E.points.pow(0.1).div(100).add(1))

                    if (layerF.isTrading("FactoryProducers")) e = e.pow(3)
                    if (hasUpgrade("F", 41)) e = e.pow(0.3)
                    player.E.points = player.E.points.div(e).sub(1)
                }
                else {
    
                }
            }
            else {
                player.F.product = p
            }
        }

        for (i in player.F.currentTrading) {
            let pay
            if (typeof layerF.trading[player.F.currentTrading[i]].pay == "function") {
                pay = layerF.trading[player.F.currentTrading[i]].pay()
            }
            else {
                pay = layerF.trading[player.F.currentTrading[i]].pay 
            }  
            if (player.F.product.sub(pay).lt(0)) {
                console.log(player.F.product.toString(), pay.toString())
                player.F.currentTrading.splice(i,1)
            }
            else {
                player.F.product = player.F.product.sub(pay.div(20))
            }
        }

    },
    energydrink() {
        if (player.F.energydrink.gt(0) && ((player.F.enabledrobots && hasUpgrade("F", 31))||!hasUpgrade("F",31))) {
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
        if (layerF.isTrading("FactoryProducers")) {rate = rate.div(125)}
        if (hasUpgrade("F", 41)) {rate = rate.div(1.2)}

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
        if (hasUpgrade("F", 35)) {gen = gen.times(upgradeEffect("F", 35))}
        if (layerF.isTrading("Factorial")) {gen = gen.add(layerF.effect("Factorial"))}
        if (layerF.isTrading("FactoryProducers")) {gen = gen.times(10)}
        if (hasUpgrade("F", 42)) {gen = gen.times(player.F.energydrink.pow(0.1).add(1))}
        if (hasUpgrade("F", 43)) {gen = gen.times(upgradeEffect("F", 43))}
        if (hasUpgrade("F", 44)) {gen = gen.times(upgradeEffect("F", 44))}
        if (hasUpgrade("F", 45)) {gen = gen.times(upgradeEffect("F", 45))}
        if (hasUpgrade("F", 51)) {gen = gen.pow(1.2)}
        if (hasUpgrade("F", 52)) {gen = gen.times(10)}



        gen = gen.times(player.F.points.max(1))

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
        35: {
            title: "Factory Expansion",
            description: "Products boost A-D gain along with its own gain",
            cost: new Decimal(5e9),

            effect() {
                return player.F.product.add(1).log(2).add(1).min(100)
            },
            effectDisplay() {
                if (this.effect().gte(100)) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",34) && player.F.total.gte(2)},
        },
        36: {
            title: "Trading",
            description: "Unlock Trading",
            cost: new Decimal(5.1234567e10),


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",35) && player.F.total.gte(2)},
        },
        41: {
            title: "Energy efficient robots",
            description: "Robots are 1.2x faster and use much less energy",
            cost: new Decimal(2e14),


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",36) && player.F.total.gte(2)},
        },
        42: {
            title: "Ultra Energy Drinks",
            description: 'Energy Drinks boost production as well',
            cost: new Decimal(3e14),


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",41) && player.F.total.gte(2)},
        },
        43: {
            title: "Self Productionery",
            description: 'Products boost its own gain',
            cost: new Decimal(1e15),
            effect() {
                return player.F.product.add(1).log(10).add(1).min(100)
            },
            effectDisplay() {
                if (this.effect().gte(100)) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",42) && player.F.total.gte(2)},
        },
        44: {
            title: "Self Ditto",
            description: 'Products boost its own gain more',
            cost: new Decimal(1e16),
            effect() {
                return player.F.product.add(1).log(5).add(1).min(100)
            },
            effectDisplay() {
                if (this.effect().gte(100)) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",43) && player.F.total.gte(2)},
        },
        45: {
            title: "Who says we cant just do this all row",
            description: 'Products boost its own gain even more',
            cost: new Decimal(5e17),
            effect() {
                return player.F.product.add(1).log(2).add(1).min(1000)
            },
            effectDisplay() {
                if (this.effect().gte(1000)) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",44) && player.F.total.gte(2)},
        },
        46: {
            title: "Me",
            description: 'Products boost energy gain',
            cost: new Decimal(2.5e19),
            effect() {
                return player.F.product.add(1).log(100).add(1).min(1e10)
            },
            effectDisplay() {
                if (this.effect().gte(1e10)) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },


            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return hasUpgrade("F",45) && player.F.total.gte(2)},
        },
        51: {
            title: "Worldwide",
            description: "^1.2 Product gain",
            cost: new Decimal(1),
        },
        52: {
            title: "Fold Ten",
            description: "10x A-E and product gain",
            cost: new Decimal(2),
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
            title: "Respec Product for Energy",
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
        31: {
            title() {return "Reroll"},
            canClick() {return true},
            onClick() {
                player.currentTrading = []
                layerF.reroll()
            },
            display() {
                return "Reroll current traders which clears trades"
            },
            unlocked() {
                return hasUpgrade("F", 36)
            },
        },
        21: {
            title() {return "Company: "+player.F.companies[0]},
            canClick() {return player.F.currentTrading.length < player.F.maxCompanies || player.F.currentTrading.includes(player.F.companies[0])},
            onClick() {
                if (player.F.currentTrading.includes(player.F.companies[0])) {
                    player.F.currentTrading.splice(player.F.currentTrading.indexOf(player.F.companies[0]),1)
                }
                else {
                    player.F.currentTrading.push(player.F.companies[0])
                }
            },
            display() {
                return layerF.trading[player.F.companies[0]].description()
            },
            unlocked() {
                return hasUpgrade("F", 36)
            },
            style() {
                if (player.F.currentTrading.includes(player.F.companies[0])) {
                    return {
                        "backgroundColor": "lime", 
                    }
                }
                else {
                    return {
                        
                    }
                }
            },
            
        },
        22: {
            title() {return "Company: "+player.F.companies[1]},
            canClick() {return player.F.currentTrading.length < player.F.maxCompanies || player.F.currentTrading.includes(player.F.companies[1])},
            onClick() {
                if (player.F.currentTrading.includes(player.F.companies[1])) {
                    player.F.currentTrading.splice(player.F.currentTrading.indexOf(player.F.companies[1]),1)
                }
                else {
                    player.F.currentTrading.push(player.F.companies[1])
                }
            },
            display() {
                return layerF.trading[player.F.companies[1]].description()
            },
            unlocked() {
                return hasUpgrade("F", 36)
            },
            style() {
                if (player.F.currentTrading.includes(player.F.companies[1])) {
                    return {
                        "backgroundColor": "lime", 
                    }
                }
                else {
                    return {
                        
                    }
                }
            },
            
        },
        23: {
            title() {return "Company: "+player.F.companies[2]},
            canClick() {return player.F.currentTrading.length < player.F.maxCompanies || player.F.currentTrading.includes(player.F.companies[2])},
            onClick() {
                if (player.F.currentTrading.includes(player.F.companies[2])) {
                    player.F.currentTrading.splice(player.F.currentTrading.indexOf(player.F.companies[2]),1)
                }
                else {
                    player.F.currentTrading.push(player.F.companies[2])
                }
            },
            display() {
                return layerF.trading[player.F.companies[2]].description()
            },
            unlocked() {
                return hasUpgrade("F", 36)
            },
            style() {
                if (player.F.currentTrading.includes(player.F.companies[2])) {
                    return {
                        "backgroundColor": "lime", 
                    }
                }
                else {
                    return {
                        
                    }
                }
            },
            
        },
        41: {
            title() {return "CCCConverter"},
            canClick() {return true},
            onClick() {
                //128 C to 1 E
                let percent = document.getElementById("F-Cconverter-value").value

                if (percent.includes("%")) {
                    percent = new Decimal(parseInt(percent)).div(100)
                }
                percent = new Decimal(percent)
                if (percent.gt(1) && percent.lte(100)) {
                    percent = percent.div(100)
                }

                if (percent.gt(1) || percent.lte(0)) {
                    return
                }
                else {
                    addPoints("E", player.C.points.times(percent).div(128))
                    player.C.points = player.C.points.times(new Decimal(1).sub(percent))
                }
            },
            display() {
                return "Geneate"
            },
            unlocked() {
                return hasUpgrade("F", 36)
            },
            style() {
                if (player.F.currentTrading.includes(player.F.companies[2])) {
                    return {
                        "backgroundColor": "lime", 
                    }
                }
                else {
                    return {
                        
                    }
                }
            },
        }
    },
    tabFormat: {
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
                ["display-text", function() {
                    if (player.F.currentTrading.length > 1) {
                        return "But are losing "+format(player.F.generation)+" "+player.F.productname+" every ~"+format(player.F.rate)+"ms"
                    }}
                ],
                "blank",
                ["display-text", function() {
                    return "You have "+format(player.F.energydrink)+" Energy Drinks"
                }],
                "blank",
                ["clickables",[1]],
                "blank",
                ["upgrades",[1,2,3,4]],

            ],
    
            unlocked() {return hasAchievement("Ach", 63)}
        },
        "Trading": {
            content: [
                "blank",
                "blank",
                ["clickables", [3]],
                ["clickables",[2]],
                "blank",
                function() {
                    if (layerF.isTrading("CreationPlaza")) {
                        return ["raw-html", "<input id='F-Cconverter-value' value='' type='text' placeholder='Convert Percent'></input>"]
                    }
                },
                function() {
                    if (layerF.isTrading("CreationPlaza")) {
                        return ["clickable", [41]]
                    }
                }
                

            ],
    
            unlocked() {return hasUpgrade("F", 36)}
        },
        "Factory+": {
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
                ["display-text", function() {
                    if (player.F.currentTrading.length > 1) {
                        return "But are losing "+format(player.F.generation)+" "+player.F.productname+" every ~"+format(player.F.rate)+"ms"
                    }}
                ],
                "blank",
                ["display-text", function() {
                    return "You have "+format(player.F.energydrink)+" Energy Drinks"
                }],
                "blank",
                ["upgrades",[5]]
                

            ],
    
            unlocked() {return hasAchievement("Ach", 63)}
        },
    },
})

let layerF = {
    reroll() {
        let mod = Object.keys(layerF.trading)
        let list = []
        player.F.companies = []
        player.F.currentTrading = []

        mod.forEach((str, ind) => {
            list.push(str)
        })


        for (let i = 0; i <= 2;) {
            const rng = Math.floor(Math.random() * list.length)
            player.F.companies.push(list[rng])
            list.splice(rng, 1)
            i++;
        }

    },
    isTrading(x) {
        return player.F.currentTrading.includes(x)
    },
    effect(x) {
        return layerF.trading[x].effect()
    },
    trading: {

        EnergyCo: {
            pay: new Decimal(1e9),
            effect() {

            },
            description() {
                return "EnergyCo lets you use their Latest & Greatest™ Perpetual energy machine for only <b>1e9 product</b> a second"
            }
        },
        Aproductions: {
            pay: new Decimal(1e8),
            effect() {
                return player.B.points.times(player.C.points).times(player.D.points).pow(0.05).add(1)
            },
            description() {
                return "Aproductions gives you their Currency Converter which boosts A by all main Pre-E layers (except A) for only <b>1e8 product</b> a second<br>Effect: "+format(this.effect())+"x"
            }
        },
        B1GSH0TAUT0S: {
            pay: new Decimal(5.99),
            effect() {
                return new Decimal(1)
            },
            description() {
                return "HEY    EVERY    !! IT'S ME!! EV3RY  BUDDY  'S FAVORITE [[Number 1 Rated Salesman1997]] AND WHERE ON [Living EARTH]   AM I!! BUY MY SPECIL B [Robot] FOR ONLY $5.99 [[KROMER]] SO I CAN GET [[RICH RICH RICH]]!! SO I CAN SURPASS THAT LITTLE [Good for nothing] CRT AND REACH FOR THE [[HEAVENS]]!!!!!!"
            }
        },
        BarginTeam: {
            pay: new Decimal(1e11),
            effect() {
                return player.points.add(1).log("1e1500")
            },
            description() {
                return "BarginTeam gives you their B supercharger which powers B by +^"+format(this.effect())+" and increases B energizer cap by 1.2x for <b>1e11 product</b> a second"
            }
        },
        CreationPlaza: {
            pay() {
                try {
                    if (player.F.product.lte(500)) {
                        return new Decimal(50)
                    }
                    else {
                        return player.F.product.pow(0.99)
                    }
                }
                catch {return new Decimal(Infinity)}
            },
            effect() {

            },
            description() {
                return "CreationPlaza gives you their CCCConverter which converts 128 C to 1 E for <b>^0.99 of your product</b> BUT if below 500 it switches to <b>50 product</b>. Also disables E generation."
            }
        },
        DiverseCorporation: {
            pay: new Decimal(2.5e12),
            effect() {
                return player.A.points.times(player["&"].points).times(player.B.points).times(player.C.points).times(player.D.points).times(player.E.points).times(player.F.points).times(player.F.product).add(1).log(10).div(3)
            },
            description() {
                return "DiverseCorporation gives you their Diversity Machine which uses a diverse range of currencies to boost D by "+format(this.effect())+"x for only <b>2.5e12 product</b> a second"
            }
        },
        Factorial: {
            pay: new Decimal(5e55),
            effect() {
                return player.F.points.factorial()
            },
            description() {
                return "Factorial offers you to be put under their company for only <b>5e55 product</b>. Doing so lets them take advantage of your factories to boost them and you. The factorial of your factories is added on to product gain (eventually capped). Currently: +"+format(this.effect())
            }
        },
        FactoryProducers: {
            pay: new Decimal(1e10),
            effect() {

            },
            description() {
                return "FactoryProducers give you ultrafast robots that work at 125x the rate and produce 10x more but use significant amount of energy only for <b>1e10 product</b>"
            }
        }
        


        
    }
}
