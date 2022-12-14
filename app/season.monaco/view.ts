import { OnInit, Input } from '@angular/core';
import { Service } from '@wiz/service/service';

export class Component implements OnInit {
    @Input() editor;

    public loading: boolean = true;
    public data: any = {};

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.loader(true);
        this.data = await this.editor.tab().data();
        await this.loader(false);
    }

    public async loader(status) {
        this.loading = status;
        await this.service.render();
    }

    private monacoRecommend() {
        const createTypescriptRecommend = (range) => {
            return [
                {
                    label: 'import.wiz.libs',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'import wiz libs',
                    insertText: '${1} from "\@wiz/libs/${2}";',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: 'import.wiz.libs.service',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'import wiz\/libs\/season\/service',
                    insertText: `{ Service } from "\@wiz/libs/season/service";`,
                    range,
                },
                {
                    label: 'wiz\.call',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'wiz\.call function',
                    insertText: 'const \{ code, data \} \= await wiz\.call("${1:apiName}", ${2});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: 'wiz\.socket',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'wiz\.socket function',
                    insertText: 'const socketio \= wiz\.socket();',
                    range,
                },
                {
                    label: 'import.toastr',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'import toastr from "toastr";',
                    insertText: 'toastr from "toastr";',
                    range,
                },
                {
                    label: 'public.service',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'public service: Service,',
                    insertText: 'service\: Service,',
                    range,
                },
                {
                    label: 'public.change.detector.ref',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'public ref: ChangeDetectorRef,',
                    insertText: 'ref\: ChangeDetectorRef,',
                    range,
                },
                {
                    label: 'import.destructure',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'import destructured package',
                    insertText: '\{ ${1} \} from "${2}";',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: 'import.default',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'import default package',
                    insertText: '${1} from "${2}";',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
            ];
        }

        const createPugRecommend = (range) => {
            return [
                {
                    label: 'ngFor',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: '*ngFor custom snippet',
                    insertText: '\*ngFor="let ${1} of ${2};let i \= index"',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: 'ngIf',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: '*ngIf custom snippet',
                    insertText: '\*ngIf="${1}"',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: '[(ngModel)]',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'ngModel custom snippet',
                    insertText: '[(ngModel)]="${1}"',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: '(ngClick)',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'ngClick custom snippet',
                    insertText: '(click)="${1}"',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: '(ngChange)',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'ngChange custom snippet',
                    insertText: '(change)="${1}"',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: 'routerLink',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'insert text `routerLink=""`',
                    insertText: 'routerLink="${1}",${2}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: 'routerLinkVariable',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'insert text `[routerLink]=""`',
                    insertText: '[routerLink]="${1}",${2}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: 'routerLinkActive',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'insert text `routerLinkActive=""`',
                    insertText: 'routerLinkActive="${1}",${2}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
                {
                    label: 'routerLinkActiveVariable',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'insert text `[routerLinkActive]="",`',
                    insertText: '[routerLinkActive]="${1}",${2}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                },
            ];
        }

        monaco.languages.registerCompletionItemProvider('typescript', {
            provideCompletionItems: function (model, position) {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });
                const t = textUntilPosition.split("\n").slice(-1)[0];
                const wizmatch = t.match(/wiz/);
                const importmatch = t.match(/^import/);
                const publicmatch = t.match(/public/);
                if (!wizmatch && !importmatch && !publicmatch) {
                    return { suggestions: [] };
                }
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };
                return {
                    suggestions: createTypescriptRecommend(range),
                };
            }
        });
        monaco.languages.registerCompletionItemProvider('pug', {
            provideCompletionItems: function (model, position) {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });
                const t = textUntilPosition.split("\n").slice(-1)[0];
                const ngmatch = t.match(/ng/);
                const routermatch = t.match(/router/);
                if (!ngmatch && !routermatch) {
                    return { suggestions: [] };
                }
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };
                return {
                    suggestions: createPugRecommend(range),
                };
            }
        });
    }

    public async init(e) {
        let editor = this.editor;
        for (let i = 0; i < this.service.shortcuts.length; i++) {
            let shortcut = this.service.shortcuts[i];
            e.editor.addCommand(shortcut.monaco, shortcut.command);
        }
        if (!window.monacoWIZRecommend) {
            this.monacoRecommend();
            window.monacoWIZRecommend = true;
        }

        editor.meta.monaco = e.editor;
        editor.meta.monaco.focus();
    }
}