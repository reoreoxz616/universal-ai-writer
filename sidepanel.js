async function saveHistory(text) {
  const { history = [] } = await chrome.storage.sync.get("history");
  history.unshift({
    text,
    time: new Date().toLocaleString()
  });
  chrome.storage.sync.set({ history });
}

async function loadHistory() {
  const { history = [] } = await chrome.storage.sync.get("history");
  const container = document.getElementById("history");
  container.innerHTML = "";

  history.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div><strong>${item.time}</strong></div>
      <div>${item.text}</div>
    `;
    div.addEventListener("click", () => {
      document.getElementById("result").value = item.text;
    });
    container.appendChild(div);
  });
}

async function loadTemplates() {
  const { templates = [] } = await chrome.storage.sync.get("templates");
  const categorySelect = document.getElementById("categorySelect");
  const templateSelect = document.getElementById("templateSelect");

  const categories = [...new Set(templates.map((t) => t.category))];
  categorySelect.innerHTML = "";

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  function updateTemplates() {
    const selectedCat = categorySelect.value;
    const filtered = templates.filter((t) => t.category === selectedCat);

    templateSelect.innerHTML = "";
    filtered.forEach((tpl, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = tpl.name;
      templateSelect.appendChild(option);
    });
  }

  categorySelect.addEventListener("change", updateTemplates);
  updateTemplates();
}

async function callOpenAI(messages) {
  const { apiKey, model } = await chrome.storage.sync.get(["apiKey", "model"]);
  const usedModel = model || "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body: JSON.stringify({
      model: usedModel,
      messages
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
}

document.getElementById("generate").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;

  const { tone, templates, length } = await chrome.storage.sync.get([
    "tone",
    "templates",
    "length"
  ]);

  const category = document.getElementById("categorySelect").value;
  const index = document.getElementById("templateSelect").value;

  const filtered = (templates || []).filter((t) => t.category === category);
  const tpl = filtered[index];

  if (!tpl) {
    alert("テンプレートが選択されていません");
    return;
  }

  const finalPrompt = tpl.text
    .replace("{{tone}}", tone || "polite")
    .replace("{{length}}", length || "medium")
    .replace("{{input}}", prompt);

  const result = await callOpenAI([
    { role: "system", content: "ユーザーの指示に従って文章を生成してください。" },
    { role: "user", content: finalPrompt }
  ]);

  document.getElementById("result").value = result;
  await saveHistory(result);
  await loadHistory();
});

document.getElementById("continue").addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "getActiveText" },
      async (response) => {
        const baseText = response || "";

        const result = await callOpenAI([
          { role: "system", content: "以下の文章の続きを自然に書いてください。" },
          { role: "user", content: baseText }
        ]);

        document.getElementById("result").value = result;
        await saveHistory(result);
        await loadHistory();
      }
    );
  });
});

document.getElementById("proofread").addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "getActiveText" },
      async (response) => {
        const original = response || "";

        const result = await callOpenAI([
          {
            role: "system",
            content: "以下の文章を自然で読みやすく添削してください。"
          },
          { role: "user", content: original }
        ]);

        document.getElementById("result").value = result;
        await saveHistory(result);
        await loadHistory();
      }
    );
  });
});

document.getElementById("insert").addEventListener("click", () => {
  const text = document.getElementById("result").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "insert", text });
  });
});

loadHistory();
loadTemplates();
