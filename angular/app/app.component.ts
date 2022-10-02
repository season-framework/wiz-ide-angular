import { Component, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import Editor from '@wiz/service/editor';
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
    @ViewChild('sideContainer', { read: ViewContainerRef }) sideContainer: ViewContainerRef;

    public isdev = wiz.dev();

    constructor(private editor: Editor, private ref: ChangeDetectorRef) {
    }

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

        this.editor.bind(obj);
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

    public branch: any = (() => {
        let obj: any = {};
        obj.current = wiz.branch();
        return obj;
    })();

    public leftmenu: any = (() => {
        let obj: any = {};

        obj.mode = "page";

        obj.toggle = async (mode) => {
            if (obj.mode == mode) {
                obj.mode = null;
            } else {
                obj.mode = mode;
            }
            await this.event.render();
        }

        return obj;
    })();

    // obj.add = async (componentClass: Type<any>) => {
    //     const container = this.editorContainer;
    //     const component = container.createComponent(componentClass);
    //     component.location.nativeElement.style = "width: 100%; flex: 1;";

    //     component.instance.close = async () => {
    //         await obj.close(component);
    //     }
    // }

    // obj.close = async (component: any) => {
    //     const container = this.editorContainer;
    //     console.log(component, container.indexOf(component))
    //     // container.remove(container.indexOf(component));
    // }

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
            console.log(data);
        });

    }

}
