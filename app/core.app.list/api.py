import os
workspace = wiz.workspace('ide')

def list(segment):
    apps = workspace.app.list()
    res = []
    for app in apps:
        res.append(app)
    wiz.response.status(200, res)

def exists(segment):
    path = wiz.request.query("id", True)
    fs = workspace.fs("app")
    wiz.response.status(200, fs.exists(path))

def update(segment):
    path = wiz.request.query("path", "")[4:]
    code = wiz.request.query("code", True)
    fs = workspace.fs("src")
    fs.write(path, code)
    wiz.server.socket.bind()
    wiz.response.status(200)

def build(segment):
    path = wiz.request.query("path", "")[4:]
    entire = wiz.request.query("entire", False)
    if entire: workspace.build()
    else: workspace.build(path)
    wiz.response.status(200)

def data(segment):
    path = wiz.request.query("path", "")[4:]
    fs = workspace.fs()
    code = fs.read(path, "")
    wiz.response.status(200, code)

def remove(segment):
    path = wiz.request.query("path", "")[4:]
    fs = workspace.fs("src")
    if len(path.split("/")) > 1 and path.split("/")[0] == "app":
        fs.delete(path)
    wiz.response.status(200)