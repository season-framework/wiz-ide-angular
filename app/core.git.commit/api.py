import git
import os

workspace = wiz.workspace("service")

def changes():
    cwd = workspace.fs().abspath()
    repo = git.Repo.init(cwd)
    
    repo.git.add('--all')
    src = "index"
    parent = repo.commit()
    diffs = parent.diff(None)
    
    res = []
    for diff in diffs:
        obj = {"change_type": diff.change_type, "path": diff.b_path, "commit": src, "parent": str(parent)}        
        path = obj['path']
        res.append(obj)
    wiz.response.status(200, res)

def commit():
    try:
        cwd = workspace.fs().abspath()
        print(cwd)
        repo = git.Repo.init(cwd)
        message = wiz.request.query("message", "commit")
        repo.index.commit(message)
    except Exception as e:
        wiz.response.status(500, str(e))
    wiz.response.status(200)