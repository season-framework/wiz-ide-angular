import { AfterViewInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';

export class Component implements AfterViewInit {
    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
    @Input() scope;
    @Input() item;
    @Input() tab;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    public async ngAfterViewInit() {
        let componentClass = this.tab.viewref;
        if (!componentClass) return;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
        const component = this.container.createComponent(componentFactory);
        component.instance.scope = this.scope;
        component.instance.item = this.item;
        component.instance.tab = this.tab;
        await this.scope.render();
    }
}