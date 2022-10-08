import $ from 'jquery';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import EditorManager from '@wiz/service/editor';

import AlertComponent from "@wiz/app/core.alert";
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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    constructor(public editorManager: EditorManager, private ref: ChangeDetectorRef, public modalService: NgbModal) {
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

                const modalRef = this.modalService.open(AlertComponent, { size: 'sm' });
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
            await this.scope.render();
        }

        obj.hide = async () => {
            obj.status = false;
            await this.scope.render();
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
            await this.scope.render();
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

        obj.mode = 'project';
        obj.top = [];
        obj.bottom = [];
        obj.width = 360;

        obj.toggle = async (item: any) => {
            if (!item) {
                obj.mode = null;
            } else if (obj.mode == item.id) {
                obj.mode = null;
            } else {
                obj.mode = item.id;
                if (item.width) obj.width = item.width;
                else obj.width = 360;
            }
            await this.scope.render();
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

    public scope: any = (() => {
        let obj: any = {};

        obj.render = async () => {
            this.ref.detectChanges();
        }

        obj.update = async () => {
            let current_app = this.editorManager.activated;
            if (!current_app) return;
            await current_app.update();
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

        this.editorManager.bind(obj);
        return obj;
    })();

    public async ngAfterViewInit() {
        // bind socket
        let socket = wiz.socket();

        socket.on("connect", async () => {
            socket.emit("join", { id: wiz.branch() });
        });

        socket.on("log", async (data) => {
            this.scope.log(data, "server");
        });

        window.addEventListener("beforeunload", function (e) {
            var confirmationMessage = "\o/";
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        });
    }

}
