#!/bin/bash
# 로컬 개발 서버 (캐시 완화)
cd "$(dirname "$0")"
echo "http://localhost:8000 에서 index.html 을 열어주세요"
echo "종료: Ctrl+C"
python3 -m http.server 8000 2>/dev/null || python -m http.server 8000
