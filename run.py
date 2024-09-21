import subprocess
from dotenv import load_dotenv
import os
import signal
import platform

load_dotenv()

def run_ngrok():
    ngrok_domain = os.getenv("NGROK_DOMAIN")
    SERVER_PORT = os.getenv("SERVER_PORT")
    if ngrok_domain is None:
        raise ValueError("NGROK_DOMAIN environment variable is not set.")
    print(f"NGROK_DOMAIN: {ngrok_domain}")
    ngrok_command = ["ngrok", "http", f"--domain={ngrok_domain}", SERVER_PORT]
    ngrok_process = subprocess.Popen(ngrok_command)
    return ngrok_process

def run_node_app():
    node_command = ["node", "app.js"]
    node_process = subprocess.Popen(node_command)
    return node_process

def terminate_process(process):
    if process.poll() is None:  # Check if the process is still running
        process.terminate()
        try:
            process.wait(timeout=2)  # Wait for the process to terminate
        except subprocess.TimeoutExpired:
            process.kill()  # Force kill if it doesn't terminate in time

if __name__ == "__main__":
    ngrok_process = run_ngrok()
    node_process = run_node_app()

    def signal_handler(sig, frame):
        print("Terminating processes...")
        terminate_process(ngrok_process)
        terminate_process(node_process)
        print("Processes terminated.")
        exit(0)

    signal.signal(signal.SIGINT, signal_handler)  # Handle Ctrl+C
    signal.signal(signal.SIGTERM, signal_handler)  # Handle termination signals

    # Windows-specific: Handle console close event
    if platform.system() == "Windows":
        signal.signal(signal.SIGBREAK, signal_handler)  # Handle Ctrl+Break

    try:
        ngrok_process.wait()
        node_process.wait()
    except KeyboardInterrupt:
        signal_handler(signal.SIGINT, None)