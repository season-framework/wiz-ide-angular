import { OnInit, Input } from '@angular/core';
import toastr from "toastr";

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-center",
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

    public APP_ID: string = wiz.namespace;
    public data: any = [];
    public keyword: string = "";
    public loading: boolean = false;

    public async ngOnInit() {
        await this.load();
    }

    public async loader(status) {
        this.loading = status;
        await this.scope.render();
    }

    public match(value: string) {
        if (value.toLowerCase().indexOf(this.keyword.toLowerCase()) >= 0)
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