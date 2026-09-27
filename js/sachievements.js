addLayer("Sach", {
    name: "Secret Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "a", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: "side", // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        x: false,
    }},
    resource: "Achievement Points",
    color: "rgb(99, 99, 99)",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tooltip: false,
    achievements: {
        "99990": {
            name: "You found me",
            done() {
                return player.Sach.x
            },
            tooltip() {
                let desc = "You found me!"
                return desc
            },
            unlocked() {
                return hasAchievement(this.layer, this.id)
            },
            style() {

            }
        },
        "99991": {
            name: "Lucky I",
            done() {
                let rng = Math.random()
                return rng < 1/1e4
            },
            tooltip() {
                let desc = "You have a 1 in 10000 chance at getting this every tick"
                return desc
            },
            style() {

            }
        },
        "99992": {
            name: "Lucky II",
            done() {
                let rng = Math.random()
                return rng < 1/1e5
            },
            tooltip() {
                let desc = "You have a 1 in 100000 chance at getting this every tick"
                return desc
            },
            style() {

            }
        },
        "99993": {
            name: "Lucky III",
            done() {
                let rng = Math.random()
                return rng < 1/1e6
            },
            tooltip() {
                let desc = "You have a 1 in 1000000 chance at getting this every tick"
                return desc
            },
            style() {

            }
        },
        "99994": {
            name: "Lucky IV",
            done() {
                let rng = Math.random()
                return rng < 1/1e7
            },
            tooltip() {
                let desc = "You have a 1 in 10000000 chance at getting this every tick"
                return desc
            },
            style() {

            }
        },
        "99995": {
            name: "Lucky V",
            done() {
                let rng = Math.random()
                return rng < 1/1e8
            },
            tooltip() {
                let desc = "You have a 1 in 100000000 chance at getting this every tick"
                return desc
            },
            style() {

            }
        },
        "99996": {
            name: "Lucky VI",
            done() {
                let rng = Math.random()
                return rng < 1/1e9
            },
            tooltip() {
                let desc = "You have a 1 in 1000000000 chance at getting this every tick"
                return desc
            },
            style() {

            }
        },
    },
    clickables: {
        11: {
            title: "",
            canClick() {return true},
            onClick() {
                player.Sach.x = true
            },
            display() {
            },
            style() {
                return {
                    "opacity":"0",
                }
            }
        },
    },
    tabFormat: {
        "Secret Achievements": {
            content: [
                ["achievements", [9999]],
                "blank",
                ["achievements", [1,2,3,4,5,6,7,8,9,10]],
                
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "clickables",

            ],
    
            unlocked() {return true}
        },
        "˙": {
            content: [
                ["achievement", [99990]],

            ],
        }
    },
})
