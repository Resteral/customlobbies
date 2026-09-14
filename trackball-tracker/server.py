import asyncio
import base64
import hashlib
import json
import os
import sys
import threading
import time
import ctypes
from ctypes import wintypes

# Win32 Mouse Hook & Input Constants
WH_MOUSE_LL = 14
WM_MOUSEMOVE = 0x0200
WM_LBUTTONDOWN = 0x0201
WM_LBUTTONUP = 0x0202
WM_RBUTTONDOWN = 0x0204
WM_RBUTTONUP = 0x0205
WM_MBUTTONDOWN = 0x0207
WM_MBUTTONUP = 0x0208
WM_MOUSEWHEEL = 0x020A
WM_XBUTTONDOWN = 0x020B
WM_XBUTTONUP = 0x020C

class POINT(ctypes.Structure):
    _fields_ = [("x", wintypes.LONG), ("y", wintypes.LONG)]

class MSLLHOOKSTRUCT(ctypes.Structure):
    _fields_ = [
        ("pt", POINT),
        ("mouseData", wintypes.DWORD),
        ("flags", wintypes.DWORD),
        ("time", wintypes.DWORD),
        ("dwExtraInfo", ctypes.POINTER(wintypes.ULONG))
    ]

# Global state
clients = set()
loop = None
last_x = None
last_y = None

def broadcast_event(data):
    if loop and clients:
        msg = json.dumps(data)
        try:
            asyncio.run_coroutine_threadsafe(broadcast_to_clients(msg), loop)
        except Exception:
            pass

async def broadcast_to_clients(msg):
    to_remove = set()
    for ws in list(clients):
        try:
            await ws.send_text(msg)
        except Exception:
            to_remove.add(ws)
    for ws in to_remove:
        clients.discard(ws)

# Win32 Mouse Hook Thread
HOOKPROC = ctypes.WINFUNCTYPE(ctypes.c_long, ctypes.c_int, wintypes.WPARAM, wintypes.LPARAM)

def low_level_mouse_handler(nCode, wParam, lParam):
    global last_x, last_y
    if nCode >= 0:
        info = ctypes.cast(lParam, ctypes.POINTER(MSLLHOOKSTRUCT)).contents
        curr_x, curr_y = info.pt.x, info.pt.y

        if wParam == WM_MOUSEMOVE:
            if last_x is not None and last_y is not None:
                dx = curr_x - last_x
                dy = curr_y - last_y
                if dx != 0 or dy != 0:
                    broadcast_event({"type": "motion", "dx": dx, "dy": dy, "x": curr_x, "y": curr_y})
            last_x = curr_x
            last_y = curr_y

        elif wParam == WM_LBUTTONDOWN:
            broadcast_event({"type": "button", "button": "left", "state": "down"})
        elif wParam == WM_LBUTTONUP:
            broadcast_event({"type": "button", "button": "left", "state": "up"})

        elif wParam == WM_RBUTTONDOWN:
            broadcast_event({"type": "button", "button": "right", "state": "down"})
        elif wParam == WM_RBUTTONUP:
            broadcast_event({"type": "button", "button": "right", "state": "up"})

        elif wParam == WM_MBUTTONDOWN:
            broadcast_event({"type": "button", "button": "middle", "state": "down"})
        elif wParam == WM_MBUTTONUP:
            broadcast_event({"type": "button", "button": "middle", "state": "up"})

        elif wParam == WM_XBUTTONDOWN:
            xbutton = (info.mouseData >> 16) & 0xFFFF
            btn = "back" if xbutton == 1 else "forward"
            broadcast_event({"type": "button", "button": btn, "state": "down"})
        elif wParam == WM_XBUTTONUP:
            xbutton = (info.mouseData >> 16) & 0xFFFF
            btn = "back" if xbutton == 1 else "forward"
            broadcast_event({"type": "button", "button": btn, "state": "up"})

        elif wParam == WM_MOUSEWHEEL:
            wheel_delta = ctypes.c_short((info.mouseData >> 16) & 0xFFFF).value
            broadcast_event({"type": "wheel", "delta": wheel_delta})

    return ctypes.windll.user32.CallNextHookEx(None, nCode, wParam, lParam)

hook_proc_ref = HOOKPROC(low_level_mouse_handler)

def run_mouse_tracker():
    # Run High-Precision Cursor & Button Polling Engine (200 Hz)
    global last_x, last_y
    user32 = ctypes.windll.user32
    pt = POINT()
    btn_states = {
        'left': 0x01,
        'right': 0x02,
        'middle': 0x04,
        'back': 0x05,
        'forward': 0x06
    }
    prev_states = {k: False for k in btn_states}

    print("[+] High-Precision Win32 Input Tracker active (200 Hz).")
    while True:
        try:
            # Motion Delta
            if user32.GetCursorPos(ctypes.byref(pt)):
                if last_x is not None and last_y is not None:
                    dx = pt.x - last_x
                    dy = pt.y - last_y
                    if dx != 0 or dy != 0:
                        broadcast_event({"type": "motion", "dx": dx, "dy": dy, "x": pt.x, "y": pt.y})
                last_x = pt.x
                last_y = pt.y

            # Button Press Polling (VK codes)
            for btn_name, vk in btn_states.items():
                is_down = (user32.GetAsyncKeyState(vk) & 0x8000) != 0
                if is_down != prev_states[btn_name]:
                    prev_states[btn_name] = is_down
                    broadcast_event({"type": "button", "button": btn_name, "state": "down" if is_down else "up"})

            time.sleep(0.005) # 200 Hz polling frequency
        except Exception:
            time.sleep(0.01)

# Lightweight WebSocket Server Implementation using standard asyncio
class MinimalWebSocket:
    def __init__(self, reader, writer):
        self.reader = reader
        self.writer = writer

    async def handshake(self):
        try:
            req = await self.reader.read(4096)
            if not req:
                return False
            headers = {}
            lines = req.decode('utf-8', errors='ignore').split('\r\n')
            path = lines[0].split(' ')[1] if len(lines[0].split(' ')) > 1 else '/'
            
            # Serve static files for HTTP requests
            if 'Upgrade: websocket' not in req.decode('utf-8', errors='ignore'):
                await self.serve_static(path)
                return False

            for line in lines[1:]:
                if ': ' in line:
                    k, v = line.split(': ', 1)
                    headers[k.lower()] = v

            key = headers.get('sec-websocket-key')
            if not key:
                return False

            GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
            accept_key = base64.b64encode(hashlib.sha1((key + GUID).encode()).digest()).decode()

            response = (
                "HTTP/1.1 101 Switching Protocols\r\n"
                "Upgrade: websocket\r\n"
                "Connection: Upgrade\r\n"
                f"Sec-WebSocket-Accept: {accept_key}\r\n\r\n"
            )
            self.writer.write(response.encode())
            await self.writer.drain()
            return True
        except Exception:
            return False

    async def serve_static(self, path):
        if path == '/' or path == '':
            path = '/index.html'
        clean_path = path.split('?')[0].lstrip('/')
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, clean_path)

        if os.path.exists(file_path) and os.path.isfile(file_path):
            content_type = "text/html"
            if file_path.endswith('.css'):
                content_type = "text/css"
            elif file_path.endswith('.js'):
                content_type = "application/javascript"
            elif file_path.endswith('.png'):
                content_type = "image/png"
            elif file_path.endswith('.svg'):
                content_type = "image/svg+xml"

            with open(file_path, 'rb') as f:
                body = f.read()

            header = (
                f"HTTP/1.1 200 OK\r\n"
                f"Content-Type: {content_type}\r\n"
                f"Content-Length: {len(body)}\r\n"
                f"Access-Control-Allow-Origin: *\r\n\r\n"
            )
            self.writer.write(header.encode() + body)
            await self.writer.drain()
        else:
            self.writer.write(b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n")
            await self.writer.drain()
        self.writer.close()

    async def send_text(self, text):
        data = text.encode('utf-8')
        length = len(data)
        frame = bytearray()
        frame.append(0x81)  # Text frame, FIN bit set
        if length <= 125:
            frame.append(length)
        elif length <= 65535:
            frame.append(126)
            frame.extend(length.to_bytes(2, byteorder='big'))
        else:
            frame.append(127)
            frame.extend(length.to_bytes(8, byteorder='big'))
        frame.extend(data)
        self.writer.write(frame)
        await self.writer.drain()

async def handle_connection(reader, writer):
    ws = MinimalWebSocket(reader, writer)
    if await ws.handshake():
        clients.add(ws)
        print(f"[+] Client connected. Total clients: {len(clients)}")
        try:
            while True:
                data = await reader.read(1024)
                if not data:
                    break
        except Exception:
            pass
        finally:
            clients.discard(ws)
            print(f"[-] Client disconnected. Total clients: {len(clients)}")

async def start_server():
    global loop
    loop = asyncio.get_running_loop()
    
    ports_to_try = [8765, 8766, 8767, 8768]
    server = None
    active_port = 8765

    for port in ports_to_try:
        try:
            server = await asyncio.start_server(handle_connection, '0.0.0.0', port)
            active_port = port
            break
        except OSError:
            print(f"[!] Port {port} in use, trying next port...")

    if not server:
        print("[!] ERROR: Could not bind to any port in range 8765-8768.")
        sys.exit(1)

    # Write active port to port.txt for dynamic client connection
    base_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(base_dir, "port.txt"), "w") as f:
        f.write(str(active_port))

    print("\n=======================================================")
    print("  LOGITECH TRACKBALL DIRECTION TRACKER SERVER READY!")
    print("=======================================================")
    print(f"  -> Local Host URL      : http://127.0.0.1:{active_port}")
    print(f"  -> Stream Overlay URL  : http://127.0.0.1:{active_port}/overlay.html")
    print(f"  -> WebSocket Endpoint  : ws://127.0.0.1:{active_port}")
    print("=======================================================\n")
    
    async with server:
        await server.serve_forever()

def main():
    hook_thread = threading.Thread(target=run_mouse_tracker, daemon=True)
    hook_thread.start()
    try:
        asyncio.run(start_server())
    except KeyboardInterrupt:
        print("\n[*] Server stopped by user.")

if __name__ == '__main__':
    main()
