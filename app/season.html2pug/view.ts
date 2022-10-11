import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope: any;
    @Input() menu: any;

    public APP_ID: string = wiz.namespace;

    public data: string = '';

    public monaco: any = {
        language: 'html',
        wordWrap: false,
        roundedSelection: false,
        scrollBeyondLastLine: true,
        glyphMargin: false,
        folding: true,
        fontSize: 14,
        automaticLayout: true,
        minimap: { enabled: false }
    }

    public monacoPug: any = {
        language: 'pug',
        lineNumbers: 'off',
        wordWrap: false,
        roundedSelection: false,
        scrollBeyondLastLine: true,
        glyphMargin: false,
        folding: true,
        fontSize: 14,
        automaticLayout: true,
        readOnly: true,
        minimap: { enabled: false }
    }

    constructor() { }

    public async convert() {
        let { data } = await wiz.call("html2pug", { html: this.data });
        this.pug = data;
        await this.scope.render();
    }

}