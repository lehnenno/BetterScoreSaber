async function start(finalTry = false) {
    try {
        if (document.getElementById("oneClickButton") === null) {
            if(finalTry){
                console.error("Button was added in FinalTry")
            }
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
                bsrButton.onclick = (e => {navigator.clipboard.writeText(bsrButton.title);})
    
                let parent = document.body.querySelector(".tag")
                parent.after(bsrButton)
                parent.after(ocdButton)
            }
        }

        if(!finalTry){
            //without this the download button sometimes still doesnt appear...
            //with it it works most of the time...
            setTimeout(start, 500)
        }

    } catch (error) {
        console.debug("Error caught, retrying: " + error)
        setTimeout(start, 50)
        return
    }


}
start();