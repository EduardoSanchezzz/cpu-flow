import type { Node, BuiltInNode } from '@xyflow/react';

export type AppNode = BuiltInNode | PCNode | ClockNode | AddyAdderNode|
AddyMuxNode | InstMemNode | InstDecodeNode | RegListNode | AluMuxNode |
AluNode | ControlNode | DataMuxNode | AluControlNode | DataMemNode | DisplayNode |
InstDisplayNode | BranchControlNode | TitleNode | JumpMuxNode | BranchAdderNode;

export type PCNode = Node<{label: string, address: string}, 'pc'>;
export function isPCNode(node: any): node is PCNode {
    return node.type === 'pc';
}

export type AddyAdderNode = Node<{out: string}, 'addy-adder'>;
export function isAddyAdderNode(node: any): node is AddyAdderNode {
    return node.type === 'addy-adder';
}

export type AddyMuxNode = Node<{out: string}, 'addy-mux'>;
export function isAddyMuxNode(node: any): node is AddyMuxNode {
    return node.type === 'addy-mux';
}

export type ClockNode = Node<{label: string, clk: number, step: number}, 'clock'>;
export function isClockNode(node: any): node is ClockNode {
    return node.type === 'clock';
}

export type InstMemNode = Node<{label: string, instruction: string, instructions: number[]}, 'inst-mem'>;
export function isInstMemNode(node:any): node is InstMemNode {
  return node.type === 'inst-mem';
}

export type InstDecodeNode = Node<{
  label: string, 
  readAddress1: string,
  readAddress2: string,
  writeAddress: string,
  opcode: string,
  funct3: string,
  funct7: string,
  immVal: string,
}, 'inst-decode'>;
export function isInstDecodeNode(node:any): node is InstDecodeNode {
  return node.type === 'inst-decode';
}

export type RegListNode = Node<{
  label: string, 
  readData1: string,
  readData2: string,
  regList: number[],
}, 'reg-list'>;
export function isRegListNode(node:any): node is RegListNode {
  return node.type === 'reg-list';
}

export type AluMuxNode = Node<{out: string}, 'alu-mux'>;
export function isAluMuxNode(node: any): node is AluMuxNode {
    return node.type === 'alu-mux';
}
export type AluNode = Node<{out: string, zero: string, sign: string}, 'alu'>;
export function isAluNode(node: any): node is AluNode {
    return node.type === 'alu';
}

export type ControlNode = Node<{
  label: string, 
  branch: string,
  regWrite: string,
  memRead: string,
  toReg: string,
  memWrite: string,
  size: string,
  aluSrc: string,
  jump: string,
}, 'control'>;
export function isControlNode(node:any): node is ControlNode {
  return node.type === 'control';
}
export type DataMuxNode = Node<{out: string}, 'data-mux'>;
export function isDataMuxNode(node: any): node is DataMuxNode {
    return node.type === 'data-mux';
}
export type AluControlNode = Node<{label:string, aluCode: string}, 'alu-control'>;
export function isAluControlNode(node: any): node is AluControlNode {
    return node.type === 'alu-control';
}

export type DataMemNode = Node<{label:string, readDataMem: string, dataMem: string[]}, 'data-mem'>;
export function isDataMemNode(node: any): node is DataMemNode {
    return node.type === 'data-mem';
}
export type BranchControlNode = Node<{label:string, branchSelect: string,}, 'branch-control'>;
export function isBranchControlNode(node: any): node is BranchControlNode {
    return node.type === 'branch-control';
}
export type JumpMuxNode = Node<{out: string,}, 'jump-mux'>;
export function isJumpMuxNode(node: any): node is JumpMuxNode {
    return node.type === 'jump-mux';
}
export type TitleNode = Node<{}, 'title'>;

export type BranchAdderNode = Node<{out: string,}, 'branch-adder'>;
export function isBranchAdderNode(node: any): node is BranchAdderNode {
    return node.type === 'branch-adder';
}
export type DisplayNode = Node<{}, 'display'>;
export type InstDisplayNode = Node<{}, 'inst-display'>;


// {structure of data in initialization}, 'name of type' - need to update node types in index too


/*
STEPS:
1) types.ts add type and is type function perhaps is input type function | add to App Node
2)index.ts add to nodetypes and import node
3) copy template and add props
4) add edges



*/
