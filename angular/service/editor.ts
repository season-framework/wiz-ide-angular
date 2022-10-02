export class Editor {
    files: any = {};
    minified: any = [];
    data: any = [];
    activated: any;
    shortcuts: any = [];
    event: any;
    updater: any = {};

    public async bind(event: any) {
        this.event = event;
    }

    public async active(item: any) {
        this.activated = item;
        await this.event.render();
    }

    public async open(item: any) {
        let tab = { ...item };
        if (tab.unique) {
            let selected = null;
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].path == tab.path && tab.app_id == this.data[i].app_id) {
                    selected = this.data[i];
                    break;
                }
            }

            if (selected) {
                this.active(selected);
                await this.event.render();
                return;
            }

            for (let i = 0; i < this.minified.length; i++) {
                if (this.minified[i].path == tab.path && tab.app_id == this.minified[i].app_id) {
                    selected = this.minified[i];
                    break;
                }
            }

            if (selected) {
                this.reopen(selected);
                return;
            }
        }

        tab.editor_id = "editor-" + new Date().getTime();
        this.data.push(tab);
        this.activated = tab;
        await this.event.render();
    }

    public async close(item: any) {
        let location = this.data.indexOf(item);
        this.data.remove(item);
        if (this.activated && item.editor_id == this.activated.editor_id) {
            if (this.data[location]) {
                await this.active(this.data[location]);
            } else if (this.data[location - 1]) {
                await this.active(this.data[location - 1]);
            } else {
                this.activated = null;
            }
        }
        await this.event.render();
    }

    public async load(item: any, current: number) {
        item.current = current;
        await this.event.render();
    }

    public async reopen(item: any) {
        this.minified.remove(item);
        this.data.push(item);
        await this.event.render();
    }

    public async minify(item: any) {
        this.data.remove(item);
        this.minified.push(item);
        await this.event.render();
    }

    // file data
    public async setData(path: string, data: string) {
        this.files[path] = data;
        await this.event.render();
    }

    public async hasData(path: string) {
        return this.files[path] ? true : false;
    }

    public async getData(path: string) {
        return this.files[path];
    }

    // update trigger
    public async setUpdate(app_id: string, fn: any) {
        this.updater[app_id] = fn;
    }

    public async update(item: any) {
        let target = item.tabs[item.current];
        let app_id = item.app_id;

        if (!this.updater[app_id]) {
            let path = target.path;
            let code = await this.getData(path);
            return { path, code };
        }

        await this.updater[app_id](item);
    }
}

export default Editor;