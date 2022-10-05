import { OnInit, Input } from '@angular/core';
import MonacoEditor from "@wiz/app/season.monaco";
import Editor from '@wiz/service/editor';

export class Component implements OnInit {
    @Input() scope: any;

    public APP_ID: string = wiz.namespace;
    public item: any = null;

    constructor(private editor: Editor) {
    }

    public async ngOnInit() {
    }

    public async open(path) {
        // let { code, data } = await wiz.call("load", { path: path + ".py" });
        // this.editor.setData(path, data);

        // let monacoConfig: any = {
        //     language: 'python',
        //     wordWrap: true,
        //     roundedSelection: false,
        //     scrollBeyondLastLine: false,
        //     glyphMargin: false,
        //     folding: true,
        //     fontSize: 14,
        //     automaticLayout: true,
        //     minimap: { enabled: false }
        // }

        // let item = {
        //     app_id: this.APP_ID,
        //     title: 'System Setting',
        //     subtitle: path,
        //     current: 0,
        //     path: "/config/" + path + ".py",
        //     unique: true,
        //     tabs: [
        //         { name: "code", path: "/config/" + path + ".py", viewref: MonacoEditor, config: { ...monacoConfig } }
        //     ]
        // };

        // this.editor.open(item);
    }

}