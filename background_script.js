// [] is to escape the slash
// i-modifier makes the search case insensitive
const regexProfile = /scoresaber.com[/]u/i
const regexLeaderboard = /scoresaber.com[/]leaderboard[/]/i

// onUpdated fires relativly frequently. We only call content scripts when we are on scoresaber.com
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => handleUpdatedEvent(tabId, changeInfo, tab))

async function handleUpdatedEvent(tabId, changeInfo, tab) {
    if(changeInfo.status==="complete"){
        if (regexProfile.test(tab.url)) {
            browser.tabs.insertCSS(tabId, { file: '/style.css' })
            browser.tabs.executeScript(tabId, { file: '/content_scripts/profile.js' })
        }
    
        if (regexLeaderboard.test(tab.url)) {
            browser.tabs.insertCSS(tabId, { file: '/style.css' })
            browser.tabs.executeScript(tabId, { file: '/content_scripts/leaderboard_map.js' })
        }
    
        // TODO the maps overview page should also get download buttons
    }
}