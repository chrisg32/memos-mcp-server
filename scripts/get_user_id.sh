#!/bin/bash

# 載入環境變數
source "$(dirname "$0")/setup.sh"

# 發送請求獲取用戶 ID
echo "正在獲取用戶 ID..."
USER_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $MEMOS_API_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  "${MEMOS_URL}/api/v1/auth/status")

echo "獲取的用戶資訊: $USER_RESPONSE"
