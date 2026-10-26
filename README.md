# Reels 教學短影音提示詞工作室

可部署到 **GitHub Pages** 的純靜態網頁與 PWA，用於高中教學、科普解說、國際新聞等短影音的提示詞準備。

## 功能

- **100 個完整範例資料**：10 類、每類 10 則，包含標題、風格、氛圍、片長、敘事結構、開場鉤子與教學摘要。
- **範例瀏覽**：分類篩選、全文關鍵字搜尋、排序、12 筆分頁、收藏、詳情、立即套用。
- **AI 提示詞組合器**：主題、觀眾、20 種核心參數、補充指示，即時產生完整提示詞。
- **匯出功能**：複製提示詞、下載 UTF-8 TXT、匯出帶秒數的 CSV 分鏡草案。
- **七大設定**：全螢幕、音效、裝置模擬、版面方向模擬、中英 UI、字體大小、明暗色系；設定存在本機瀏覽器。
- **RWD + PWA**：手機、平板、電腦可用；首次成功載入後可離線瀏覽快取資料（瀏覽器須支援 Service Worker）。
- **無 API Key、無後端**：提示詞工具本身離線可運行，**不會自行生成 AI 影片或 MP4**。

## 專案結構

```text
reels-prompt-studio/
├── index.html                # 首頁與 UI
├── styles.css                # RWD、主題與動畫
├── app.js                    # 搜尋、收藏、設定、提示詞生成
├── data/
│   └── examples.json        # 100 則範例（可自行編輯）
├── assets/
│   ├── favicon.svg
│   ├── icon-192.png
│   └── icon-512.png
├── manifest.webmanifest      # PWA 安裝資訊
├── sw.js                     # 離線快取
└── README.md
```

## 本機啟動

不能直接雙擊 `index.html` 使用 `file://`，因為瀏覽器會限制 JSON 載入與 Service Worker。

在專案根目錄執行：

```bash
python -m http.server 8000
```

用瀏覽器開啟 `http://localhost:8000/`。

## 部署 GitHub Pages

1. 登入 GitHub，新增 repository，例如 `reels-prompt-studio`。
2. 將此 ZIP 解壓縮後，把**專案資料夾內全部內容**上傳到 repository 根目錄，首頁必須位於根目錄的 `index.html`。
3. 進入 `Settings → Pages`。
4. 在 `Build and deployment` 選擇 `Deploy from a branch`，Branch 為 `main`，Folder 為 `/ (root)`，按 `Save`。
5. 部署完成後，開啟 `https://你的帳號.github.io/reels-prompt-studio/`。
6. 使用手機瀏覽器新增至主畫面；是否顯示「安裝 App」按鈕由瀏覽器與裝置決定。

GitHub Pages 以 HTTPS 發布，適合 PWA。更換 repository 名稱時，不需更改路徑，所有資源均使用相對路徑。

## 自訂內容

- 編輯 `data/examples.json` 可以增減範例；統計數字、分類與配色會自動依資料產生（分類配色依出現順序取自 `app.js` 的 `palettes`）。
- 在 `app.js` 的 `specs` 陣列管理提示詞欄位與選項，`specGroups` 決定欄位在組合器中的分組。
- 在 `app.js` 的 `settingDefs` 修改七大設定選項。
- 調整 `styles.css` 的 `:root` 配色、字型。
- 更新靜態檔案後，**請修改 `sw.js` 內的 CACHE 版本字串**，讓已安裝 PWA 接收新快取。

## 功能界線與注意事項

- 「自動分鏡」是提示詞需求與 CSV 分鏡時間表的草案，並非自動根據 AI 腳本理解劇情；使用前需編修每鏡實際台詞。
- 裝置與直橫式設定是**畫面寬度的模擬**，不會實際更換硬體或強迫裝置旋轉。
- 「英文」切換目前翻譯主要導覽、標題等主要 UI；範例內容、部分控制項及生成提示詞仍為繁體中文，可自行擴充完整國際化字典。
- 音效為簡單的互動提示聲，不是影片背景音樂。
- 新聞選題需自行核對事件日期、消息來源與時效，不可將範例主題視為已查證的新聞事實。
- 全螢幕在部分 iOS/Safari 環境會受瀏覽器限制。
- 無外部追蹤服務；收藏和設定使用 localStorage，只存在使用裝置內。

## 授權建議

程式碼可依實際需求自行設定授權；發布前請確認加入的素材、圖片與聲音擁有合適使用權。
