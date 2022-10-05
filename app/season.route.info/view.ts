import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope;
    @Input() item;

    public data: any = {};

    public async ngOnInit() {
        this.data = await this.item.tab().data();
        await this.scope.render();
    }
}