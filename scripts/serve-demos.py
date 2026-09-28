"""Serve public/ for the audit scripts.

python's http.server is single-threaded, and a headless Chrome holds one
keep-alive connection open per origin. The next request then queues behind a
socket nobody closes, and every audit after the first hangs or is handed an
error page - which is what "page threw: Cannot read properties of null" means
here. It is not a page bug.

ThreadingHTTPServer serves each connection on its own thread, so a parked
browser connection cannot block the audit. Demos are static, so there is nothing
here that needs a single writer.
"""
import functools
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8907


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # the audit scripts are chatty enough


if __name__ == '__main__':
    handler = functools.partial(Handler, directory=os.path.abspath(ROOT))
    srv = ThreadingHTTPServer(('127.0.0.1', PORT), handler)
    srv.daemon_threads = True
    print('serving %s on http://127.0.0.1:%d' % (os.path.abspath(ROOT), PORT), flush=True)
    srv.serve_forever()
