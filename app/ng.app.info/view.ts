import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope;
    @Input() editor;

    public data: any = {};
    public loading: boolean = true;
    public ctrls: any = [];

    public async ngOnInit() {
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