import { AppComponent } from './app.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NuMonacoEditorModule } from '@ng-util/monaco-editor';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        '@wiz.declarations'
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NuMonacoEditorModule.forRoot(),
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.cubeGrid,
            backdropBackgroundColour: "rgba(0,0,0,0.1)",
            primaryColour: "#3843D0",
            secondaryColour: "#3843D0",
            tertiaryColour: "#3843D0",
        }),
        KeyboardShortcutsModule.forRoot(),
        NgbModule,
        '@wiz.imports'
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }