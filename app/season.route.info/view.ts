import { OnInit, Input } from '@angular/core';
import { Service } from '@wiz/service/service';

export class Component implements OnInit {
    @Input() editor;

    public data: any = {};
    public loading: boolean = true;
    public ctrls: any = [];

    constructor(public service: Service) { }

    public async ngOnInit() {
        this.data = await this.editor.tab().data();
        this.loading = false;
        this.ctrls = await this.loadControllers();
        await this.service.render();
    }

    public async loadControllers() {
        let { data } = await wiz.app("core.project").call("controllers");
        return data;
    }
}