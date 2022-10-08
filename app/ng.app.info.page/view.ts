import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope;
    @Input() editor;

    public data: any = {};
    public loading: boolean = true;
    public layout: any = [];
    public ctrls: any = [];

    public async ngOnInit() {
        let app = wiz.app("ng.app.list");
        let res = await app.call("list", { mode: "layout" });
        this.layout = res.data;

        this.data = await this.editor.tab().data();
        this.loading = false;

        this.ctrls = await this.loadControllers();

        await this.scope.render();
    }

    public async loadControllers() {
        let { data } = await wiz.app("core.project").call("controllers")
        return data;
    }
}