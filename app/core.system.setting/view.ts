import EditorManager from '@wiz/service/editor';
import { OnInit, Input } from '@angular/core';
import toastr from "toastr";
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
    public item: any = null;

    constructor(private editorManager: EditorManager) {
    }

    public async ngOnInit() {
    }

    private async update(path: string, data: string) {
        let res = await wiz.call('update', { path: path, code: data });
        if (res.code == 200) toastr.success("Updated");
        res = await wiz.call('build');
        if (res.code == 200) toastr.info("Build Finish");
    }

    public async open(name) {
        let editor = this.editorManager.create({
            component_id: this.APP_ID,
            path: "/config/" + name + ".py",
            title: name,
            unique: true,
            current: 0
        });

        editor.create({
            name: 'config',
            viewref: MonacoEditor,
            path: "/config/" + name + ".py",
            config: { monaco: { language: 'python' } }
        }).bind('data', async (tab) => {
            let { code, data } = await wiz.call('load', { path: name + ".py" });
            if (code != 200) return {};
            return { data };
        }).bind('update', async (tab) => {
            let data = await tab.data();
            await this.update(name + ".py", data.data);
        });

        await editor.open();
    }

}