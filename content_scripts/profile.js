function getHashFromScoreSaberTableElement(element){
    const regexUrl = /https:[/][/]cdn.scoresaber.com[/]covers[/].*.png/
    let backgroundElement = element.querySelector(".background")
    let songHash = backgroundElement.getAttribute("style").match(regexUrl)[0].slice(34, -4)
    return songHash
}

async function start(finalTry = false) {
    try {
        if(document.getElementById("oneClickButton")){
            //FIXME there might be a better solution for this
            //Animation seems to take between 500 and 1000ms -> Check how long this actually takes
            //FinalTry is used so there is not something running in the background forever
            if(!finalTry){
                setTimeout(start,500, true)
                setTimeout(start,600, true)
                setTimeout(start,700, true)
                setTimeout(start,800, true)
                setTimeout(start,900, true)
                setTimeout(start,1000, true)
            }
            return
        }

        let song_entrys = document.getElementsByClassName("table-item")

        // accumulate all hashes to make a single request to the beatsaver api
        hashString = ""
        for (let element of song_entrys) {
            hashString+=getHashFromScoreSaberTableElement(element)+","
        }
    
        let songInfos;
    
        if(hashString !== ""){
            songInfos = await fetch("https://api.beatsaver.com/maps/hash/" + hashString)
            .then(response => {return response.json()})
        } else {
            throw Error("Couldn't extract song hashes from the DOM.")
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
    } catch (error) {
        console.debug("Error caught, retrying: " + error)
        setTimeout(start,50)
        return
    }
}

start()
