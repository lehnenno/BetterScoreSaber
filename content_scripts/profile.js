function getHashFromScoreSaberTableElement(element) {
    const regexUrl = /https:[/][/]cdn.scoresaber.com[/]covers[/].*.png/
    let backgroundElement = element.querySelector(".background")
    // FIXME on the profile view the only direct occurence of the song hash is in the image url of each song
    // maybe there is a way to get the hash from somewhere else in this case
    let songHash
    try{
        songHash = backgroundElement.getAttribute("style").match(regexUrl)[0].slice(34, -4)
    }
    catch(error){
        console.debug("Couldn't get songHash from image - probably a song without one")
        return "0000"
    }
    return songHash
}

async function start() {
    try {
        if (document.getElementById("oneClickButton")) {
            return
        }

        let song_entrys = document.getElementsByClassName("table-item")

        // accumulate all hashes to make a single request to the beatsaver api
        hashString = ""
        for (let element of song_entrys) {
            hashString += getHashFromScoreSaberTableElement(element) + ","
        }

        let songInfos;

        if (hashString !== "") {
            songInfos = await fetch("https://api.beatsaver.com/maps/hash/" + hashString)
                .then(response => { return response.json() })
        } else {
            throw Error("Couldn't extract song hashes from the DOM.")
        }


        //for each element add button
        for (let element of song_entrys) {
            if (!element.querySelector("#oneClickButton")) {
                let hash = getHashFromScoreSaberTableElement(element).toLowerCase()

                let ocdButton = document.createElement("a")
                ocdButton.id = "oneClickButton"
                ocdButton.classList.add("profile_button")
                ocdButton.classList.add("fas")
                ocdButton.classList.add("fa-cloud-download-alt")

                let bsrButton = document.createElement("a")
                bsrButton.id = "bsrButton"
                bsrButton.classList.add("profile_button")
                bsrButton.classList.add("fab")
                bsrButton.classList.add("fa-twitch")

                if (songInfos.hasOwnProperty(hash) && songInfos[hash] !== null) {
                    ocdButton.classList.add("profile_button_success")
                    ocdButton.title = "OneClick Download"
                    ocdButton.href = "beatsaver://" + songInfos[hash].id
                    
                    bsrButton.classList.add("profile_button_success")
                    bsrButton.title = songInfos[hash].id
                    bsrButton.onclick = (e => { navigator.clipboard.writeText("!bsr " + bsrButton.title); })
                } else {
                    ocdButton.classList.add("profile_button_danger")
                    ocdButton.title = "Couldn't find a bsr code"
                    ocdButton.href = "javascript: void(0)"

                    bsrButton.classList.add("profile_button_danger")
                    bsrButton.onclick = (e => { return })
                    bsrButton.title = "Couldn't find a bsr code"
                }

                let parent = element.querySelector(".clickable")

                parent.before(ocdButton)
                parent.before(bsrButton)
            }
        };
    } catch (error) {
        return
    }
}

start()

setInterval(start, 200)
