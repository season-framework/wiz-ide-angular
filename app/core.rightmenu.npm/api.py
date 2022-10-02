def list(segment):
    workspace = wiz.workspace('service')
    fs = workspace.fs("src", "angular")
    packagejson = fs.read.json("package.json")
    deps = packagejson['dependencies']
    res = []
    for dep in deps:
        res.append(dict(name=dep, version=deps[dep]))
    wiz.response.status(200, res)

