import { OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export class Component implements OnInit {
    @Input() title;
    @Input() message;
    @Input() action_text;
    @Input() action_class;
    @Input() close_text;

    constructor(public activeModal: NgbActiveModal) {
    }

    public async ngOnInit() {
    }
}