def branches(segment):
    branches = wiz.branch.list()
    wiz.response.status(200, branches)

def clean(segment):
    try:
        workspace = wiz.workspace("service")
        workspace.build.clean()
        workspace.build()
    except:
        wiz.response.status(500)
    wiz.response.status(200)