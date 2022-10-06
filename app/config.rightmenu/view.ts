import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope;
    @Input() menu;
    @Input() binding;

    constructor() {
    }

    public async ngOnInit() {
        this.menu.build([
            { name: 'Project', id: 'project', icon: 'fa-solid fa-folder-tree' },
            { name: 'Commit', id: 'commit', icon: 'fa-solid fa-code-commit' },
            { name: 'Preview', id: 'preview', icon: 'fa-solid fa-eye' },
            { name: 'NPM Package', id: 'npm', icon: 'fa-solid fa-boxes-packing' },
            { name: 'PIP Pacakge', id: 'pip', icon: 'fa-brands fa-python' },
            { name: 'Config', id: 'config', icon: 'fa-solid fa-cog' }
        ], [
            { name: 'System Setting', id: 'system.setting', icon: 'fa-solid fa-wrench', width: 280 },
            { name: 'System Status', id: 'system.status', icon: 'fa-solid fa-heart-pulse', width: 280 }
        ]);
    }
}