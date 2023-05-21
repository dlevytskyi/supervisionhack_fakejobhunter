import http.server
import socketserver

# Set the port number to listen on
PORT = 8000

# Create a request handler class
class SimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    pass

# Create a TCP server with the specified port and request handler
with socketserver.TCPServer(("", PORT), SimpleHTTPRequestHandler) as server:
    print(f"Server running on port {PORT}. Press Ctrl+C to stop.")
    server.serve_forever()
