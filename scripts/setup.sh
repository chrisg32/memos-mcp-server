#!/bin/bash

# 載入 .env 檔案中的環境變數
if [ -f ../.env ]; then
  export $(grep -v '^#' ../.env | xargs)
else
  echo "錯誤：找不到 .env 檔案"
  exit 1
fi

# 檢查必要的環境變數
if [ -z "$MEMOS_URL" ] || [ -z "$MEMOS_API_KEY" ]; then
  echo "錯誤：缺少必要的環境變數 MEMOS_URL 或 MEMOS_API_KEY"
  exit 1
fi

# 顯示設置成功訊息
echo "設置成功！使用以下設定："
echo "MEMOS_URL: $MEMOS_URL"
echo "API KEY: ${MEMOS_API_KEY:0:5}... (部分隱藏)"