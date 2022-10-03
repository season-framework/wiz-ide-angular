import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() event;
    @Input() menu;
    @Input() binding;

    constructor() {
    }

    public async ngOnInit() {
        this.menu.build([
            { name: 'Angular', id: 'angular', icon: 'fa-brands fa-angular' },
            { name: 'Page', id: 'page', icon: 'fa-solid fa-window-restore' },
            { name: 'Layout', id: 'layout', icon: 'fa-solid fa-table-columns' },
            { name: 'Component', id: 'component', icon: 'fa-solid fa-cubes' },
            { name: 'Service', id: 'service', icon: 'fa-solid fa-hammer' },
            { name: 'Styles', id: 'styles', icon: 'fa-brands fa-css3-alt' },
            { name: 'Assets', id: 'assets', icon: 'fa-solid fa-images' }
        ], [
            { name: 'Route API', id: 'route', icon: 'fa-solid fa-link' },
            { name: 'Model', id: 'model', icon: 'fa-solid fa-database' },
            { name: 'Controller', id: 'controller', icon: 'fa-solid fa-filter' }
        ]);
    }
}