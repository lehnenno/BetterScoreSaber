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
                let button = document.createElement("a")
                button.id = "oneClickButton"
                button.classList.add("profile_dl_button") //TODO make a leaderboard css entry
                button.href = "beatsaver://" + songInfo.id
                button.innerText = "⇓"

                document.body.querySelector(".tag").after(button)
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