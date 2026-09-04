import os
import sys
import subprocess
import time

def main():
    print("=" * 60)
    print("🚀 PAYNODE: MCP Gateway for Agentic Commerce")
    print("=" * 60)
    print("\n[1/3] Checking database seed...")
    try:
        subprocess.run([sys.executable, "database/seed_data.py"], check=True)
    except Exception as e:
        print(f"Seed note: {e}")

    print("\n[2/3] Starting FastMCP & REST Bridge Server on port 8008...")
    bridge_proc = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "mcp_server.api_bridge:app",
        "--host", "0.0.0.0", "--port", "8008", "--reload"
    ])

    print("\n[3/3] PayNode is live!")
    print("  • REST Bridge API: http://localhost:8008")
    print("  • API Docs (Swagger): http://localhost:8008/docs")
    print("  • Frontend: Run 'cd frontend && npm run dev' to access the UI at http://localhost:5173")
    print("\nPress Ctrl+C to stop.\n")

    try:
        bridge_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping PayNode server...")
        bridge_proc.terminate()

if __name__ == "__main__":
    main()
