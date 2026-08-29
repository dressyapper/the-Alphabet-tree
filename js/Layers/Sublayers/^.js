

addLayer("^", {
    name: "^", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "^", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: "side", // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        shown: false,

		points: new Decimal(0),
        earn: new Decimal(1),
        clicks: new Decimal(1),

        trueclicks: new Decimal(0),

        chargedpoints: new Decimal(0),
        modbonus: new Decimal(0),

        enabledmods: [],
        currentmod: [1,2,3],

        prestige() {
            player["^"].upgrades = []
            player["^"].buyables[11] = new Decimal(0)
            player["^"].chargedpoints = player["^"].chargedpoints.add(this.prestigeformula())
            player["^"].points = new Decimal(0)
            player["^"].clicks = new Decimal(0)

        },
        reset(layer) {
            player["^"].upgrades = []
            player["^"].points = new Decimal(0)
        },
        prestigeformula() {
            if (this.modbonus.lt(0)) {
                return new Decimal(0)
            }
            else {
                return player["^"].points.div("1.8e308").times(player["^"].modbonus.add(1)) 
            }
        },
        rollmods() {
            player["^"].currentmod = []
            let mod = Object.keys(tmp["^"].mod)
            let list = []

            mod.forEach((str, ind) => {
                list.push(str)
            })


            for (let i = 0; i <= 2;) {
                const rng = Math.floor(Math.random() * list.length)
                player["^"].currentmod.push(list[rng])
                list.splice(rng, 1)
                i++;
            }

            player["^"].enabledmods = []

        },
        modenabled(x) {
            for (i in player["^"].enabledmods) {
                if (tmp["^"].mod[player["^"].enabledmods[i]].title == x) {
                    return true
                }
            }
            return false
        }
    }},
    color: "rgb(131, 0, 231)",
    requires: new Decimal(Infinity), // Can be a function that takes requirement increases into account
    resource: "^", // Name of prestige currency
    baseAmount() {return player.A.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    mod() {
        return {
            0: {
                title: "Rooted returns",
                desc: "^0.5 earn",
                mod: new Decimal(0.9)
            },
            1: {
                title: "Squared returns",
                desc: "^2 earn",
                mod: new Decimal(-0.9)
            },
            2: {
                title: "Slightly broken",
                desc: "The button has a 50% chance to work each press",
                mod: new Decimal(0.1),
            },
            3: {
                title: "too broken...",
                desc: "The button has a 5% chance to work each press. Good luck.",
                mod: new Decimal(2),
            },
            4: {
                title: "Diminishing returns",
                desc: "The buyable effect is logarithmic instead of linear, and trust me, it isn't any better.",
                mod: new Decimal(1.5)
            },
            5: {
                title: "evil upgrade 36",
                desc: "Every upgrade divides the base by +1 (7 upgrades would divide it by 8, 2 upgrades would divide it by 3, etc...) but adds an extra earn initially",
                mod: new Decimal(1.75)
            },
            6: {
                title: "free",
                desc: "Every upgrade doubles the base",
                mod: new Decimal(-3)
            },
        }
    },
    earnformula() {
        let e = new Decimal(1)
        if (hasUpgrade("^", 36)) {e = e.add(new Decimal(player["^"].upgrades.length).div(1000))}
        if (hasUpgrade("^", 11)) {e = e.add(0.1)}
        if (player["^"].modenabled("free")) {e = e.times(new Decimal(2).pow(player["^"].upgrades.length))}
        if (player["^"].modenabled("evil upgrade 36")) {e = e.div(new Decimal(player["^"].upgrades.length).add(1))}
        if (player["^"].modenabled("evil upgrade 36")) {e = e.add(1)}
        if (hasUpgrade("^", 12)) {e = e.pow(1.01)}
        if (hasUpgrade("^", 13)) {e = e.pow(1.02)}
        if (hasUpgrade("^", 14)) {e = e.pow(1.5)}
        if (hasUpgrade("^", 15)) {e = e.pow(1.75)}   
        if (hasUpgrade("^", 16)) {e = e.pow(2)}    
        if (hasUpgrade("^", 21)) {e = e.pow(2.25)}   
        if (hasUpgrade("^", 22)) {e = e.pow(1.5)}   
        if (hasUpgrade("^", 23)) {e = e.pow(1.25)}  
        if (hasUpgrade("^", 24)) {e = e.pow(2)}  
        if (hasUpgrade("^", 25)) {e = e.pow(1.01)}  
        if (hasUpgrade("^", 26)) {e = e.pow(1.2)} 
        if (hasUpgrade("^", 31)) {e = e.pow(1.01)} 
        if (hasUpgrade("^", 32)) {e = e.pow(1.75)} 
        if (hasUpgrade("^", 33)) {e = e.pow(2)} 
        e = e.pow(buyableEffect("^", 11))
        if (hasUpgrade("^", 35)) {e = e.pow(1.33)} 
        if (hasUpgrade("^", 41)) {e = e.pow(1.11)} 
        if (hasUpgrade("^", 42)) {e = e.pow(1.22)} 
        if (hasUpgrade("^", 43)) {e = e.pow(1.33)} 
        if (hasUpgrade("^", 44)) {e = e.pow(1.44)} 
        if (hasUpgrade("^", 45)) {e = e.pow(1.55)} 
        if (hasUpgrade("^", 46)) {e = e.pow(1.66)} 


        if (player["^"].modenabled("Rooted returns")) {e = e.pow(0.5)}
        if (player["^"].modenabled("Squared returns")) {e = e.pow(2)}
         





        if (player["^"].chargedpoints.gt(0)) {e = e.pow(player["^"].chargedpoints.add(1).log(1e3).add(1))}
        player["^"].earn = e
        return e
    },
    doReset(reset) {
        if (layers[reset].row <= this.row) return 
        let keep = []


    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    resetsNothing: true,
    layerShown(){
        if (player.D.points.gte(1)) {
            player[this.layer].shown = true
        }
        return player[this.layer].shown
    },
    unbrokeninf() {
        if (!hasMilestone("^", 1)) {
            if (player["^"].points.gte("1.8e308")) {
                player["^"].points = new Decimal("1.8e308")
            }
            if (player["^"].earn.gte("1.8e308")) {
                player["^"].earn = new Decimal("1.8e308")
            }
        }
    },
    getmodbonus() {
        player["^"].modbonus = new Decimal(0)
        for (i in player["^"].enabledmods) {
            player["^"].modbonus = player["^"].modbonus.add(tmp["^"].mod[player["^"].enabledmods[i]].mod)
        }
    },
    infoboxes: {
        minigame: {
            title: "Minigame",
            body: "Is the game getting too boring now, Do you like really big number growth? Well try this minigame layer!",
        },
    },
    clickables: {
        11: {
            title: "Click me!",
            canClick() {return player["^"].points.lt("1.8e308") || hasMilestone("^", 1)},
            onClick() {
                let rng = 1
                if (player["^"].modenabled("Slightly broken")) rng = rng * 2
                if (player["^"].modenabled("too broken...")) rng = rng * 20
                let x = Math.floor(Math.random() * rng)
                if (x == 0) {
                    if (player["^"].points.add(player["^"].earn).gt("1.8e308") && !hasMilestone("^", 1)) {
                        addPoints("^", new Decimal("1.8e308").sub(player["^"].points))
                    }
                    else {
                        addPoints("^", player["^"].earn)
                    }
                    player["^"].clicks = player["^"].clicks.add(1)
                    player["^"].trueclicks = player["^"].trueclicks.add(1)
                }
            },
            display() {
                return "<br><h2>+"+format(player["^"].earn)+" ^"
            },
            unlocked() {
                return true
            }
            
        },
        12: {
            title: "Prestige",
            canClick() {return true},
            onClick() {
                player["^"].prestige()
            },
            display() {
                return "<br><h2>+"+format(player["^"].prestigeformula())+" ^"
            },
            unlocked() {
                return true
            } 
        },
        21: {
            title() {
                return tmp["^"].mod[player["^"].currentmod[0]].title
            },
            canClick() {return player["^"].clicks.lte(0)},
            onClick() {
                if (player["^"].enabledmods.includes(player["^"].currentmod[0])) {
                    player["^"].enabledmods.splice(player["^"].enabledmods.indexOf(player["^"].currentmod[0]), 1)
                }
                else {
                    player["^"].enabledmods.push(player["^"].currentmod[0])
                }
                
            },
            display() {
                return "<h4><b>"+tmp["^"].mod[player["^"].currentmod[0]].desc+"</b><br><br>Gives "+tmp["^"].mod[player["^"].currentmod[0]].mod.times(100)+"% more Charged ^"
            },
            unlocked() {
                return true
            },
            style() {
                if (!this.canClick()) {
                    if (player["^"].enabledmods.includes(player["^"].currentmod[0])) {
                        return {
                            "border-color": "white",
                            "border-width": "2px"
                        }
                    }
                    else {
                        return
                    }
                }
                if (player["^"].enabledmods.includes(player["^"].currentmod[0])) {
                    return {
                        "background-color": "lime"
                    }
                }
                else {
                    return {
                        "background-color": "red"
                    }
                }
            }
        },
        22: {
            title() {
                return tmp["^"].mod[player["^"].currentmod[1]].title
            },
            canClick() {return player["^"].clicks.lte(0)},
            onClick() {
                if (player["^"].enabledmods.includes(player["^"].currentmod[1])) {
                    player["^"].enabledmods.splice(player["^"].enabledmods.indexOf(player["^"].currentmod[1]), 1)
                }
                else {
                    player["^"].enabledmods.push(player["^"].currentmod[1])
                }
                
            },
            display() {
                return "<h4><b>"+tmp["^"].mod[player["^"].currentmod[1]].desc+"</b><br><br>Gives "+tmp["^"].mod[player["^"].currentmod[1]].mod.times(100)+"% more Charged ^"
            },
            unlocked() {
                return true
            },
            style() {
                if (!this.canClick()) {
                    if (player["^"].enabledmods.includes(player["^"].currentmod[1])) {
                        return {
                            "border-color": "white",
                            "border-width": "2px"
                        }
                    }
                    else {
                        return
                    }
                }
                if (player["^"].enabledmods.includes(player["^"].currentmod[1])) {
                    return {
                        "background-color": "lime"
                    }
                }
                else {
                    return {
                        "background-color": "red"
                    }
                }
            }
        },
        23: {
            title() {
                return tmp["^"].mod[player["^"].currentmod[2]].title
            },
            canClick() {return player["^"].clicks.lte(0)},
            onClick() {
                if (player["^"].enabledmods.includes(player["^"].currentmod[2])) {
                    player["^"].enabledmods.splice(player["^"].enabledmods.indexOf(player["^"].currentmod[2]), 1)
                }
                else {
                    player["^"].enabledmods.push(player["^"].currentmod[2])
                }
                
            },
            display() {
                return "<h4><b>"+tmp["^"].mod[player["^"].currentmod[2]].desc+"</b><br><br>Gives "+tmp["^"].mod[player["^"].currentmod[2]].mod.times(100)+"% more Charged ^"
            },
            unlocked() {
                return true
            },
            style() {
                if (!this.canClick()) {
                    if (player["^"].enabledmods.includes(player["^"].currentmod[2])) {
                        return {
                            "border-color": "white",
                            "border-width": "2px"
                        }
                    }
                    else {
                        return
                    }
                }
                if (player["^"].enabledmods.includes(player["^"].currentmod[2])) {
                    return {
                        "background-color": "lime"
                    }
                }
                else {
                    return {
                        "background-color": "red"
                    }
                }
            }
        },
        31: {
            title: "Reroll",
            canClick() {return player["^"].clicks.lte(0)},
            onClick() {
                player["^"].rollmods()
            },
            display() {
                return "Reroll Current modifiers"
            },
            unlocked() {
                return true
            } 
        },
    },

    upgrades: {
        11: {
            title: "^ initialisation",
            description: "+0.1 ^ earn",
            cost: new Decimal(15),
            unlocked() {return true},
        },
        12: {
            title: "Exponential Beginning",
            description: "If you thought that previous upgrade was useless then you woud be wrong. ^1.01 Earn",
            cost: new Decimal(150),
            unlocked() {return hasUpgrade("^", 11)},
        },
        13: {
            title: "That was still useless",
            description: "^1.02 Earn",
            cost: new Decimal(200),
            unlocked() {return hasUpgrade("^", 12)},
        },
        14: {
            title: "Lets speed things up a bit",
            description: "^1.5 earn",
            cost: new Decimal(300),
            unlocked() {return hasUpgrade("^", 13)},
        },
        15: {
            title: "Just a bit more...",
            description: "^1.75 earn",
            cost: new Decimal(500),
            unlocked() {return hasUpgrade("^", 14)},
        },
        16: {
            title: "There we go",
            description: "^2 earn",
            cost: new Decimal(750),
            unlocked() {return hasUpgrade("^", 15)},
        },
        21: {
            title: "This is a very informal layer",
            description: "^2.25 earn",
            cost: new Decimal(1000),
            unlocked() {return hasUpgrade("^", 16)},
        },
        22: {
            title: "Down we go",
            description: "^1.5 earn",
            cost: new Decimal(1250),
            unlocked() {return hasUpgrade("^", 21)},
        },
        23: {
            title: "weeeeeee",
            description: "^1.25 earn",
            cost: new Decimal(1500),
            unlocked() {return hasUpgrade("^", 22)},
        },
        24: {
            title: "Small earn",
            description: "^2 earn",
            cost: new Decimal(2000),
            unlocked() {return hasUpgrade("^", 23)},
        },
        25: {
            title: "Big earn",
            description: "^1.01 earn",
            cost: new Decimal(10000),
            unlocked() {return hasUpgrade("^", 24)},
        },
        26: {
            title: "Medium earn",
            description: "^1.2 earn ",
            cost: new Decimal(25000),
            unlocked() {return hasUpgrade("^", 25)},
        },
        31: {
            title: "Mean earn",
            description: "^1.01 earn ",
            cost: new Decimal(50000),
            unlocked() {return hasUpgrade("^", 26)},
        },
        32: {
            title: "Nice earn",
            description: "^1.75 earn ",
            cost: new Decimal(55000),
            unlocked() {return hasUpgrade("^", 31)},
        },
        33: {
            title: "That escalated QUICK",
            description: "^2 earn ",
            cost: new Decimal(2.5e6),
            unlocked() {return hasUpgrade("^", 32)},
        },
        34: {
            title: "This exists here?",
            description: "Unlock a buyable",
            cost: new Decimal(1.5e10),
            unlocked() {return hasUpgrade("^", 33)},
        },
        35: {
            title: "yes it does",
            description: "^1.33 earn",
            cost: new Decimal(2e12),
            unlocked() {return hasUpgrade("^", 34)},
        },
        36: {
            title: "NOT AN EXPONENT!!!1!!11!!!!! SO EVIL!!!!!!!!!11!!1!!!!",
            description: "Every upgrade increases the base by +0.001",
            cost: new Decimal(3e16),
            unlocked() {return hasUpgrade("^", 35)},
        },
        41: {
            title: "Many earn",
            description: "^1.11 earn",
            cost: new Decimal(1e21),
            unlocked() {return hasUpgrade("^", 36)},
        },
        42: {
            title: "Many earn",
            description: "^1.22 earn",
            cost: new Decimal(3e25),
            unlocked() {return hasUpgrade("^", 41)},
        },
        43: {
            title: "Lazy game development",
            description: "^1.33 earn",
            cost: new Decimal(1e40),
            unlocked() {return hasUpgrade("^", 42)},
        },
        44: {
            title: "Lazy game development",
            description: "^1.44 earn",
            cost: new Decimal(1e107),
            unlocked() {return hasUpgrade("^", 43)},
        },
        45: {
            title: "Lazy game development",
            description: "^1.55 earn",
            cost: new Decimal(1e250),
            unlocked() {return hasUpgrade("^", 44)},
        },
        
        
    },
    milestones: {
        1: {
            requirementDescription: "Never C^",
            effectDescription: "This was too broken, your never breaking infinity now",
            unlocked() {return true},
            done() {return false},
        },
    },
    buyables: {
        11: {
            title: "^ Exponential Increase",
            description: "Boost ^ exponentially",
            purchaseLimit() {
                return new Decimal(Infinity)
            },
            unlocked() {return hasUpgrade("^", 34)},
            cost(x) {
                let p = new Decimal(7)
                if (x.gte(15)) {
                    p = new Decimal(8.5)
                }
                if (x.gte(350)) {
                    p = new Decimal(11)
                }
                if (x.gte(700)) {
                    p = new Decimal(15)
                }
                return x.pow(this.effect(x)).pow(p)
            },
            display() {
                return ""+this.description+"<br>Cost: " + format(this.cost()) + " ^" + "<br>Bought: " + getBuyableAmount(this.layer, this.id)+"<br>Effect: ^"+format(buyableEffect(this.layer, this.id))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost()) && ((player["^"].points.lt("1.8e308") && player["^"].earn.lt("1.8e308")) || hasMilestone("^", 1))
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let d = new Decimal(100)

                let eff = new Decimal(1).add(x.div(d))

                if (player["^"].modenabled("Diminishing returns")) {
                    eff = new Decimal(1).add(x.add(1).log(1e10))
                }

               

                return eff
            },
        },
    },
    tabFormat: {
        "^": {
            content: [
                "main-display",
                ["clickable",[11]],
                "blank",
                ["upgrades",[1,2,3,4,5,6,7]],
                ["buyables", [1]],
                ["infobox", "minigame"],
            ],
    
            unlocked() {return true}
        },
        "Buyables": {
            content: [
                "main-display",
                ["buyable", [69]],
                "blank",
                ["infobox", "uh oh"],
            ],
    
            unlocked() {return hasUpgrade("^", 34)}
        },
        "+^": {
            content: [
                ["display-text", function() { 
                    return 'You have <h2 style="color: ' + tmp[this.layer].color + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;">' + format(player[this.layer].chargedpoints, 2) + '</h2><span> Charged ^</span>';
                }],
                ["display-text", function() { 
                    return 'You get a bonus <h2 style="color: ' + tmp[this.layer].color + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;">' + formatWhole(player[this.layer].modbonus.times(100)) +'%</h2><span> Charged ^</span>';
                }],
                ["display-text", function() { 
                    return 'Your charged ^ boosts ^ by <h2 style="color: ' + tmp[this.layer].color + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;"> ^' + format(player["^"].chargedpoints.add(1).log(1e3).add(1), 3) +'</h2>';
                }],
                "blank",
                ["clickable",[12]],
                "blank",
                ["display-text", "<h1>Modifiers</h1><br><br><p>(modifiers are disabled when you click for the first time in the current prestige)</p>"],
                "blank",
                ["clickables", [2]],
                ["clickable", [31]],
                "blank",
                "milestones",
                
            ],
    
            unlocked() {
                return hasUpgrade("^", 999999) || hasAchievement("^", 14)
            }
        },
        "Achievements": {
            content: [
                "main-display",
                "blank",
                "achievements",
                "blank",
            ],
    
            unlocked() {return true}
        },
    },
    achievements: {
        11: {
            name: "This is just a mini tree isnt it?",
            done() {
                return player["^"].points.gte(1)
            },
            tooltip: "Start the ^ layer"
        },
        12: {
            name: "Here's the progress!",
            done() {
                return player["^"].earn.gte(2)
            },
            tooltip: "Make more than 2^ every click"
        },
        13: {
            name: "woah",
            done() {
                return player["^"].earn.gte(80)
            },
            tooltip: "Make more than 80^ every click"
        },
        14: {
            name: "What the hell",
            done() {
                return hasUpgrade("^", 34) && player.tab == "^" && player.subtabs["^"].mainTabs == "Buyables"
            },
            tooltip: "what"
        },
    }
})
