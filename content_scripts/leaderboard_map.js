async function start() {
    try {
        if (document.getElementById("oneClickButton") === null) {
            let hashString = document.body.querySelector(".text-muted").innerHTML

            songInfo = await fetch("https://api.beatsaver.com/maps/hash/" + hashString)
                .then(response => { return response.json() })

            if (songInfo && document.getElementById("oneClickButton") === null) {
                let ocdButton = document.createElement("a")
                ocdButton.id = "oneClickButton"
                ocdButton.classList.add("leaderboard_button") //TODO make a leaderboard css entry
                ocdButton.classList.add("fas")
                ocdButton.classList.add("fa-cloud-download-alt")
                ocdButton.title = "OneClick Download"
                ocdButton.href = "beatsaver://" + songInfo.id

                let bsrButton = document.createElement("a")
                bsrButton.id = "bsrButton"
                bsrButton.classList.add("leaderboard_button")
                bsrButton.classList.add("fab")
                bsrButton.classList.add("fa-twitch")
                bsrButton.title = songInfo.id
                bsrButton.onclick = (e => { navigator.clipboard.writeText("!bsr " + bsrButton.title); })

                let parent = document.body.querySelector(".tag")

                if (songInfo.hasOwnProperty("error")) {
                    ocdButton.href = "javascript: void(0)"
                    ocdButton.title = "Couldn't find a bsr code"
                    ocdButton.classList.add("leaderboard_button_danger")
                    bsrButton.onclick = (e => { return })
                    bsrButton.title = "Couldn't find a bsr code"
                    bsrButton.classList.add("leaderboard_button_danger")
                } else {
                    ocdButton.classList.add("leaderboard_button_success")
                    bsrButton.classList.add("leaderboard_button_success")
                }

                parent.after(bsrButton)
                parent.after(ocdButton)
            }
        }

    } catch (error) {
        console.debug("Error caught, retrying: " + error)
        setTimeout(start, 50)
        return
    }


}

start();

setInterval(start,1000)