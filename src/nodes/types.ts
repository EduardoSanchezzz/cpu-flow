import type { Node, BuiltInNode } from '@xyflow/react';

export type PositionLoggerNode = Node<{ label: string, value: number }, 'position-logger'>;
export type AppNode = BuiltInNode | PositionLoggerNode | testReadNode |
TextNode | ResultNode | UppercaseNode | PCNode | AdderNode | ClockNode | AddyAdderNode|
AddyMuxNode;


export type testReadNode = Node<{ label: string, value: number }, 'testReadNode'>;

export type ResultNode = Node<{}, 'result'>;
export type UppercaseNode = Node<{ text: string }, 'uppercase'>;

// add type and istype
export type TextNode = Node<{ text: string }, 'text'>;
export function isTextNode(node: any): node is TextNode | UppercaseNode {
  return node.type === 'text' || node.type === 'uppercase';
}
export type TextNode1 = Node<{ text: string }, 'text1'>;
export function isTextNode1(node: any): node is UppercaseNode {
  return node.type === 'uppercase';
}

export type PCNode = Node<{label: string, address: number}, 'pc'>;
export function isPCNode(node: any): node is PCNode {
    return node.type === 'pc';
}
export type AdderNode = Node<{label: string, out: number}, 'Adder'>;
export function isAdderNode(node: any): node is AdderNode {
    return node.type === 'Adder';
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
