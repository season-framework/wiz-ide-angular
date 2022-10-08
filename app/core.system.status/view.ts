import { OnInit, Input } from '@angular/core';

export class Component implements OnInit {
    @Input() scope: any;
    @Input() menu: any;

    public APP_ID: string = wiz.namespace;
    public data: any = {};
    public interval_id: any = 0;

    public timer(time) {
        let minute = Math.round(time / 60);
        if (minute == 0) return time + " sec";
        let hour = Math.round(minute / 60);
        if (hour == 0) return minute + " min";
        return hour + " hr"
    }

    public async ngOnInit() {
        let { data } = await wiz.call("status");
        this.data = data;
        await this.scope.render();

        this.interval_id = setInterval(async () => {
            let { data } = await wiz.call("status");
            this.data = data;
            await this.scope.render();
        }, 1000);

    }

    public async ngOnDestroy() {
        if (this.interval_id > 0)
            clearInterval(this.interval_id);
    }
}