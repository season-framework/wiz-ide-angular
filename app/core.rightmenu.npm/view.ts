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

    APP_ID: string = "core.rightmenu.npm";

    constructor(private editor: Editor) {
    }

    public async ngOnInit() {
        await this.package.load();
    }

    package = (() => {
        let obj: any = {};

        obj.data = [];

        obj.load = async () => {
            let { code, data } = await wiz.call("list");
            obj.data = data;
            await this.event.render();
        }

        return obj;
    })();
}