import { OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import toastr from "toastr";

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": 300,
    "hideDuration": 500,
    "timeOut": 1500,
    "extendedTimeOut": 1000,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

export class Component implements OnInit {
    @Input() scope: any;
    @Input() menu: any;
    @Output() binding = new EventEmitter<any>();

    public APP_ID: string = wiz.namespace;
    public loading: boolean = false;
    public url: string = "/";
    public urlSafe: string;

    constructor(private sanitizer: DomSanitizer) {
        this.urlSafe = sanitizer.bypassSecurityTrustResourceUrl("/");
    }

    public async loader(status) {
        this.loading = status;
        await this.scope.render();
    }

    public async ngOnInit() {
        let id = this.APP_ID;
        let data = this;
        this.binding.emit({ id, data });
    }

    public async move(url: string) {
        if (url[0] != "/") url = "/" + url;
        this.url = url;
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        await this.scope.render();
    }

}