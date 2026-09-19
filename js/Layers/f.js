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
    }},
    color: "rgb(0, 0, 255)",
    milestonePopups: true,
    update(diff) {
        //rate: player.F.generation.times(new Decimal(1).div(player.F.rate).times(50))
        player.F.product = player.F.product.add(player.F.generation.times().times(player.F.points))
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
        let effect = player.F.product
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
    productgeneration() {
        let gen = new Decimal(0)

        if (hasUpgrade("F", 11)) {gen = gen.add(1)}

        player.F.generation = gen
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
            description: "Advertise your factory so you can get more workers. Its not very effective.",
            cost: new Decimal(10),

            currencyLayer: "F",
            currencyInternalName: "product",
            currencyDisplayName() {return player.F.productname},
            unlocked() {return true},
        },
        
        
    },
    milestones: {
       
    },
    buyables: {
       
    },
    clickables: {
        /*11: {
            title: "Popups",
            canClick() {return true},
            onClick() {
                tmp.A.milestonePopups = !tmp.A.milestonePopups
            },
            display() {
                if (tmp.A.milestonePopups) {
                    return "Enabled"
                }
                else {
                    return "Disabled"
                }
            },
            
        },*/
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
                    return "You are generating "+player.F.generation+" "+player.F.productname+" every ~1000ms"
                }],
                "blank",
                "upgrades",

            ],
    
            unlocked() {return hasAchievement("Ach", 63)}
        },
    },
})
