addLayer("?", {
    name: "?", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "?", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    tooltip() {
        return "This hasn't been unlocked yet!"
    },
    color: "rgba(0, 0, 0, 0)",
    row: 99, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return false},
    tabFormat: {
        "?": {
            content: [
                ["display-text", ()=>{return "This part isnt unlocked yet, come back later!"}]
            ],
    
            unlocked() {return true}
        },
    },
})
