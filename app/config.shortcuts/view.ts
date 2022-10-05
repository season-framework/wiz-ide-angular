import { AfterViewInit, Input } from '@angular/core';
import { KeyMod, KeyCode } from 'monaco-editor';
import EditorManager from '@wiz/service/editor';

export class Component implements AfterViewInit {
    @Input() scope;

    public shortcuts: any = [];

    constructor(private editorManager: EditorManager) {
    }

    public async ngAfterViewInit() {
        this.shortcuts.push({
            key: ["cmd + s", "ctrl + s"],
            monaco: KeyMod.CtrlCmd | KeyCode.KeyS,
            preventDefault: true,
            command: async () => {
                await this.scope.update();
            }
        }, {
            key: ["alt + a"],
            monaco: KeyMod.Alt | KeyCode.KeyA,
            preventDefault: true,
            command: async () => {
                if (!this.editorManager.activated) return;
                let target = this.editorManager.activated;
                let current = target.current * 1;
                if (target.tabs[current - 1]) {
                    current = target.current - 1;
                } else {
                    current = target.tabs.length - 1;
                }
                await target.select(current);
            }
        }, {
            key: ["alt + s"],
            monaco: KeyMod.Alt | KeyCode.KeyS,
            preventDefault: true,
            command: async () => {
                if (!this.editorManager.activated) return;
                let target = this.editorManager.activated;
                let current = target.current * 1;
                if (target.tabs[current + 1]) {
                    current = target.current + 1;
                } else {
                    current = 0;
                }
                await target.select(current);
            }
        }, {
            key: ["alt + w"],
            monaco: KeyMod.Alt | KeyCode.KeyW,
            preventDefault: true,
            command: async () => {
                if (this.editorManager.activated)
                    await this.editorManager.activated.close();
            }
        }, {
            key: ["alt + t"],
            monaco: KeyMod.Alt | KeyCode.KeyT,
            preventDefault: true,
            command: async () => {
                if (!this.editorManager.activated) return;
                let target = this.editorManager.activated;
                let location = this.editorManager.indexOf(target);
                await target.clone(location + 1);
            }
        });

        for (let i = 0; i < this.shortcuts.length; i++)
            this.shortcuts[i].allowIn = ['TEXTAREA', 'INPUT', 'SELECT'];
        this.scope.shortcuts = this.shortcuts;
    }
}