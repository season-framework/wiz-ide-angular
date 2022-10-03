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

    constructor(private editor: Editor, private ref: ChangeDetectorRef) {
        editor.setUpdate(this.APP_ID, async (item: any) => {
            toastr.info("Request update");
            let target = item.tabs[item.current];
            let path = target.path;
            let code = await editor.getData(path);
            let data: any = { path, code };

            let res = await wiz.call('update', data);
            if (res.code == 200) {
                toastr.success("Updated");
            } else {
                toastr.error("Error on update");
            }

            await this.app.load();
        });
    }

    public async ngOnInit() {
        await this.app.load();
    }

    app = (() => {
        let obj: any = {};

        obj.data = [];

        obj.load = async () => {
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

            let apppath = 'angular/app';

            obj.data = [{
                app_id: this.APP_ID,
                unique: true,
                title: 'App Module',
                subtitle: 'app-routing.module',
                current: 0,
                path: 'angular/app/app.module.ts',
                tabs: [
                    {
                        name: "Module", mode: "code", path: "angular/app/app.module.ts",
                        config: { language: 'typescript', renderValidationDecorations: 'off', ...monacoConfig }
                    },
                ]
            }, {
                app_id: this.APP_ID,
                unique: true,
                title: 'App Routing',
                subtitle: 'app-routing.module',
                current: 0,
                path: 'angular/app/app-routing.module.ts',
                tabs: [
                    {
                        name: "Routing", mode: "code", path: "angular/app/app-routing.module.ts",
                        config: { language: 'typescript', renderValidationDecorations: 'off', ...monacoConfig }
                    }
                ]
            }, {
                app_id: this.APP_ID,
                title: 'App UI',
                subtitle: 'app.component',
                current: 0,
                path: 'angular/app',
                tabs: [
                    {
                        name: "index", mode: "code", path: "angular/index.pug",
                        config: { language: 'pug', ...monacoConfig }
                    },
                    {
                        name: "app-root", mode: "code", path: apppath + "/app.component.pug",
                        config: { language: 'pug', ...monacoConfig }
                    },
                    {
                        name: "component", mode: "code", path: apppath + "/app.component.ts",
                        config: { language: 'typescript', renderValidationDecorations: 'off', ...monacoConfig }
                    },
                    {
                        name: "scss", mode: "code", path: apppath + "/app.component.scss",
                        config: { language: 'scss', ...monacoConfig }
                    }
                ]
            }, {
                app_id: this.APP_ID,
                unique: true,
                title: 'Build Options',
                subtitle: 'angular.json',
                current: 0,
                path: 'angular/angular.build.options.json',
                tabs: [
                    {
                        name: "Routing", mode: "code", path: "angular/angular.build.options.json",
                        config: { language: 'json', ...monacoConfig }
                    }
                ]
            }, {
                app_id: this.APP_ID,
                unique: true,
                title: 'Wiz',
                subtitle: 'wiz',
                current: 0,
                path: 'angular/wiz.ts',
                tabs: [
                    {
                        name: "Module", mode: "code", path: "angular/wiz.ts",
                        config: { language: 'typescript', renderValidationDecorations: 'off', ...monacoConfig }
                    },
                ]
            }];

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