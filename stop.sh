#file: stop.sh
#!/usr/bin/env bash

###############################################################################
# 🛑 Nuvai – Stop Script
#
# Secure shutdown script for Linux, macOS, and Windows (WSL / Git Bash / PowerShell).
#
# Standards:
# - OWASP ASVS: Safe termination of processes
# - NIST 800-53: Audit-ready service control
# - ISO/IEC 27001: Process lifecycle integrity
###############################################################################

set -euo pipefail

# Define process names or PID files
BACKEND_PROCESS="server.py"
FRONTEND_PROCESS="npm"

stop_process() {
  local name="$1"
  local filter="$2"

  echo "🔍 Searching for process: $name ($filter)"

  PIDS=$(pgrep -f "$filter" || true)

  if [ -z "$PIDS" ]; then
    echo "✅ No active process found for $name."
  else
    echo "🛑 Stopping $name..."
    echo "$PIDS" | xargs kill -9
    echo "✅ $name stopped."
  fi
}

# Stop backend (Flask)
stop_process "Backend (Flask)" "$BACKEND_PROCESS"

# Stop frontend (React)
stop_process "Frontend (npm start)" "react-scripts start"

# Optional: add a short delay
sleep 1

echo "✔️ All known Nuvai processes have been stopped."
