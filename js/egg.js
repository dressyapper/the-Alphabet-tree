addLayer("🥚", {
    name: "🥚", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🥚", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        text: "",
    }},
    color: "rgb(162, 0, 255)",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    tooltip: "There is a tree here",
    layerShown(){return player.egg == "show"},
    infoboxes: {
        start: {
            title: "",
            body(){ try {player['🥚'].text} catch {false}},
        },
    },  
    clickables: {
        11: {
            title: "There is a man beind the tree",
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
            
        },
    },
})

