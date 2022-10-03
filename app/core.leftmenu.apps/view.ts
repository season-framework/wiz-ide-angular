import Editor from '@wiz/service/editor';
import { OnInit, ChangeDetectorRef, Input } from '@angular/core';
import toastr from "toastr";

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": 300,
    "hideDuration": 500,
    "timeOut": 1500,
    "extendedTimeOut": 1000,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

export class Component implements OnInit {
    @Input() event: any;
    @Input() appmode: any;

    APP_ID: string = wiz.namespace;
    public keyword: string = "";

    constructor(private editor: Editor, private ref: ChangeDetectorRef) {
    }

    public async ngOnInit() {
        let editor = this.editor;

        editor.setUpdate(this.APP_ID, async (item: any) => {
            let check = /^[a-z0-9.]+$/.test(item.info.namespace);
            if (!check) {
                toastr.error("invalidate namespace");
                return;
            }

            if (item.info.namespace.length < 3) {
                toastr.error("namespace at least 3 alphabets");
                return;
            }

            if (!item.path) {
                let id = item.info.mode + "." + item.info.namespace;
                let res = await wiz.call("exists", { id });
                if (res.data) {
                    toastr.error("namespace already exists");
                    return;
                }

                let code: any = {};
                code.title = item.info.title;
                code.namespace = item.info.namespace;
                code.category = item.info.category;
                code.viewuri = item.info.viewuri;
                code.mode = this.appmode;
                let fullid = code.mode + "." + code.namespace;
                code.id = fullid
                code = JSON.stringify(code, null, 4);
                let path = "app/" + fullid + "/app.json";

                editor.close(item);
                await wiz.call('update', { path, code, isnew: true });

                await this.app.load();
                return;
            }

            let target = item.tabs[item.current];
            let path = target.path;
            let code = await editor.getData(path);

            let data: any = { path, code, moved: false };
            if (target.mode == 'info.app') {
                code = JSON.parse(code);
                code.title = item.info.title;
                code.namespace = item.info.namespace;
                code.category = item.info.category;
                code.viewuri = item.info.viewuri;
                let fullid = code.mode + "." + code.namespace;
                code.id = fullid
                code = JSON.stringify(code, null, 4);
                data = { path, code, moved: item.info.id == fullid ? false : { from: item.info.id, to: fullid } };
            }

            let orgapppath = item.path + "";
            if (data.moved) {
                let { from, to } = data.moved;
                data.id = to;
                data.path = data.path.split("/");
                data.path[1] = to;
                data.path = data.path.join("/");
                let res = await wiz.call("move", { from, to });
                if (res.code == 400) {
                    toastr.error("invalidate namespace");
                    return;
                }

                item.title = item.info.title;
                item.info.id = to;
                item.subtitle = to;
                item.path = "app/" + to;
                for (let i = 0; i < item.tabs.length; i++) {
                    let orgpath = item.tabs[i].path;
                    let orgdata = await editor.getData(orgpath);
                    item.tabs[i].path = item.tabs[i].path.split("/");
                    item.tabs[i].path[1] = to;
                    item.tabs[i].path = item.tabs[i].path.join("/");
                    await this.editor.setData(item.tabs[i].path, orgdata);
                    await editor.deleteData(orgpath);
                }
            }

            await editor.replace(this.APP_ID, orgapppath, async (target) => {
                target.info = item.info;
                target.title = item.info.title ? item.info.title : item.info.namespace;
                target.subtitle = item.info.id;
                target.path = item.path;
                target.tabs = item.tabs;
                return target;
            });

            if (data.moved) data.moved = true;
            toastr.info("Request update");
            let res = await wiz.call('update', data);
            if (res.code == 200) {
                toastr.success("Updated");
            } else {
                toastr.error("Error on update");
            }

            await this.app.load();

            let binding = this.event.binding.load("core.rightmenu.preview");
            if (binding && item.info.viewuri)
                await binding.move(item.info.viewuri);
        });

        editor.setRemove(this.APP_ID, async (item: any) => {
            let targets = await editor.find(this.APP_ID, item.path);
            for (let i = 0; i < targets.length; i++) {
                await editor.close(targets[i]);
            }
            await wiz.call("remove", { path: item.path });
            await this.app.load();
        });

        await this.app.load();
    }

    app = (() => {
        let obj: any = {};

        let monacoConfig: any = {
            wordWrap: true,
            roundedSelection: false,
            scrollBeyondLastLine: false,
            glyphMargin: false,
            folding: true,
            fontSize: 14,
            automaticLayout: true,
            minimap: { enabled: false }
        }

        obj.data = {};
        obj.categories = [];

        obj.match = (item) => {
            if (item.title.toLowerCase().indexOf(this.keyword.toLowerCase()) >= 0) {
                return true;
            }
            if (item.subtitle.toLowerCase().indexOf(this.keyword.toLowerCase()) >= 0) {
                return true;
            }
            return false;
        }

        obj.create = async () => {
            let std: any = {
                app_id: this.APP_ID,
                title: 'New',
                subtitle: null,
                current: 0,
                path: null,
                info: {
                    id: null,
                    title: '',
                    namespace: '',
                    viewuri: '',
                    mode: this.appmode,
                    category: ''
                },
                tabs: [{ name: "Info", mode: "info.app", path: "new-item/app.json" }]
            };

            obj.open(std);
        }

        obj.load = async () => {
            let { code, data } = await wiz.call("list", { mode: this.appmode });

            let apps: any = {};
            let categories: any = [];

            for (let i = 0; i < data.length; i++) {
                let app = data[i];
                let apppath = 'app/' + app.id;
                let category = app.category;
                let mode = this.appmode;
                if (!category) category = 'undefined';

                let tabs: any = [];

                tabs.push(
                    { name: "Info", mode: "info.app", path: apppath + "/app.json" },
                    {
                        name: "Pug", mode: "code", path: apppath + "/view.pug",
                        config: { language: 'pug', ...monacoConfig }
                    },
                    {
                        name: "Component", mode: "code", path: apppath + "/view.ts",
                        config: { language: 'typescript', renderValidationDecorations: 'off', ...monacoConfig }
                    },
                    {
                        name: "SCSS", mode: "code", path: apppath + "/view.scss",
                        config: { language: 'scss', ...monacoConfig }
                    }
                );

                if (mode == 'page') {
                    tabs.push({
                        name: "Service", mode: "code", path: apppath + "/service.ts",
                        config: { language: 'typescript', renderValidationDecorations: 'off', ...monacoConfig }
                    });
                }

                tabs.push(
                    {
                        name: "API", mode: "code", path: apppath + "/api.py",
                        config: { language: 'python', ...monacoConfig }
                    },
                    {
                        name: "Socket", mode: "code", path: apppath + "/socket.py",
                        config: { language: 'python', ...monacoConfig }
                    },
                );

                let std = {
                    app_id: this.APP_ID,
                    title: app.title ? app.title : app.namespace,
                    subtitle: app.id,
                    current: 1,
                    path: apppath,
                    info: {
                        id: app.id,
                        title: app.title ? app.title : app.namespace,
                        namespace: app.namespace,
                        viewuri: app.viewuri,
                        mode: mode,
                        category: category
                    },
                    tabs: tabs
                };

                if (!apps[category]) {
                    apps[category] = [];
                    if (categories.indexOf(category) < 0)
                        categories.push(category)
                }

                apps[category].push(std);
            }

            obj.data = apps;
            obj.categories = categories;

            await this.event.render();
        }

        obj.open = async (item: any) => {
            try {
                for (let i = 0; i < item.tabs.length; i++) {
                    let path = item.tabs[i].path;
                    if (await this.editor.hasData(path))
                        continue;
                    let { code, data } = await wiz.call('data', { path });
                    if (code == 200) {
                        await this.editor.setData(path, data);
                    } else {
                        toastr.error("Error on load");
                        return;
                    }
                }
            } catch (e) {
                toastr.error("Error on load");
                return;
            }

            await this.editor.open(item);
        }

        return obj;
    })();
}