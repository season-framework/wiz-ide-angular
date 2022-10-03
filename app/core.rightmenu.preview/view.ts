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
    @Input() event: any;
    @Output() binding = new EventEmitter<any>();

    public APP_ID: string = wiz.namespace;
    public loading: boolean = false;
    public async loader(status) {
        this.loading = status;
        await this.event.render();
    }

    constructor(private sanitizer: DomSanitizer) {
    }

    public async ngOnInit() {
        let opts: any = {};
        opts.id = this.APP_ID;
        opts.data = this.iframe;
        this.binding.emit(opts);
    }

    iframe: any = (() => {
        let obj: any = {};

        obj.url = "/";
        obj.target = "/";
        obj.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl("/");

        obj.move = async (url) => {
            obj.url = url;
            obj.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            await this.event.render();
        }

        return obj;
    })();
}