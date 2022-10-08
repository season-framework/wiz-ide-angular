import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope: any;
    @Input() menu: any;
    
}