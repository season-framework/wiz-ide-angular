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
    public loading: boolean = true;

    public files: any = [];
    public message: string = '';

    public async ngOnInit() {
        await this.changes();
    }

    public async loader(status) {
        this.loading = status;
        await this.scope.render();
    }

    public async commit(message: string) {
        await this.loader(true);
        let { code } = await wiz.call("commit", { message });
        if (code == 200) toastr.success("Committed");
        await this.changes();
    }

    public async changes() {
        await this.loader(true);
        let { data } = await wiz.call("changes");

        for (let i = 0; i < data.length; i++) {
            data[i].color = 'bg-secondary';
            if (data[i].change_type == 'M')
                data[i].color = 'bg-yellow';
            if (data[i].change_type == 'R')
                data[i].color = 'bg-yellow';
            if (data[i].change_type == 'D')
                data[i].color = 'bg-red';
            if (data[i].change_type == 'A')
                data[i].color = 'bg-green';
        }

        this.files = data;
        await this.loader(false);
    }
}