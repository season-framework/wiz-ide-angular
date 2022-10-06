import { FlatTreeControl } from '@angular/cdk/tree';
import { FileNode, FileDataSource } from './service';

import { OnInit, Input } from '@angular/core';
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


@dependencies({
    MatTreeModule: '@angular/material/tree'
})
export class Component implements OnInit {
    @Input() scope: any;
    @Input() title: string = "Files";
    @Input() path: string;

    public APP_ID: string = wiz.namespace;
    public loading: boolean = false;
    public rootNode: FileNode;

    private treeControl: FlatTreeControl<FileNode>;
    private dataSource: FileDataSource;
    private getLevel = (node: FileNode) => node.level;
    private isExpandable = (node: FileNode) => node.type == 'folder';
    private isFolder = (_: number, node: FileNode) => node.type == 'folder';
    private isNew = (_: number, node: FileNode) => node.type == 'new.folder' || node.type == 'new.file';

    public async list(node: FileNode) {
        let { code, data } = await wiz.call("list", { path: node.path });
        data = data.map(item => new FileNode(item.name, item.path, item.type, node, node.level + 1));
        data.sort((a, b) => {
            if (a.type == b.type)
                return a.path.localeCompare(b.path);
            if (a.type == 'folder') return -1;
            if (b.type == 'folder') return 1;
        });
        return data;
    }

    public async open(node: FileNode) {
        console.log(node);
    }

    public async download(node: FileNode) {
        console.log(node);
    }

    public async upload(node: FileNode | null) {
    }

    public async move(node: FileNode) {
        let { name, rename, path } = node;
        if (name == rename) {
            node.editable = false;
            return;
        }

        let to: any = path.split("/");
        to[to.length - 1] = rename;
        to = to.join("/");
        let parent_path = to.split("/").slice(0, to.split("/").length - 1).join("/");

        let { code } = await wiz.call("move", { path, to });

        if (code !== 200) {
            toastr.error("Error on change path");
            return;
        }

        node.parent = null;
        for (let i = 0; i < this.dataSource.data.length; i++) {
            if (this.dataSource.data[i].path == parent_path) {
                node.parent = this.dataSource.data[i];
                break;
            }
        }

        await this.dataSource.delete(node);
        await this.refresh(node);
    }

    public async delete(node: FileNode) {
        if (node.type != "new.folder" && node.type != "new.file") {
            let res = await this.scope.alert.show({ title: 'Delete', message: 'Are you sure to delete?', action_text: "Delete", action_class: "btn-danger" });
            if (!res) return;
            await wiz.call("delete", { path: node.path });
        }
        await this.dataSource.delete(node);
    }

    public async create(node: FileNode | null, type: any) {
        if (!node) {
            let newitem = new FileNode('', this.rootNode.path, 'new.' + type);
            await this.dataSource.prepend(newitem, null);
            return;
        }

        if (node.type == "new.folder" || node.type == "new.file") {
            let type = node.type.split(".")[1];
            let path = node.path + "/" + node.name;
            let { code } = await wiz.call("create", { type, path });

            if (code != 200) {
                toastr.error("invalid filename");
                return;
            }

            await this.dataSource.delete(node);
            await this.refresh(node);
        } else {
            if (!this.treeControl.isExpanded(node))
                await this.dataSource.toggle(node, true);
            let newitem = new FileNode('', node.path, 'new.' + type, node);
            await this.dataSource.prepend(newitem, node);
        }
    }

    public async refresh(node: FileNode | null = null) {
        if (node && node.parent) {
            await this.dataSource.toggle(node.parent, false);
            await this.dataSource.toggle(node.parent, true);
        } else {
            let data = await this.list(this.rootNode);
            this.dataSource.data = data;
        }
    }

    public async loader(status) {
        this.loading = status;
        await this.scope.render();
    }

    public async ngOnInit() {
        this.rootNode = new FileNode('root', this.path, 'folder');
        this.treeControl = new FlatTreeControl<FileNode>(this.getLevel, this.isExpandable);
        this.dataSource = new FileDataSource(this);
        let data = await this.list(this.rootNode);
        this.dataSource.data = data;
    }
}