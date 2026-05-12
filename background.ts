chrome.action.onClicked.addListener((tab) => {

  if (tab.id && tab.url?.includes("youtube.com")) {
    chrome.tabs.sendMessage(tab.id, { action: "toggle" })
  } else {

    console.log("Extension clicked, but not on YouTube")
  }
})