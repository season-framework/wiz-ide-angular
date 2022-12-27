import { OnInit } from '@angular/core';
import { Service } from '@wiz/service/service';

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
    public APP_ID: string = wiz.namespace;

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.branch.load();
    }

    public isdev = wiz.dev();

    public branch: any = (() => {
        let obj: any = {};
        obj.current = wiz.branch();
        obj.data = [];

        obj.load = async () => {
            let { code, data } = await wiz.call("branches");
            obj.data = data;
            await this.service.render();
        }

        return obj;
    })();

    public async clean() {
        await this.service.loading.show();
        try {
            let { code, data } = await wiz.call("clean");
            if (code == 200) {
                toastr.success("Builded");
            } else {
                toastr.error("Error");
            }
        } catch (e) {
            toastr.error("Error");
        }

        await this.service.loading.hide();
    }

}