import type { Node, BuiltInNode } from '@xyflow/react';

export type AppNode = BuiltInNode | PCNode | ClockNode | AddyAdderNode|
AddyMuxNode;

export type PCNode = Node<{label: string, address: number}, 'pc'>;
export function isPCNode(node: any): node is PCNode {
    return node.type === 'pc';
}

export type AddyAdderNode = Node<{out: number}, 'addy-adder'>;
export function isAddyAdderNode(node: any): node is AddyAdderNode {
    return node.type === 'addy-adder';
}

export type AddyMuxNode = Node<{out: number}, 'addy-mux'>;
export function isAddyMuxNode(node: any): node is AddyMuxNode {
    return node.type === 'addy-mux';
}

export type ClockNode = Node<{label: string, clk: number}, 'Clock'>;
export function isClockNode(node: any): node is ClockNode {
    return node.type === 'Clock';
}
// {structure of data in initialization}, 'name of type' - need to update node types in index too


/*
STEPS:
1) types.ts add type and is type function perhaps is input type function | add to App Node
2)index.ts add to nodetypes and import node
3) copy template and add props
4) add edges



*/
