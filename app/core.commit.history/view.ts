import { OnInit, Input } from '@angular/core';
import toastr from "toastr";
import moment from "moment";

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

    public commits: any = [];

    public async ngOnInit() {
        await this.load();
    }

    public datedisplay(date) {
        let targetdate = moment(date);
        let diff = new Date().getTime() - new Date(targetdate).getTime();
        diff = diff / 1000 / 60 / 60;

        if (diff > 24) return targetdate.format("YYYY-MM-DD hh:mm");
        if (diff > 1) return Math.floor(diff) + " hours ago"

        diff = diff * 60;

        if (diff < 2) return "just now";

        return Math.floor(diff) + " minutes ago";
    }

    public async loader(status) {
        this.loading = status;
        await this.scope.render();
    }

    public async load() {
        await this.loader(true);
        let { data } = await wiz.call("history");
        this.commits = data;
        await this.loader(false);
    }
}