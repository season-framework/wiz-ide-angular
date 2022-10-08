import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope: any;
    @Input() menu: any;

    public current: string = wiz.branch();
    public keyword: string = "";
    public loading: boolean = false;
    public data: any = [];

    public async ngOnInit() {
        await this.load();
    }

    public async load() {
        await this.loader(true);
        let { data } = await wiz.call("list");
        data.sort((a, b) => {
            return a.id.localeCompare(b.id);
        });
        this.data = data;
        await this.loader(false);
    }

    public async loader(status) {
        this.loading = status;
        await this.scope.render();
    }

    public match(item: any) {
        let target = item.id.toLowerCase();
        if (target.indexOf(this.keyword.toLowerCase()) >= 0)
            return true;
        return false;
    }

    public open(item: any) {
        console.log(item);
    }

    public create(item: any) {
        console.log(item);
    }

    public download(item: any) {
        let target = wiz.url("download/" + item.id);
        window.open(target, '_blank');
    }

    public ng_download(item: any) {
        let target = wiz.url("ng_download/" + item.id);
        window.open(target, '_blank');
    }
}