
function getHashFromScoreSaberTableElement(element){
    const regexUrl = /https:[/][/]cdn.scoresaber.com[/]covers[/].*.png/
    let backgroundElement = element.querySelector(".background")
    let songHash = backgroundElement.getAttribute("style").match(regexUrl)[0].slice(34, -4)
    return songHash
}

async function start() {
    let song_entrys = document.getElementsByClassName("table-item")

    // accumulate all hashes to make a single request to the beatsaver api
    hashString = ""
    for (let element of song_entrys) {
        if (!element.querySelector("#oneClickButton")) {
            hashString+=getHashFromScoreSaberTableElement(element)+","
        }
    }

    let songInfos;

    if(hashString !== ""){
        songInfos = await fetch("https://api.beatsaver.com/maps/hash/" + hashString)
        .then(response => {return response.json()})
        .catch(err => {console.error(err)})
    }


    //for each element add button
    for (let element of song_entrys) {
        if (!element.querySelector("#oneClickButton") && songInfos!==null) {
            let hash = getHashFromScoreSaberTableElement(element).toLowerCase()

            let button = document.createElement("a")
            button.id = "oneClickButton"
            button.classList.add("profile_dl_button")
            button.href = "beatsaver://" + songInfos[hash].id
            button.innerText = "⇓"

            element.querySelector(".clickable").before(button)
        }
    };
}

start();