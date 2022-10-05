import { AfterViewInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';

export class Component implements AfterViewInit {
    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
    @Input() scope;
    @Input() editor;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    public async ngAfterViewInit() {
        let componentClass = this.editor.tab().viewref;
        if (!componentClass) return;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
        const component = this.container.createComponent(componentFactory);
        component.instance.scope = this.scope;
        component.instance.editor = this.editor;
        await this.scope.render();
    }
}