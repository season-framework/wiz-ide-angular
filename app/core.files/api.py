import os

workspace = wiz.workspace("service")
fs = workspace.fs()

def list(segment):
    path = wiz.request.query("path", True)
    if fs.isdir(path):
        files = fs.files(path)
        res = []
        for name in files:
            fpath = os.path.join(path, name)
            ftype = 'file' if fs.isfile(fpath) else 'folder'
            res.append(dict(name=name, path=fpath, type=ftype))
        wiz.response.status(200, res)    
    wiz.response.status(404, [])

def create():
    path = wiz.request.query("path", True)
    _type = wiz.request.query("type", True)

    if fs.exists(path):
        wiz.response.status(401, False)
    
    try:
        if _type == 'folder':
            fs.makedirs(path)
        else:
            fs.write(path, "")
    except:
        wiz.response.status(500, False)

    wiz.response.status(200, True)

def delete():
    path = wiz.request.query("path", True)
    if len(path) == 0:
        wiz.response.status(401, False)
    if fs.exists(path):
        fs.delete(path)
    wiz.response.status(200, True)

def move():
    path = wiz.request.query("path", True)
    to = wiz.request.query("to", True)
    if len(path) == 0 or len(to) == 0:
        wiz.response.status(401, False)
    print(path, to)
    if fs.exists(path) == False:
        wiz.response.status(401, False)
    if fs.exists(to):
        wiz.response.status(401, False)
    fs.move(path, to)
    wiz.response.status(200, True)