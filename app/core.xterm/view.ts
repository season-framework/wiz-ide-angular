import { OnInit, ElementRef, ViewChild } from '@angular/core';
import { Service } from '@wiz/service/service';
import { io } from "socket.io-client";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { WebLinksAddon } from 'xterm-addon-web-links';

export class Component implements OnInit {
    @ViewChild('terminal')
    public terminal: ElementRef;

    public APP_ID: string = wiz.namespace;

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.render();
        await this.service.render(1000);
        await this.service.render();

        const term = new Terminal({
            cursorBlink: true,
            macOptionIsMeta: true,
            scrollback: true,
        });
        term.attachCustomKeyEventHandler(customKeyEventHandler);
        const fit = new FitAddon();
        term.loadAddon(fit);
        term.loadAddon(new WebLinksAddon());
        term.loadAddon(new SearchAddon());

        term.open(this.terminal.nativeElement);
        term.writeln("Welcome to wiz.term!");
        term.writeln("You can copy with ctrl+shift+x");
        term.writeln("You can paste with ctrl+shift+v");
        term.writeln('')
        term.onData((data) => {
            socket.emit("ptyinput", { input: data });
        });

        const socket = io.connect("/wiz/ide/app/core.xterm");

        socket.on("ptyoutput", function (data) {
            term.write(data.output);
        });

        socket.on("connect", () => {
            fitToscreen();
        });

        socket.on("disconnect", () => {
        });

        function fitToscreen() {
            fit.fit();
            const dims = { cols: term.cols, rows: term.rows };
            socket.emit("resize", dims);
        }

        function customKeyEventHandler(e) {
            if (e.type !== "keydown") {
                return true;
            }
            if (e.ctrlKey && e.shiftKey) {
                const key = e.key.toLowerCase();
                if (key === "v") {
                    navigator.clipboard.readText().then((toPaste) => {
                        term.writeText(toPaste);
                    });
                    return false;
                } else if (key === "c" || key === "x") {
                    const toCopy = term.getSelection();
                    navigator.clipboard.writeText(toCopy);
                    term.focus();
                    return false;
                }
            }
            return true;
        }
    }
}