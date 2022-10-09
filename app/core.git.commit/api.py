import git
import os

workspace = wiz.workspace("service")
cwd = workspace.fs().abspath()
repo = git.Repo.init(cwd)

def reset():
    gitfile = wiz.request.query("file", None)
    try:
        if gitfile is None or len(gitfile) == 0:
            repo.git.reset()
        else:
            repo.git.reset(gitfile)
    except:
        pass
    wiz.response.status(200)

def add():
    gitfile = wiz.request.query("file", None)
    try:
        if gitfile is None or len(gitfile) == 0:
            repo.git.add(update=True)
        else:
            repo.git.add(gitfile, update=True)
    except:
        pass
    wiz.response.status(200)

def changes():
    res = dict(staged=[], unstaged=[])
    unstaged = repo.index.diff(None)
    staged = repo.index.diff("HEAD")
    
    for diff in staged:
        obj = {"change_type": diff.change_type, "path": diff.b_path}        
        path = obj['path']
        res['staged'].append(obj)

    for diff in unstaged:
        obj = {"change_type": diff.change_type, "path": diff.b_path}        
        path = obj['path']
        res['unstaged'].append(obj)

    wiz.response.status(200, res)

def commit():
    try:
        message = wiz.request.query("message", "commit")
        repo.index.commit(message)
    except Exception as e:
        wiz.response.status(500, str(e))
    wiz.response.status(200)