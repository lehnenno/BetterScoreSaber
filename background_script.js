// [] is to escape the slash
// i-modifier makes the search case insensitive
const regexProfile = /scoresaber.com[/]u/i
const regexLeaderboard = /scoresaber.com[/]leaderboard[/]/i

let tabDict = {}

// onUpdated fires relativly frequently. We only call content scripts when we are on scoresaber.com
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => handleUpdatedEvent(tabId, changeInfo, tab))

async function handleUpdatedEvent(tabId, changeInfo, tab) {
    if (changeInfo.hasOwnProperty("url")) {
        if (regexProfile.test(tab.url) && (!tabDict.hasOwnProperty(tabId) || changeInfo.url !== tabDict[tabId])) {
            tabDict[tabId] = changeInfo.url
            browser.tabs.insertCSS(tabId, { file: '/style.css' })
            browser.tabs.executeScript(tabId, { file: '/content_scripts/profile.js' })
        }
        else if (regexLeaderboard.test(tab.url) && (!tabDict.hasOwnProperty(tabId) || changeInfo.url !== tabDict[tabId])) {
            tabDict[tabId] = changeInfo.url
            browser.tabs.insertCSS(tabId, { file: '/style.css' })
            browser.tabs.executeScript(tabId, { file: '/content_scripts/leaderboard_map.js' })
        }
        // TODO the maps overview page should also get download buttons
        else if (tabDict.hasOwnProperty(tabId) && changeInfo.url !== tabDict[tabId]) {
            //delete entrys from tabDict if scoresaber is left
            delete tabDict[tabId]
        }
    }
}

//delete entrys from tabDict if the tab is closed
browser.tabs.onRemoved.addListener((tabId, removeinfo) => {
    if (tabDict.hasOwnProperty(tabId)) {
        delete tabDict[tabId]
    }
})