async function start() {
    if (document.getElementById("oneClickButton") === null && document.readyState==="complete") {
        let hashString = document.body.querySelector(".text-muted").innerHTML

        if (hashString !== "") {
            songInfo = await fetch("https://api.beatsaver.com/maps/hash/" + hashString)
                .then(response => { return response.json() })
                .catch(err => { console.error(err) })
        }

        let button = document.createElement("a")
        button.id = "oneClickButton"
        button.classList.add("profile_dl_button") //TODO make a leaderboard css entry
        button.href = "beatsaver://" + songInfo.id
        button.innerText = "⇓"

        document.body.querySelector(".tag").after(button)
    }
}

start();