import { OnInit, Input } from '@angular/core';
import { Service } from '@wiz/service/service';

export class Component implements OnInit {
    @Input() menu;

    constructor(public service: Service) { }

    public async ngOnInit() {
        this.menu.build([
            { name: 'Preview', id: 'preview', icon: 'fa-solid fa-eye', width: 360 },
            { name: 'Project', id: 'project', icon: 'fa-solid fa-folder-tree', width: 360 },
            { name: 'Commit', id: 'commit', icon: 'fa-solid fa-code-commit', width: 360 },
            { name: 'Commit History', id: 'commits', icon: 'fa-solid fa-code-branch', width: 360 },
            { name: 'NPM Package', id: 'npm', icon: 'fa-solid fa-boxes-packing', width: 360 },
            { name: 'PIP Pacakge', id: 'pip', icon: 'fa-brands fa-python', width: 360 },
            { name: 'Config', id: 'config', icon: 'fa-solid fa-cog', width: 360 },
            { name: 'HTML2PUG', id: 'html2pug', icon: 'fa-brands fa-html5', width: 360 }
        ], [
            { name: 'Terminal', id: 'xterm', icon: 'fa-solid fa-terminal', width: 721 },
            { name: 'IDE Apps', id: 'system.ide.apps', icon: 'fa-solid fa-plug', width: 280 },
            { name: 'System Setting', id: 'system.setting', icon: 'fa-solid fa-wrench', width: 280 },
            { name: 'System Status', id: 'system.status', icon: 'fa-solid fa-heart-pulse', width: 280 }
        ]);
    }
}