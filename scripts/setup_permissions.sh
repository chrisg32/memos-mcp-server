#!/bin/bash

# 設置所有腳本的執行權限
echo "設置腳本執行權限..."
chmod +x "$(dirname "$0")/setup.sh"
chmod +x "$(dirname "$0")/get_user_id.sh"
chmod +x "$(dirname "$0")/search_memo.sh"
chmod +x "$(dirname "$0")/create_memo.sh"
chmod +x "$(dirname "$0")/get_memo.sh"
chmod +x "$(dirname "$0")/list_memo_tags.sh"
chmod +x "$(dirname "$0")/setup_permissions.sh"

echo "所有腳本已設置執行權限！"
echo ""
echo "可用腳本："
echo "1. ./get_user_id.sh - 獲取用戶 ID"
echo "2. ./search_memo.sh <關鍵字> - 搜尋備忘錄"
echo "3. ./create_memo.sh <內容> [標籤] [可見性] - 創建備忘錄"
echo "4. ./get_memo.sh <備忘錄ID> - 獲取特定備忘錄"
echo "5. ./list_memo_tags.sh [parent] [可見性] - 列出備忘錄標籤"