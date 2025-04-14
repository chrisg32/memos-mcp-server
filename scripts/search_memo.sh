#!/bin/bash

# 載入環境變數
source "$(dirname "$0")/setup.sh"

# 檢查是否提供搜尋關鍵字
if [ -z "$1" ]; then
  echo "使用方法: $0 <關鍵字>"
  exit 1
fi

# 獲取用戶 ID
echo "正在獲取用戶 ID..."
USER_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $MEMOS_API_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  "${MEMOS_URL}/api/v1/auth/status")

USER_ID=$(echo $USER_RESPONSE | grep -o '"name":"[^"]*"' | cut -d':' -f2 | tr -d '"')

if [ -z "$USER_ID" ]; then
  echo "錯誤：無法獲取用戶 ID"
  echo "回應內容：$USER_RESPONSE"
  exit 1
fi

# 搜尋備忘錄
echo "正在搜尋包含「$1」的備忘錄..."
SEARCH_RESPONSE=$(curl -s -X GET \
  -H "Authorization: Bearer $MEMOS_API_KEY" \
  -H "Accept: application/json" \
  "${MEMOS_URL}/api/v1/${USER_ID}/memos?filter=content.contains(\"$1\")")

# 解析並顯示結果
echo "查詢回應:"
echo "$SEARCH_RESPONSE"