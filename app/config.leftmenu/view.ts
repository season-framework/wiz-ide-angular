import { OnInit, Input } from '@angular/core';
import { Service } from '@wiz/service/service';

export class Component implements OnInit {
    @Input() menu;

    constructor(public service: Service) { }

    public async ngOnInit() {
        this.menu.build([
            { name: 'Page', id: 'page', icon: 'fa-solid fa-window-restore' },
            { name: 'Component', id: 'component', icon: 'fa-solid fa-cubes' },
            { name: 'Layout', id: 'layout', icon: 'fa-solid fa-table-columns' },
            { name: 'Styles', id: 'styles', icon: 'fa-brands fa-css3-alt' },
            { name: 'Assets', id: 'assets', icon: 'fa-solid fa-images' },
            { name: 'Libs', id: 'libs', icon: 'fa-solid fa-book' },
            { name: 'Angular', id: 'angular', icon: 'fa-brands fa-angular' }
        ], [
            { name: 'Route API', id: 'route', icon: 'fa-solid fa-link' },
            { name: 'Model', id: 'model', icon: 'fa-solid fa-database' },
            { name: 'Controller', id: 'controller', icon: 'fa-solid fa-filter' }
        ]);
    }
}