import $ from 'jquery';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Editor from '@wiz/service/editor';

import { CoreViewAlertComponent } from "@wiz/app/core.view.alert";

import { NuMonacoEditorEvent } from '@ng-util/monaco-editor';
import { KeyMod, KeyCode } from 'monaco-editor';
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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    constructor(private editor: Editor, private ref: ChangeDetectorRef, public modalService: NgbModal) {
    }

    public alert: any = (() => {
        let obj: any = {};
        obj.cache = () => { };

        obj.show = (options) => new Promise((resolve) => {
            obj.cache = () => {
                let { title, message, action_text, action_class, close_text } = options;
                if (!close_text) close_text = "Close";
                if (!action_class) action_class = "btn-primary";
                if (!action_text) action_text = "Confirm";

                const modalRef = this.modalService.open(CoreViewAlertComponent, { size: 'sm' });
                modalRef.componentInstance.title = title;
                modalRef.componentInstance.message = message;
                modalRef.componentInstance.action_text = action_text;
                modalRef.componentInstance.action_class = action_class;
                modalRef.componentInstance.close_text = close_text;
                modalRef.result.then((result) => {
                    resolve(result);
                }, () => {
                    resolve(false);
                });
            }

            $('#dummy-modal-click').click();
        });

        return obj;
    })();

    public loading: any = (() => {
        let obj: any = {};

        obj.status = false;

        obj.show = async () => {
            obj.status = true;
        }

        obj.hide = async () => {
            obj.status = false;
        }

        return obj;
    })();

    public binding: any = (() => {
        let obj: any = {};

        obj.data = {};

        obj.bind = (options: any) => {
            let id = options.id;
            let data = options.data;
            obj.data[id] = data;
        }

        obj.load = (id: any) => {
            return obj.data[id];
        }

        return obj;
    })();

    public init: any = (() => {
        let obj: any = {};

        obj.editor = async (item: any, e: NuMonacoEditorEvent) => {
            for (let i = 0; i < this.shortcuts.length; i++) {
                let shortcut = this.shortcuts[i];
                e.editor.addCommand(shortcut.monaco, shortcut.command);
            }
            item.editor = e.editor;
            item.editor.focus();
        }

        return obj;
    })();

    public leftmenu: any = (() => {
        let obj: any = {};

        obj.mode = "page";
        obj.top = [];
        obj.bottom = [];

        obj.toggle = async (mode) => {
            if (obj.mode == mode) {
                obj.mode = null;
            } else {
                obj.mode = mode;
            }
            await this.event.render();
        }

        obj.build = async (top: any, bottom: any) => {
            obj.top = [];
            obj.bottom = [];

            for (let i = 0; i < top.length; i++)
                obj.top.push(top[i]);

            if (bottom)
                for (let i = 0; i < bottom.length; i++)
                    obj.bottom.push(bottom[i]);
            await this.ref.detectChanges();
        }

        return obj;
    })();

    public rightmenu: any = (() => {
        let obj: any = {};

        obj.mode = 'preview';
        obj.top = [];
        obj.bottom = [];

        obj.toggle = async (mode) => {
            if (obj.mode == mode) {
                obj.mode = null;
            } else {
                obj.mode = mode;
            }
            await this.event.render();
        }

        obj.build = async (top: any, bottom: any) => {
            obj.top = [];
            obj.bottom = [];

            for (let i = 0; i < top.length; i++)
                obj.top.push(top[i]);

            if (bottom)
                for (let i = 0; i < bottom.length; i++)
                    obj.bottom.push(bottom[i]);

            await this.ref.detectChanges();
        }

        return obj;
    })();

    public event: any = (() => {
        let obj: any = {};

        obj.render = async () => {
            this.ref.detectChanges();
        }

        obj.update = async () => {
            let current_app = this.editor.activated;
            if (!current_app) return;
            await this.editor.update(current_app);
        }

        obj.remove = async (item: any) => {
            if (!item) item = this.editor.activated;
            if (!item) return;
            let res = await this.alert.show({ title: 'Delete App', message: 'Are you sure remove "' + item.path + '"?', action_text: "Delete", action_class: "btn-danger" });
            if (res !== true) return;
            await this.editor.remove(item);
        }

        obj.log = async (value: any, tag = "ide") => {
            const Style = {
                base: [
                    "color: #fff",
                    "background-color: #444",
                    "padding: 2px 4px",
                    "border-radius: 2px"
                ],
                ide: [
                    "background-color: blue"
                ],
                server: [
                    "background-color: green"
                ]
            }

            if (tag == 'server') {
                let style = Style.base.join(';') + ';';
                style += Style.server.join(';');
                console.log(`%cwiz.was%c ` + value, style, null);
            } else {
                let style = Style.base.join(';') + ';';
                style += Style.ide.join(';');
                console.log(`%cwiz.ide%c`, style, null, value);
            }
        }

        obj.loading = this.loading;
        obj.leftmenu = this.leftmenu;
        obj.rightmenu = this.rightmenu;
        obj.binding = this.binding;
        obj.alert = this.alert;

        this.editor.bind(obj);
        return obj;
    })();

    public shortcuts: any = [];

    public async ngAfterViewInit() {
        // bind shortcuts
        this.shortcuts.push({
            key: ["cmd + s", "ctrl + s"],
            monaco: KeyMod.CtrlCmd | KeyCode.KeyS,
            preventDefault: true,
            command: async () => {
                await this.event.update();
            }
        }, {
            key: ["alt + a"],
            monaco: KeyMod.Alt | KeyCode.KeyA,
            preventDefault: true,
            command: async () => {
                if (!this.editor.activated) return;
                let target = this.editor.activated;
                let current = target.current;
                if (target.tabs[current - 1]) {
                    target.current = target.current - 1;
                } else {
                    target.current = target.tabs.length - 1;
                }
                await this.event.render();
            }
        }, {
            key: ["alt + s"],
            monaco: KeyMod.Alt | KeyCode.KeyS,
            preventDefault: true,
            command: async () => {
                if (!this.editor.activated) return;
                let target = this.editor.activated;
                let current = target.current;
                if (target.tabs[current + 1]) {
                    target.current = target.current + 1;
                } else {
                    target.current = 0;
                }
                await this.event.render();
            }
        }, {
            key: ["alt + w"],
            monaco: KeyMod.Alt | KeyCode.KeyW,
            preventDefault: true,
            command: async () => {
                await this.editor.close(this.editor.activated);
            }
        }, {
            key: ["alt + t"],
            monaco: KeyMod.Alt | KeyCode.KeyT,
            preventDefault: true,
            command: async () => {
                if (!this.editor.activated) return;
                let target = this.editor.activated;
                let location = this.editor.data.indexOf(target);
                let item = { ...target };
                item.editor_id = "editor-" + new Date().getTime();
                this.editor.data.splice(location, 0, item);
                await this.editor.active(this.editor.data[location + 1]);
                await this.event.render();
            }
        });

        // bind socket
        let socket = wiz.socket();

        socket.on("connect", async () => {
            socket.emit("join", { id: wiz.branch() });
        });

        socket.on("log", async (data) => {
            this.event.log(data, "server");
        });

    }

}
