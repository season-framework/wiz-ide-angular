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
    public APP_ID: string = "core.topmenu";

    constructor(private editor: Editor) {
    }

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
            await this.event.render();
        }

        return obj;
    })();

    public async clean() {
        await this.event.loading.show();
        try {
            let { code, data } = await wiz.call("clean");
            if(code == 200) {
                toastr.success("Build Cleaned");
            } else {
                toastr.error("Error");
            }
        } catch (e) {
            toastr.error("Error");
        }

        await this.event.loading.hide();
    }

}