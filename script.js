const regexProfile = /scoresaber.com[/]u/i
const regexLeaderboard = /scoresaber.com[/]leaderboard[/]/i
const coverCoverUrl = /https:[/][/]cdn.scoresaber.com[/]covers[/].*.png/

async function start() {
    if (document.getElementById("oneClickButton") !== null) return

    if (regexLeaderboard.test(document.URL)) {
        let hashString = document.body.querySelector(".text-muted").innerHTML
        let songInfo = await fetch("https://api.beatsaver.com/maps/hash/" + hashString)
            .then(response => { return response.json() })

        let parent = document.body.querySelector(".tag")

        if (document.getElementById("oneClickButton") !== null) return //prevents multiple buttons if fetch request takes a bit longer
        createOcdButtonInParent(parent, "leaderboard", songInfo)
        createBsrButtonInParent(parent, "leaderboard", songInfo)
    }

    if (regexProfile.test(document.URL)) {
        let song_entrys = document.getElementsByClassName("table-item")

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

        if (document.getElementById("oneClickButton") !== null) return

        for (let element of song_entrys) {
            if (!element.querySelector("#oneClickButton")) {
                let hash = getHashFromScoreSaberTableElement(element).toLowerCase()
                let songInfo = null
                if (songInfos.hasOwnProperty(hash)) {
                    songInfo = songInfos[hash]
                }
                let parent = element.querySelector(".clickable")

                createOcdButtonInParent(parent, "profile", songInfo)
                createBsrButtonInParent(parent, "profile", songInfo)
            }
        }
    }
}


function createOcdButtonInParent(parent, context, songInfo) {
    let button = document.createElement("a")
    button.id = "oneClickButton"
    button.classList.add("fas")
    button.classList.add("fa-cloud-download-alt")

    if (songInfo === null || songInfo.hasOwnProperty("error")) {
        button.title = "Couldn't find a bsr code"
        button.classList.add("button_danger")
    } else {
        button.title = "OneClick Download"
        button.href = "beatsaver://" + songInfo.id
        button.classList.add("button_success")
    }

    switch (context) {
        case "profile":
            button.classList.add("profile_button")
            parent.before(button)
            break
        case "leaderboard":
            button.classList.add("leaderboard_button")
            parent.after(button)
            break
    }
}

function createBsrButtonInParent(parent, context, songInfo) {
    let button = document.createElement("a")
    button.id = "bsrButton"
    button.classList.add("fab")
    button.classList.add("fa-twitch")

    if (songInfo === null || songInfo.hasOwnProperty("error")) {
        button.title = "Couldn't find a bsr code"
        button.classList.add("button_danger")
    } else {
        button.title = songInfo.id
        button.onclick = (e => { navigator.clipboard.writeText("!bsr " + button.title); })
        button.classList.add("button_success")
    }

    switch (context) {
        case "profile":
            button.classList.add("profile_button")
            parent.before(button)
            break
        case "leaderboard":
            button.classList.add("leaderboard_button")
            parent.after(button)
            break
    }
}

function getHashFromScoreSaberTableElement(element) {
    let backgroundElement = element.querySelector(".background")
    // FIXME on the profile view the only direct occurence of the song hash is in the image url of each song
    // maybe there is a way to get the hash from somewhere else in this case
    let songHash
    try {
        songHash = backgroundElement.getAttribute("style").match(coverCoverUrl)[0].slice(34, -4)
    }
    catch (error) {
        console.debug("Couldn't get songHash from image - probably a song without one")
        return "0000"
    }
    return songHash
}

start()
setInterval(start, 200)

