//for testing
addLayer("Dev", {
    name: "Developer Menu", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "De", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    resource: "Achievement Points",
    color: "rgb(255, 255, 255)",
    row: "otherside", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    achievements: {
        11: {
            name: "The beginning",
            done() {
                return player.A.points.gte(1)
            },
            tooltip: "Reset for the first time",
            unlocked() {
                return true
            },
            style() {
                return {

                }
            },
            onComplete() {
                addTheme("Alphabet")
            }
        },
    },
    pointeff() {
        let pts = player.Ach.points

        return new Decimal(1).add(pts.div(1.5))
    },
    tabFormat: {
        "Dev": {
            content: [
                () => {
                    if (hasUpgrade("$", 13)) {
                        player.Ach.points = new Decimal(player.Ach.achievements.length)
                        return "main-display"
                    }
                },
                () => {
                    if (hasUpgrade("$", 13)) {
                        let x = () => {return "Which is bosting your points by "+tmp.Ach.pointeff+"x"}
                        return ["display-text", x()]
                    }
                },
                "achievements",
                "blank",
            ],
    
            unlocked() {return true}
        },
    },
})
