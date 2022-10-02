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

    APP_ID: string = "core.leftmenu.apps";

    constructor(private editor: Editor, private ref: ChangeDetectorRef) {
        editor.setUpdate(this.APP_ID, async (item: any) => {
            toastr.info("Request update");

            let target = item.tabs[item.current];
            let path = target.path;
            let code = await editor.getData(path);

            let data: any = { path, code, moved: false };
            if (target.mode == 'info.app') {
                code = JSON.parse(code);
                code.title = item.info.title;
                code.namespace = item.info.namespace;
                code.category = item.info.category;
                let fullid = code.mode + "." + code.namespace;
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