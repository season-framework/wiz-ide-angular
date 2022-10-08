import os
import zipfile
import tempfile
import time
import shutil
import datetime
import json

workspace = wiz.workspace("service")
working_dir = wiz.server.path.branch
fs = workspace.fs(os.path.join(working_dir))

def list():
    projects = wiz.branch.list()
    res = []
    for project in projects:
        info = fs.read.json(os.path.join(project, "wiz.project"), dict())
        info['id'] = project
        res.append(info)
    wiz.response.status(200, res)

def download(segment):
    path = segment.path
    path = fs.abspath(path)
    
    filename = os.path.splitext(os.path.basename(path))[0] + ".zip"
    zippath = os.path.join(tempfile.gettempdir(), 'wiz', datetime.datetime.now().strftime("%Y%m%d"), str(int(time.time())), filename)
    if len(zippath) < 10: 
        wiz.response.abort(404)
    try:
        shutil.remove(zippath)
    except Exception as e:
        pass
    os.makedirs(os.path.dirname(zippath))
    zipdata = zipfile.ZipFile(zippath, 'w')

    src = os.path.join(path, "src")
    config = os.path.join(path, "config")

    for folder, subfolders, files in os.walk(path):
        if folder.startswith(src) == False and folder.startswith(config) == False: 
            continue
        for file in files:
            zipdata.write(os.path.join(folder, file), os.path.relpath(os.path.join(folder,file), path), compress_type=zipfile.ZIP_DEFLATED)

    zipdata.close()
    wiz.response.download(zippath, as_attachment=True, filename=filename)

def ng_download(segment):
    path = segment.path
    path = fs.abspath(os.path.join(path, "build"))
    
    filename = os.path.splitext(os.path.basename(path))[0] + ".zip"
    zippath = os.path.join(tempfile.gettempdir(), 'wiz', datetime.datetime.now().strftime("%Y%m%d"), str(int(time.time())), filename)
    if len(zippath) < 10: 
        wiz.response.abort(404)
    try:
        shutil.remove(zippath)
    except Exception as e:
        pass
    os.makedirs(os.path.dirname(zippath))
    zipdata = zipfile.ZipFile(zippath, 'w')

    ignores = ["dist", "node_modules", ".vscode"]
    for folder, subfolders, files in os.walk(path):
        isignore = False
        for ign in ignores:
            if folder.startswith(os.path.join(path, ign)):
                isignore = True
        if isignore: continue
        for file in files:
            zipdata.write(os.path.join(folder, file), os.path.relpath(os.path.join(folder,file), path), compress_type=zipfile.ZIP_DEFLATED)

    zipdata.close()
    wiz.response.download(zippath, as_attachment=True, filename=filename)