function renderTemplates(templates) {
  const container = document.getElementById("templateList");
  container.innerHTML = "";

  const categories = {};

  templates.forEach((tpl) => {
    if (!categories[tpl.category]) categories[tpl.category] = [];
    categories[tpl.category].push(tpl);
  });

  Object.keys(categories).forEach((cat) => {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${cat}</h4>`;

    categories[cat].forEach((tpl) => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${tpl.name}</strong><br>${tpl.text}`;

      const del = document.createElement("button");
      del.textContent = "削除";
      del.style.marginTop = "4px";

      del.addEventListener("click", () => {
        const newList = templates.filter((t) => t !== tpl);
        chrome.storage.sync.set({ templates: newList });
        renderTemplates(newList);
      });

      div.appendChild(document.createElement("br"));
      div.appendChild(del);
      section.appendChild(div);
    });

    container.appendChild(section);
  });
}

chrome.storage.sync.get(
  ["apiKey", "model", "tone", "length", "templates"],
  (data) => {
    if (data.apiKey) document.getElementById("apiKey").value = data.apiKey;
    if (data.model) document.getElementById("model").value = data.model;
    if (data.tone) document.getElementById("tone").value = data.tone;
    if (data.length) document.getElementById("length").value = data.length;
    renderTemplates(data.templates || []);
  }
);

document.getElementById("save").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKey").value;
  const model = document.getElementById("model").value;
  const tone = document.getElementById("tone").value;
  const length = document.getElementById("length").value;

  chrome.storage.sync.set({ apiKey, model, tone, length }, () => {
    alert("設定を保存しました");
  });
});

document.getElementById("addTemplate").addEventListener("click", () => {
  const category = document.getElementById("templateCategory").value;
  const name = document.getElementById("templateName").value;
  const text = document.getElementById("templateText").value;

  if (!category || !name || !text) {
    alert("カテゴリ・名前・内容をすべて入力してください");
    return;
  }

  chrome.storage.sync.get(["templates"], (data) => {
    const templates = data.templates || [];
    templates.push({ category, name, text });
    chrome.storage.sync.set({ templates }, () => {
      renderTemplates(templates);
      document.getElementById("templateCategory").value = "";
      document.getElementById("templateName").value = "";
      document.getElementById("templateText").value = "";
    });
  });
});
