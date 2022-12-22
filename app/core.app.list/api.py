import os
import zipfile
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
    fs = workspace.fs()
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
    fs = workspace.fs()
    if len(path.split("/")) > 1 and path.split("/")[0] == "app":
        fs.delete(path)
    wiz.response.status(200)

def upload(segment):
    files = wiz.request.files()
    notuploaded = []
    for i in range(len(files)):
        f = files[i]
        name = f.filename
        app_id = ".".join(os.path.splitext(name)[:-1])
        if os.path.splitext(name)[-1] != ".wizide":
            notuploaded.append(app_id)
            continue

        fs = workspace.fs("app")
        if fs.exists(app_id):
            notuploaded.append(app_id)
            continue
        fs.write.file(name, f)

        zippath = fs.abspath(name)
        unzippath = fs.abspath(app_id)
        with zipfile.ZipFile(zippath, 'r') as zip_ref:
           zip_ref.extractall(unzippath)

        fs.delete(name)

        appinfo = fs.read.json(os.path.join(app_id, "app.json"), dict())
        appinfo['id'] = app_id
        fs.write.json(os.path.join(app_id, "app.json"), appinfo)

    wiz.response.status(200, notuploaded)