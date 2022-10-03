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

    APP_ID: string = wiz.namespace;
    public keyword: string = "";

    constructor(private editor: Editor, private ref: ChangeDetectorRef) {
    }

    public async ngOnInit() {
        let editor = this.editor;

        editor.setUpdate(this.APP_ID, async (item: any) => {
            let check = /^[a-z0-9.]+$/.test(item.info.id);
            if (!check) {
                toastr.error("invalidate id");
                return;
            }

            if (item.info.id.length < 3) {
                toastr.error("id at least 3 alphabets");
                return;
            }

            if (!item.path) {
                let id = item.info.id;
                let res = await wiz.call("exists", { id });
                if (res.data) {
                    toastr.error("id already exists");
                    return;
                }

                let code: any = {};
                code.title = item.info.title;
                code.id = item.info.id;
                code.category = item.info.category;
                code.viewuri = item.info.viewuri;
                code.route = item.info.route;
                code = JSON.stringify(code, null, 4);
                let path = "route/" + item.info.id + "/app.json";
                editor.close(item);
                await wiz.call('update', { path, code, isnew: true });

                await this.app.load();
                return;
            }

            let target = item.tabs[item.current];
            let path = target.path;
            let code = await editor.getData(path);

            let data: any = { path, code, moved: false };
            if (target.mode == 'info.route') {
                code = JSON.parse(code);
                let orgappid = code.id + '';
                code.id = item.info.id;
                code.title = item.info.title;
                code.route = item.info.route;
                code.category = item.info.category;
                code.viewuri = item.info.viewuri;
                code = JSON.stringify(code, null, 4);
                data = { path, code, moved: item.info.id == orgappid ? false : { from: orgappid, to: item.info.id } };
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
                item.subtitle = item.info.route;
                item.path = "route/" + to;
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
                target.title = item.info.title ? item.info.title : item.info.id;
                target.subtitle = item.info.route;
                target.path = item.path;
                target.tabs = item.tabs;
                return target;
            });

            if (data.moved) data.moved = true;
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
                    id: '',
                    title: '',
                    route: '',
                    viewuri: '',
                    category: ''
                },
                tabs: [{ name: "Info", mode: "info.route", path: "new-item/app.json" }]
            };

            obj.open(std);
        }

        obj.load = async () => {
            let { code, data } = await wiz.call("list");

            let apps: any = {};
            let categories: any = [];

            for (let i = 0; i < data.length; i++) {
                let app = data[i];
                let apppath = 'route/' + app.id;
                let category = app.category;
                if (!category) category = 'undefined';

                let tabs: any = [];

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

                tabs.push(
                    { name: "Info", mode: "info.route", path: apppath + "/app.json" },
                    {
                        name: "Controller", mode: "code", path: apppath + "/controller.py",
                        config: { language: 'python', ...monacoConfig }
                    }
                );

                let std = {
                    app_id: this.APP_ID,
                    unique: true,
                    title: app.title ? app.title : app.id,
                    subtitle: app.route,
                    current: 1,
                    path: apppath,
                    info: {
                        id: app.id,
                        route: app.route,
                        title: app.title ? app.title : app.id,
                        viewuri: app.viewuri,
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

            categories.sort();

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