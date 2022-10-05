import { OnInit, Input } from '@angular/core';
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

    public APP_ID: string = wiz.namespace;
    public loading: boolean = false;
    public data: any = [];
    public keyword: string = "";
    public required: Array<string> = [
        "@angular/animations",
        "@angular/common",
        "@angular/compiler",
        "@angular/core",
        "@angular/forms",
        "@angular/platform-browser",
        "@angular/platform-browser-dynamic",
        "@angular/router",
        "jquery",
        "ngc-esbuild",
        "pug",
        "rxjs",
        "socket.io-client",
        "tslib",
        "zone.js"
    ];

    public async ngOnInit() {
        await this.load();
    }

    public async loader(status) {
        this.loading = status;
        await this.scope.render();
    }

    public match(value: string) {
        if (value.indexOf(this.keyword) >= 0)
            return true;
        return false;
    }

    public async install(keyword: string) {
        if (!keyword) return;
        await this.loader(true);
        let { data } = await wiz.call("install", { package: keyword });
        this.scope.log(data);
        await this.load();
        await this.loader(false);
    }

    public async uninstall(keyword: string) {
        if (!keyword) return;
        await this.loader(true);
        let { data } = await wiz.call("uninstall", { package: keyword });
        this.scope.log(data);
        await this.load();
        await this.loader(false);
    }

    public async load() {
        await this.loader(true);
        let { data } = await wiz.call("list");
        data.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        this.data = data;
        await this.loader(false);
    }
}