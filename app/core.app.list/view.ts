import EditorManager from '@wiz/service/editor';
import { OnInit, Input } from '@angular/core';
import toastr from "toastr";

import InfoEditor from "@wiz/app/core.app.info";
import MonacoEditor from "@wiz/app/season.monaco";

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
    @Input() scope: any;
    @Input() menu: any;

    public APP_ID: string = wiz.namespace;
    public keyword: string = "";
    public categories: Array<string> = [];
    public apps: any = {};
    public infoEditorClass: any;

    constructor(private editorManager: EditorManager) {
    }

    public async ngOnInit() {
        this.infoEditorClass = InfoEditor;
        await this.load();
    }

    public active(item: EditorManager.Editor) {
        let em = this.editorManager;
        if (!em.activated) return '';
        if (this.APP_ID != em.activated.component_id) return '';
        if (item.id != em.activated.subtitle) return '';
        return 'active';
    }

    public match(item: any) {
        if (!this.keyword) return true;
        if (item.title)
            if (item.title.toLowerCase().indexOf(this.keyword.toLowerCase()) >= 0)
                return true;

        if (item.id) {
            let target = item.id.toLowerCase();
            if (target.toLowerCase().indexOf(this.keyword.toLowerCase()) >= 0) {
                return true;
            }
        }
        return false;
    }

    public async load() {
        let { data } = await wiz.call("list", {});
        let apps: any = {};
        let categories: any = [];
        for (let i = 0; i < data.length; i++) {
            let app = data[i];
            let category = app.category;
            if (!category) category = 'undefined';
            if (!apps[category]) {
                apps[category] = [];
                if (categories.indexOf(category) < 0)
                    categories.push(category)
            }
            apps[category].push(app);
        }

        this.apps = apps;
        this.categories = categories;

        await this.scope.render();
    }

    private async update(path: string, data: string, entire: boolean = false) {
        let res = await wiz.call('update', { path: path, code: data });
        toastr.success("Updated");
        await this.load();
        res = await wiz.call('build', { path: path, entire: entire });
        if (res.code == 200) toastr.info("Build Finish");
        else toastr.error("Error on build");
    }

    public async create() {
        // create editor
        let editor = this.editorManager.create({ component_id: this.APP_ID, title: 'New' });

        // create tab
        editor.create({ name: 'info', viewref: this.infoEditorClass })
            .bind('data', async (tab) => {
                return { id: '', title: '', viewuri: '', category: '' };
            }).bind('update', async (tab) => {
                let data = await tab.data();
                let check = /^[a-z0-9.]+$/.test(data.id);
                if (!check) return toastr.error("invalidate id");
                if (data.id.length < 3) return toastr.error("id at least 3 alphabets");

                let id = data.id;
                let res = await wiz.call("exists", { id });
                if (res.data) return toastr.error("id already exists");

                data = JSON.stringify(data, null, 4);
                let path = "ide/app/" + id + "/app.json";

                editor.close();
                await wiz.call('update', { path, code: data });
                await this.load();
            });

        await editor.open();
    }

    public async open(app: any, location: number = -1) {
        let apppath = 'ide/app/' + app.id;

        // create editor
        let editor = this.editorManager.create({
            component_id: this.APP_ID,
            path: apppath,
            title: app.title ? app.title : app.id,
            subtitle: app.id,
            current: 1
        });

        // create tab
        editor.create({
            name: 'info',
            viewref: this.infoEditorClass,
            path: apppath + "/app.json"
        }).bind('data', async (tab) => {
            let { code, data } = await wiz.call('data', { path: tab.path });
            if (code != 200) return {};
            editor.meta.id = app.id;
            data = JSON.parse(data);
            data.id = app.id;
            return data;
        }).bind('update', async (tab) => {
            let data = await tab.data();

            let check = /^[a-z0-9.]+$/.test(data.id);
            if (!check) return toastr.error("invalidate id");
            if (data.id.length < 3) return toastr.error("id at least 3 alphabets");

            let from = editor.meta.id;
            let to = data.id;

            // if moved
            if (from != to) {
                toastr.error("ID cannot be changed");
                return;
            }

            editor.modify({ title: data.title ? data.title : data.id });

            data = JSON.stringify(data, null, 4);
            await this.update(editor.path + '/app.json', data, from != to);
        });

        // monaco editor tabs
        let tabs: any = [
            editor.create({
                name: 'Pug',
                viewref: MonacoEditor,
                path: apppath + "/view.pug",
                config: { monaco: { language: 'pug' } }
            }),
            editor.create({
                name: 'Component',
                viewref: MonacoEditor,
                path: apppath + "/view.ts",
                config: { monaco: { language: 'typescript', renderValidationDecorations: 'off' } }
            }),
            editor.create({
                name: 'SCSS',
                viewref: MonacoEditor,
                path: apppath + "/view.scss",
                config: { monaco: { language: 'scss' } }
            }),
            editor.create({
                name: 'Service',
                viewref: MonacoEditor,
                path: apppath + "/service.ts",
                config: { monaco: { language: 'typescript', renderValidationDecorations: 'off' } }
            }),
            editor.create({
                name: 'API',
                viewref: MonacoEditor,
                path: apppath + "/api.py",
                config: { monaco: { language: 'python' } }
            })
        ];

        // bind event to monaco editor tabs
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].bind('data', async (tab) => {
                editor.meta.info = await editor.tab(0).data();
                let { code, data } = await wiz.call('data', { path: tab.path });
                if (code != 200) return {};
                return { data };
            }).bind('update', async (tab) => {
                let data = await tab.data();
                await this.update(tab.path, data.data, false);
            });
        }

        // bind editor delete event
        editor.bind("delete", async () => {
            let res = await this.scope.alert.show({ title: 'Delete App', message: 'Are you sure remove "' + editor.title + '"?', action_text: "Delete", action_class: "btn-danger" });
            if (res !== true) return;

            let targets = await this.editorManager.find(editor);
            for (let i = 0; i < targets.length; i++)
                await targets[i].close();
            await wiz.call("remove", { path: editor.path });
            await this.load();
            await wiz.call('build', { path: editor.path, entire: true });
        });

        // bind editor clone event
        editor.bind("clone", async (location: number = -1) => {
            await this.open(app, location);
        });

        await editor.open(location);
    }

}