import os
workspace = wiz.workspace('service')

def list(segment):
    mode = wiz.request.query("mode", True)
    apps = workspace.app.list()
    res = []
    for app in apps:
        if app['mode'] == mode:
            res.append(app)
    wiz.response.status(200, res)

def exists(segment):
    path = wiz.request.query("id", True)
    fs = workspace.fs(os.path.join("src", "app"))
    wiz.response.status(200, fs.exists(path))

def update(segment):
    path = wiz.request.query("path", True)
    code = wiz.request.query("code", True)
    fs = workspace.fs("src")
    fs.write(path, code)
    wiz.response.status(200)

def build(segment):
    path = wiz.request.query("path", True)
    entire = wiz.request.query("entire", False)
    if entire: workspace.build()
    else: workspace.build(path)
    wiz.response.status(200)

def data(segment):
    path = wiz.request.query("path", "")
    fs = workspace.fs("src")
    code = fs.read(path, "")
    wiz.response.status(200, code)

def move(segment):
    _from = wiz.request.query("from", True)
    _to = wiz.request.query("to", True)
    fs = workspace.fs(os.path.join("src", "app"))
    if fs.exists(_to):
        wiz.response.status(400)
    if fs.exists(_from) == False:
        wiz.response.status(400)
    fs.move(_from, _to)
    wiz.response.status(200)

def remove(segment):
    path = wiz.request.query("path", True)
    fs = workspace.fs("src")
    if len(path.split("/")) > 1 and path.split("/")[0] == "app":
        fs.delete(path)
    wiz.response.status(200)