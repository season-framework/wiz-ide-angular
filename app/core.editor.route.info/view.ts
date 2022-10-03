import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() event;
    @Input() item;
    
    constructor() {
    }

    public async ngOnInit() {
    }
}