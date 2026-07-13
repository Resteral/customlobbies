import sys
import os
import queue
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

# Try to import unreal engine module.
# If run outside of unreal, it prints a message but lets the server run for testing.
try:
    import unreal
    IN_UNREAL = True
except ImportError:
    IN_UNREAL = False
    print("Warning: Running outside Unreal Engine. Execution commands will be printed to stdout instead of run.")

# Thread-safe queue to pass python code from the server thread to the Unreal main tick thread
command_queue = queue.Queue()
logs_history = []

class UnrealBridgeHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        # Enable CORS for web UI access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path == '/status':
            self._set_headers(200)
            response = {
                "status": "connected",
                "engine": "Unreal Engine 5" if IN_UNREAL else "Standalone Mock",
                "queue_size": command_queue.qsize(),
                "history_count": len(logs_history)
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
        elif self.path == '/logs':
            self._set_headers(200)
            self.wfile.write(json.dumps({"logs": logs_history[-50:]}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode('utf-8'))

    def do_POST(self):
        if self.path == '/execute':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            try:
                data = json.loads(post_data)
                code = data.get("code", "")
                prompt = data.get("prompt", "Manual execution")
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": f"Invalid JSON: {e}"}).encode('utf-8'))
                return

            if not code.strip():
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Empty code payload"}).encode('utf-8'))
                return

            # Push the code into the queue for execution on the main Slate tick thread
            command_queue.put((prompt, code))
            logs_history.append(f"Queued command for: '{prompt}'")
            
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "queued",
                "message": "Command successfully queued for UE5 main-thread execution"
            }).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode('utf-8'))

def run_server(port=6000):
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, UnrealBridgeHandler)
    print(f"AetherForge UE5 Bridge Server running on http://127.0.0.1:{port}")
    if IN_UNREAL:
        unreal.log(f"AetherForge UE5 Bridge Server listening on port {port}")
    httpd.serve_forever()

# Main tick execution logic
def execute_queued_commands(delta_time):
    while not command_queue.empty():
        prompt, code = command_queue.get()
        msg = f"[AetherForge] Executing: '{prompt}'"
        print(msg)
        logs_history.append(msg)
        
        if IN_UNREAL:
            try:
                # Execute in the global/local context of Unreal Engine Python
                # Using exec runs it inside this module context
                exec(code, globals())
                unreal.log(f"AetherForge Success: Executed {prompt}")
                logs_history.append(f"Success: {prompt} executed successfully.")
            except Exception as e:
                unreal.log_error(f"AetherForge Error executing code: {e}")
                logs_history.append(f"Error: {e}")
        else:
            # Standalone debug execution
            try:
                print("--- START CODE EXECUTION ---")
                print(code)
                print("--- END CODE EXECUTION ---")
                logs_history.append(f"Mock Success: Printed code for '{prompt}' to terminal.")
            except Exception as e:
                print(f"Mock Error: {e}")
                logs_history.append(f"Mock Error: {e}")

# Register tick callback inside Unreal Engine
tick_handle = None
if IN_UNREAL:
    # Slate tick callback executes code on the main editor thread
    tick_handle = unreal.register_slate_post_tick_callback(execute_queued_commands)
    # Start the HTTP server in a separate background daemon thread
    server_thread = threading.Thread(target=run_server, args=(6000,))
    server_thread.daemon = True
    server_thread.start()
else:
    # Running standalone for testing
    if __name__ == '__main__':
        # Start command executor thread to simulate Unreal tick
        def simulate_tick():
            import time
            while True:
                execute_queued_commands(0.016)
                time.sleep(0.016)
        
        tick_thread = threading.Thread(target=simulate_tick)
        tick_thread.daemon = True
        tick_thread.start()
        
        try:
            run_server(6000)
        except KeyboardInterrupt:
            print("\nShutting down bridge server.")
