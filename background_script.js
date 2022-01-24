// [] is to escape the slash
// i-modifier makes the search case insensitive
const regexProfile = /scoresaber.com[/]u/i
const regexLeaderboard = /scoresaber.com[/]leaderboard[/]/i
const regexScoresaber = /scoresaber.com/i

let tabDict = {}

// onUpdated fires relativly frequently. We only call content scripts when we are on scoresaber.com and the URL has changed
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => handleUpdatedEvent(tabId, changeInfo, tab))

async function handleUpdatedEvent(tabId, changeInfo, tab) {
    // if we are on scoresaber.com
    if (changeInfo.hasOwnProperty("url") && regexScoresaber.test(tab.url)) {
        // if 1. new navigation to scoresaber.com or 2. scoresaber.com url has changed or 3. the page was refreshed
        if(!tabDict.hasOwnProperty(tabId) || changeInfo.url !== tabDict[tabId] || changeInfo.status == "loading"){
            if (regexProfile.test(tab.url)) {
                tabDict[tabId] = changeInfo.url
                browser.tabs.insertCSS(tabId, { file: '/style.css' })
                browser.tabs.executeScript(tabId, { file: '/content_scripts/profile.js' })
            }
            if (regexLeaderboard.test(tab.url)){
                tabDict[tabId] = changeInfo.url
                browser.tabs.insertCSS(tabId, { file: '/style.css' })
                browser.tabs.executeScript(tabId, { file: '/content_scripts/leaderboard_map.js' })
            }
            // TODO the maps overview page should also get download buttons
        }
    }
    // if we left scoresaber.com and had an entry in our dictionary
    else if (changeInfo.hasOwnProperty("url") && tabDict.hasOwnProperty(tabId)) {
        delete tabDict[tabId]
    }
}

//delete entrys from tabDict if the tab is closed
browser.tabs.onRemoved.addListener((tabId, removeinfo) => {
    if (tabDict.hasOwnProperty(tabId)) {
        delete tabDict[tabId]
    }
})