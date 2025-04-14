#!/bin/bash

# 載入環境變數
source "$(dirname "$0")/setup.sh"

# 檢查是否提供備忘錄 ID
if [ -z "$1" ]; then
  echo "使用方法: $0 <備忘錄ID>"
  echo "備忘錄ID 格式：數字 或 memos/數字"
  exit 1
fi

# 格式化 ID
if [[ "$1" =~ ^[0-9]+$ ]]; then
  MEMO_ID="memos/$1"
elif [[ "$1" =~ ^memos/[0-9]+$ ]]; then
  MEMO_ID="$1"
else
  echo "錯誤：無效的備忘錄 ID 格式"
  exit 1
fi

# 發送請求獲取備忘錄
echo "正在獲取備忘錄 $MEMO_ID..."
RESPONSE=$(curl -s -X GET \
  -H "Authorization: Bearer $MEMOS_API_KEY" \
  -H "Accept: application/json" \
  "${MEMOS_URL}/api/v1/${MEMO_ID}")

# 解析回應
CONTENT=$(echo $RESPONSE | grep -o '"content":"[^"]*"' | cut -d':' -f2 | tr -d '"')

if [ -n "$CONTENT" ]; then
  echo "備忘錄內容:"
  echo "$CONTENT"
else
  echo "錯誤：無法獲取備忘錄或備忘錄不存在"
  echo "回應內容：$RESPONSE"
  exit 1
fi