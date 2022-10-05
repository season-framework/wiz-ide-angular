import { OnInit, Input } from '@angular/core';
import Editor from '@wiz/service/editor';

export class Component implements OnInit {
    @Input() scope;
    @Input() item;
    @Input() tab;

    public data: any = {};

    constructor(private editor: Editor) {
    }

    public async ngOnInit() {
        this.data = await this.item.tab().data();
    }

    public async init(e) {
        let item = this.item
        for (let i = 0; i < this.scope.shortcuts.length; i++) {
            let shortcut = this.scope.shortcuts[i];
            e.editor.addCommand(shortcut.monaco, shortcut.command);
        }
        item.meta.monaco = e.editor;
        item.meta.monaco.focus();
    }
}