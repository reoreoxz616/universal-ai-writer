chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getActiveText") {
    const active = document.activeElement;

    if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
      sendResponse(active.value);
    } else if (active && active.isContentEditable) {
      sendResponse(active.innerText);
    } else {
      sendResponse("");
    }
  }

  if (msg.type === "insert") {
    const active = document.activeElement;

    if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
      active.value = msg.text;
      active.dispatchEvent(new Event("input"));
    } else if (active && active.isContentEditable) {
      active.innerText = msg.text;
    }
  }
});
