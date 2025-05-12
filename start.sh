#file: start.sh
#!/usr/bin/env bash

set -euo pipefail

OS="$(uname -s || echo Unknown)"
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

launch_backend() {
  echo "🚀 Starting Nuvai backend..."
  cd "$PROJECT_ROOT/backend"

  SSL_CERT="ssl/localhost+1.pem"
  SSL_KEY="ssl/localhost+1-key.pem"

  if [ ! -f "$SSL_CERT" ] || [ ! -f "$SSL_KEY" ]; then
    echo "❌ SSL certificates not found:"
    echo "   $SSL_CERT"
    echo "   $SSL_KEY"
    echo "💡 Run: mkcert localhost 192.168.1.89"
    exit 1
  fi

  if ! command -v python3 &>/dev/null && ! command -v py &>/dev/null; then
    echo "❌ Python3 not found. Please install it and try again."
    exit 1
  fi

  if command -v python3 &>/dev/null; then
    python3 server.py &
  else
    py server.py &
  fi

  BACKEND_PID=$!
}

launch_frontend() {
  echo "🌐 Starting Nuvai frontend..."
  cd "$PROJECT_ROOT/frontend"
  if ! command -v npm &>/dev/null; then
    echo "❌ npm not found. Please install Node.js and npm."
    exit 1
  fi
  npm start &
  FRONTEND_PID=$!
}

open_browser() {
  echo "🌍 Opening Nuvai UI in browser..."
  local url="https://localhost:3000"

  case "$OS" in
    Darwin) open "$url" ;;
    Linux) xdg-open "$url" &>/dev/null || echo "🌐 Please open $url manually." ;;
    MINGW*|CYGWIN*|MSYS*)
      cmd.exe /C start "$url" 2>/dev/null || powershell.exe start "$url" 2>/dev/null || echo "🌐 Please open $url manually." ;;
    Unknown)
      if command -v powershell.exe &>/dev/null; then
        powershell.exe start "$url"
      elif command -v cmd.exe &>/dev/null; then
        cmd.exe /C start "$url"
      else
        echo "🌐 Please open $url manually."
      fi
      ;;
    *) echo "🌐 Please open $url manually." ;;
  esac
}

trap 'echo "🛑 Shutting down..."; kill ${BACKEND_PID:-0} ${FRONTEND_PID:-0} 2>/dev/null || true' EXIT

launch_backend
launch_frontend
sleep 2
open_browser

wait
