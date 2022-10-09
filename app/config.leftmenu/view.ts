import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope;
    @Input() menu;
    @Input() binding;

    constructor() {
    }

    public async ngOnInit() {
        this.menu.build([
            { name: 'Page', id: 'page', icon: 'fa-solid fa-window-restore' },
            { name: 'Component', id: 'component', icon: 'fa-solid fa-cubes' },
            { name: 'Layout', id: 'layout', icon: 'fa-solid fa-table-columns' },
            { name: 'Styles', id: 'styles', icon: 'fa-brands fa-css3-alt' },
            { name: 'Assets', id: 'assets', icon: 'fa-solid fa-images' },
            { name: 'Service', id: 'service', icon: 'fa-solid fa-hammer' },
            { name: 'Custom Packages', id: 'libs', icon: 'fa-solid fa-boxes-packing' },
            { name: 'Angular', id: 'angular', icon: 'fa-brands fa-angular' }
        ], [
            { name: 'Route API', id: 'route', icon: 'fa-solid fa-link' },
            { name: 'Model', id: 'model', icon: 'fa-solid fa-database' },
            { name: 'Controller', id: 'controller', icon: 'fa-solid fa-filter' }
        ]);
    }
}