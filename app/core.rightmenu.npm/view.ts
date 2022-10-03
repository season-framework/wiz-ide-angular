import Editor from '@wiz/service/editor';
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
    @Input() event: any;

    public APP_ID: string = wiz.namespace;
    public loading: boolean = false;
    public async loader(status) {
        this.loading = status;
        await this.event.render();
    }

    constructor(private editor: Editor) {
    }

    public async ngOnInit() {
        await this.package.load();
    }

    package = (() => {
        let obj: any = {};

        obj.data = [];
        obj.keyword = "";
        obj.required = [
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

        obj.match = (value: string) => {
            if (value.indexOf(obj.keyword) >= 0) {
                return true;
            }
            return false;
        }

        obj.install = async (keyword) => {
            await this.loader(true);
            let { code, data } = await wiz.call("install", { package: keyword });
            this.event.log(data);
            await this.package.load();
            await this.loader(false);
        }

        obj.uninstall = async (keyword) => {
            await this.loader(true);
            let { code, data } = await wiz.call("uninstall", { package: keyword });
            this.event.log(data);
            await this.package.load();
            await this.loader(false);
        }

        obj.load = async () => {
            await this.loader(true);
            let { code, data } = await wiz.call("list");
            data.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            obj.data = data;
            await this.loader(false);
        }

        return obj;
    })();
}