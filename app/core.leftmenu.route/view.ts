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

    APP_ID: string = "core.leftmenu.route";

    constructor(private editor: Editor, private ref: ChangeDetectorRef) {
        editor.setUpdate(this.APP_ID, async (item: any) => {
            let target = item.tabs[item.current];
            let path = target.path;
            let code = await editor.getData(path);

            let data: any = { path, code, moved: false };
            if (target.mode == 'info.route') {
                code = JSON.parse(code);
                code.title = item.info.title;
                code.route = item.info.route;
                code.category = item.info.category;
                let fullid = code.id;
                code = JSON.stringify(code, null, 4);
                data = { path, code, moved: item.info.id == fullid ? false : { from: item.info.id, to: fullid } };
            }

            if (data.moved) {
                console.log("moved", data);
            } else {
                let { code } = await wiz.call('update', data);
                if (code == 200) {
                    toastr.success("Updated");
                } else {
                    toastr.error("Error on update");
                }
            }

            await this.app.load();
        });
    }

    public async ngOnInit() {
        await this.app.load();
    }

    app = (() => {
        let obj: any = {};

        obj.data = {};
        obj.categories = [];

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