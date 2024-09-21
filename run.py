import subprocess
import time

# Function to start Node.js server
def start_node_server():
    print("Starting Node.js server...")
    node_process = subprocess.Popen(["node", "app.js"])
    return node_process

# Function to start Ngrok with a custom domain
def start_ngrok():
    print("Starting ngrok with custom domain...")
    ngrok_command = [
        "ngrok", "http", 
        "--domain=dogfish-wired-sailfish.ngrok-free.app", "5050"
    ]
    
    ngrok_process = subprocess.Popen(ngrok_command)
    
    print("Ngrok started with custom domain: dogfish-wired-sailfish.ngrok-free.app")
    return ngrok_process

# Main function
if __name__ == "__main__":
    try:
        # Start the Node.js server
        node_server = start_node_server()
        time.sleep(2)  # Allow some time for the Node.js server to start

        # Start Ngrok with the custom domain
        ngrok_process = start_ngrok()

        # Keep the script running until interrupted
        print("Press Ctrl+C to stop the server and Ngrok...")
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nShutting down...")

    finally:
        # Terminate both processes when the script ends
        print("Terminating Node.js server and Ngrok process...")
        node_server.terminate()
        ngrok_process.terminate()
        print("Processes terminated.")