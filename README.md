# Universal AI Writer

Universal AI Writer は、どんな Web サイトの入力欄でも AI による文章生成・添削ができる Chrome 拡張です。  
サイドバーからすぐに文章を生成でき、テンプレート管理や履歴保存など、実用的な機能を多数搭載しています。

---
## ✨ 主な機能

- 📝 **AI 文章生成**  
  指定したテンプレートとプロンプトから文章を生成。

- ➕ **続きの文章を自動生成**  
  入力欄の内容を読み取り、自然な続きを生成。

- 🔧 **文章の添削モード**  
  読みやすく自然な文章に自動で書き換え。

- 📚 **テンプレート管理（カテゴリ対応）**  
  自分の用途に合わせてテンプレートを追加・分類。

- 🎛 **AI モデル選択**  
  GPT-4o / GPT-4.1 / mini 系モデルに対応。

- 🕒 **履歴保存**  
  生成した文章を自動保存し、ワンクリックで再利用。

- 🖥 **ChromeOS 対応**  
  Chromebook でも問題なく動作。
---

## 📥 インストール方法

1. このリポジトリの右側にある **Releases** を開く  
2. 最新版の ZIP（`universal-ai-writer.zip`）をダウンロード  
3. ZIP を解凍  
4. Chrome で `chrome://extensions/` を開く  
5. 右上の **デベロッパーモード** を ON  
6. 「パッケージ化されていない拡張機能を読み込む」をクリック  
7. 解凍したフォルダを選択

---
## 🛠 使い方

- ブラウザ右上の拡張アイコンをクリックするとサイドバーが開きます  
- 設定画面で API キー・テンプレート・モデルを設定  
- 入力欄をクリックしてから「挿入」ボタンを押すと文章が自動入力されます  
- 履歴から過去の生成文を再利用できます
---

## 📸 スクリーンショット

（ここに画像を追加できます）

例：

screenshots/
├── sidebar.png
├── options.png
└── generate.png

コード

---

## 📦 フォルダ構成

universal-ai-writer/
├── manifest.json
├── background.js
├── content.js
├── sidepanel.html
├── sidepanel.js
├── options.html
├── options.js
└── icons/
├── 16.png
├── 48.png
└── 128.png
---
## 🔑 必要なもの

- OpenAI API Key  
- Chrome ブラウザ（または ChromeOS）
---

## 📄 ライセンス
MIT License
---

## 🧑‍💻 作者
Created by **今村怜生（reoreoxz616）**
