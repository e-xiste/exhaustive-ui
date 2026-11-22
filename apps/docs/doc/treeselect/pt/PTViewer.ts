import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from '@exhaustive-ui/core/api';
import { TreeSelectModule } from '@exhaustive-ui/core/treeselect';
import { NodeService } from '@/service/nodeservice';

@Component({
    selector: 'treeselect-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, TreeSelectModule, FormsModule],
    providers: [NodeService],
    template: `
        <app-docptviewer [docs]="docs">
            <p-tree-select [(ngModel)]="selectedNodes" [options]="nodes" selectionMode="checkbox" [filter]="true" [showClear]="true" placeholder="Select Item" class="md:w-80 w-full"> </p-tree-select>
        </app-docptviewer>
    `
})
export class PTViewer implements OnInit {
    selectedNodes: TreeNode | null = null;

    nodes: TreeNode[] | undefined;

    docs = [{ data: getPTOptions('TreeSelect'), key: 'TreeSelect' }];

    constructor(private nodeService: NodeService) {}

    ngOnInit() {
        this.nodeService.getFiles().then((files) => (this.nodes = files));
    }
}
