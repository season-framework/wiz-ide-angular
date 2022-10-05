import os
fs = wiz.workspace().fs("..", "config")

def load():
    path = wiz.request.query("path", True)
    wiz.response.status(200, fs.read(path, ""))
