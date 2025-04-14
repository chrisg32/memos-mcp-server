#!/bin/bash

# 載入環境變數
source "$(dirname "$0")/setup.sh"

# 檢查是否提供備忘錄內容
if [ -z "$1" ]; then
  echo "使用方法: $0 <備忘錄內容> [標籤] [可見性]"
  echo "可見性選項: PUBLIC, PROTECTED, PRIVATE (預設: PRIVATE)"
  exit 1
fi

# 設定參數
CONTENT="$1"
TAGS="${2:-}"  # 如果未提供則為空
VISIBILITY="${3:-PRIVATE}"  # 預設為 PRIVATE

# 格式化內容（包含標籤）
if [ -n "$TAGS" ]; then
  FORMATTED_CONTENT="${CONTENT}\n\n${TAGS}"
else
  FORMATTED_CONTENT="${CONTENT}"
fi

# 準備請求 payload
PAYLOAD="{\"content\":\"${FORMATTED_CONTENT}\",\"visibility\":\"${VISIBILITY}\"}"

# 發送請求建立備忘錄
echo "正在創建備忘錄..."
RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $MEMOS_API_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d "${PAYLOAD}" \
  "${MEMOS_URL}/api/v1/memos")

# 檢查回應
MEMO_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -n "$MEMO_ID" ]; then
  echo "備忘錄創建成功！ID: $MEMO_ID"
else
  echo "錯誤：無法創建備忘錄"
  echo "回應內容：$RESPONSE"
  exit 1
fi