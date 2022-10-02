def list(segment):
    mode = wiz.request.query("mode", True)
    workspace = wiz.workspace('service')
    apps = workspace.app.list()

    res = []
    for app in apps:
        if app['mode'] == mode:
            res.append(app)

    wiz.response.status(200, res)

def update(segment):
    path = wiz.request.query("path", True)
    code = wiz.request.query("code", True)
    
    workspace = wiz.workspace('service')
    fs = workspace.fs("src")
    fs.write(path, code)
    
    workspace.build(path)
    wiz.response.status(200)

def data(segment):
    path = wiz.request.query("path", "")
    workspace = wiz.workspace('service')
    fs = workspace.fs("src")
    code = fs.read(path, "")
    wiz.response.status(200, code)