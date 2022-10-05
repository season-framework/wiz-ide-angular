import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope;
    @Input() editor;

    public data: any = {};
    public loading: boolean = true;
    public layout: any = [];

    public async ngOnInit() {
        let app = wiz.app("ng.app.list");
        let res = await app.call("list", { mode: "layout" });
        this.layout = res.data;

        this.data = await this.editor.tab().data();
        this.loading = false;

        await this.scope.render();
    }
}