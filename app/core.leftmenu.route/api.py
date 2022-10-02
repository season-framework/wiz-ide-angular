def list(segment):
    workspace = wiz.workspace('service')
    routes = workspace.route.list()
    wiz.response.status(200, routes)

def update(segment):
    path = wiz.request.query("path", True)
    code = wiz.request.query("code", True)
    
    workspace = wiz.workspace('service')
    fs = workspace.fs("src")
    fs.write(path, code)

    workspace.route.build()
    wiz.response.status(200)

def data(segment):
    path = wiz.request.query("path", "")
    workspace = wiz.workspace('service')
    fs = workspace.fs("src")
    code = fs.read(path, "")
    wiz.response.status(200, code)