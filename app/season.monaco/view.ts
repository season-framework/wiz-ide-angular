import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope;
    @Input() editor;

    public loading: boolean = true;
    public data: any = {};

    public async ngOnInit() {
        await this.loader(true);
        this.data = await this.editor.tab().data();
        await this.loader(false);
    }

    public async loader(status) {
        this.loading = status;
        await this.scope.render();
    }

    public async init(e) {
        let editor = this.editor;
        for (let i = 0; i < this.scope.shortcuts.length; i++) {
            let shortcut = this.scope.shortcuts[i];
            e.editor.addCommand(shortcut.monaco, shortcut.command);
        }
        editor.meta.monaco = e.editor;
        editor.meta.monaco.focus();
    }
}