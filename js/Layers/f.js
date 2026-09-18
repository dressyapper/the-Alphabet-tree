addLayer("F", {
    name: "F", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        force: new Decimal(0),

    }},
    color: "rgb(0, 0, 255)",
    milestonePopups: true,
    resource: "F", // Name of prestige currency
    baseResource: "Lexiconal Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let exp = new Decimal(0.5)

        if (hasUpgrade("A", 41)) {exp = exp.times(1.1)}

        return exp
    }, // Prestige currency exponent

    doReset(reset) {
        if (layers[reset].row <= this.row) return 

        let keep = []

        layerDataReset(this.layer, keep)
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for A", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["E", "F"],
    layerShown(){ if (hasUpgrade("E", 36)) {
        player[this.layer].shown = true
    }
    return player[this.layer].shown},
    infoboxes: {
        start: {
            title: "Force",
            body: "Welcome to the Alphabet tree! This is going to be pretty long so good luck!<br>LP = Lexiconal Points",
        },
    },  
    upgrades: {
       
    },
    milestones: {
       
    },
    buyables: {
       
    },
    clickables: {
        
    },
    tabFormat: {
        "Start": {
            content: [
                "main-display",
                "blank",
                ["upgrades",[1,2,3,4,5]],
                "blank",
                //["infobox", "start"],
            ],
    
            unlocked() {return true}
        },
        "Force": {
            content: [
                "main-display",
                ["display-text", "soonsoon😳"],
                "blank",
                ["clickables", ["1"]],
                "milestones",
                "blank",
            ],
    
            unlocked() {return true}
        },
    },
})
