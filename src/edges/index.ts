import type { Edge, EdgeTypes } from '@xyflow/react';
import DataEdge from './DataEdge';
import ControlEdge from './ControlEdge';

export type dataEdge = Edge<{outputName: string, value:string, offsetX:number, offsetY:number}, 'data'>;
export type controlEdge = Edge<{outputName: string, value:string}, 'control'>;
export type AppEdge = dataEdge | controlEdge;

export const initialEdges: AppEdge[] = [
  {
    id: 'clock-pc',
    source: 'clock',
    target: 'pc',
    sourceHandle: 'clk',
    targetHandle: 'clk',
  },
  {
    id: 'pc_addyadder',
    type: 'data',
    source: 'pc',
    target: 'addy-adder',
    sourceHandle: 'address',
    targetHandle: 'address',
    data: {value: '', outputName: 'address', offsetX: 15, offsetY: -200}
  },
  {
    id: 'addy-adder_addy-mux',
    type: 'data',
    source: 'addy-adder',
    target: 'addy-mux',
    sourceHandle: 'addy-adder-out',
    targetHandle: 'addy-adder-out',
    data: {value: '', outputName: 'out', offsetX: 15, offsetY: -30}
  },
  {
    id: 'addy-mux_pc',
    type: 'data',
    source: 'addy-mux',
    target: 'pc',
    sourceHandle: 'next-address',
    targetHandle: 'next-address',
    data: {value: '', outputName: 'out', offsetX: 15, offsetY: -70}
  },
  {
    id: 'pc_inst-mem',
    type: 'data',
    source: 'pc',
    target: 'inst-mem',
    sourceHandle: 'address',
    targetHandle: 'address',
    data: {value: '', outputName: 'address', offsetX: 15, offsetY: 0 },
  },
  {
    id: 'inst-mem_inst-decode',
    type: 'data',
    source: 'inst-mem',
    target: 'inst-decode',
    sourceHandle: 'instruction',
    targetHandle: 'instruction',
    data: {value: '', outputName: 'instruction', offsetX: 15, offsetY: 0}
  },
  {
    id: 'inst-decode_reg-list1',
    type: 'data',
    source: 'inst-decode',
    target: 'reg-list',
    sourceHandle: 'read-reg1',
    targetHandle: 'read-reg1',
    data: {value: '', outputName: 'readAddress1', offsetX: 15, offsetY: 0}
  },
  {
    id: 'inst-decode_reg-list2',
    type: 'data',
    source: 'inst-decode',
    target: 'reg-list',
    sourceHandle: 'read-reg2',
    targetHandle: 'read-reg2',
    data: {value: '', outputName: 'readAddress2', offsetX: 15, offsetY: 0}
  },
  {
    id: 'inst-decode_reg-list3',
    type: 'data',
    source: 'inst-decode',
    target: 'reg-list',
    sourceHandle: 'write-reg',
    targetHandle: 'write-reg',
    data: {value: '', outputName: 'writeAddress', offsetX: 15, offsetY: 0}
  },
  {
    id: 'reg-list_alu-mux',
    type: 'data',
    source: 'reg-list',
    target: 'alu-mux',
    sourceHandle: 'read-data2',
    targetHandle: 'read-data2',
    data: {value: '', outputName: 'readData2', offsetX: 15, offsetY: 0}
  },
  {
    id: 'inst-decode_alu-mux',
    type: 'data',
    source: 'inst-decode',
    target: 'alu-mux',
    sourceHandle: 'imm-val',
    targetHandle: 'imm-val',
    data: {value: '', outputName: 'immVal', offsetX: 45, offsetY: 40}
  },
  {
    id: 'reg-list_alu',
    type: 'data',
    source: 'reg-list',
    target: 'alu',
    sourceHandle: 'read-data1',
    targetHandle: 'read-data1',
    data: {value: '', outputName: 'readData1', offsetX: 15, offsetY: 0}
  },
  {
    id: 'alu-mux_alu',
    type: 'data',
    source: 'alu-mux',
    target: 'alu',
    sourceHandle: 'alu-mux-out',
    targetHandle: 'alu-mux-out',
    data: {value: '', outputName: 'out', offsetX: 5, offsetY: 0}
  },
  {
    id: 'inst-mem_control',
    type: 'data',
    source: 'inst-mem',
    target: 'control',
    sourceHandle: 'instruction',
    targetHandle: 'instruction',
    data: {value: '', outputName: 'instruction', offsetX: 15, offsetY: 0}
  },
  {
    id: 'control_reg-list',
    type: 'control',
    source: 'control',
    target: 'reg-list',
    sourceHandle: 'reg-write',
    targetHandle: 'reg-write',
    data: {value: '', outputName: 'regWrite'}
  },
  {
    id: 'control_alu-mux',
    type: 'control',
    source: 'control',
    target: 'alu-mux',
    sourceHandle: 'alu-src',
    targetHandle: 'alu-src',
    data: {value: '', outputName: 'aluSrc'}
  },
  {
    id: 'control_data-mux',
    type: 'control',
    source: 'control',
    target: 'data-mux',
    sourceHandle: 'mem-to-reg',
    targetHandle: 'mem-to-reg',
    data: {value: '', outputName: 'toReg',}
  },
  {
    id: 'control_data-mem1',
    type: 'control',
    source: 'control',
    target: 'data-mem',
    sourceHandle: 'mem-read',
    targetHandle: 'mem-read',
    data: {value: '', outputName: 'memRead',}
  },
  {
    id: 'control_data-mem2',
    type: 'control',
    source: 'control',
    target: 'data-mem',
    sourceHandle: 'mem-write',
    targetHandle: 'mem-write',
    data: {value: '', outputName: 'memWrite',}
  },
  {
    id: 'control_data-mem3',
    type: 'control',
    source: 'control',
    target: 'data-mem',
    sourceHandle: 'size',
    targetHandle: 'size',
    data: {value: '', outputName: 'size',}
  },
  {
    id: 'alu_data-mux',
    type: 'data',
    source: 'alu',
    target: 'data-mux',
    sourceHandle: 'alu-out',
    targetHandle: 'alu-out',
    data: {value: '', outputName: 'out', offsetX: 18, offsetY: -130}
  },
  {
    id: 'alu_data-mem',
    type: 'data',
    source: 'alu',
    target: 'data-mem',
    sourceHandle: 'alu-out',
    targetHandle: 'alu-out',
    data: {value: '', outputName: 'out', offsetX: 18, offsetY: -10}
  },
  {
    id: 'reg-list_data-mem',
    type: 'data',
    source: 'reg-list',
    target: 'data-mem',
    sourceHandle: 'read-data2',
    targetHandle: 'read-data2',
    data: {value: '', outputName: 'readData2', offsetX: 5, offsetY: 125}
  },
  {
    id: 'data-mem_data-mux',
    type: 'data',
    source: 'data-mem',
    target: 'data-mux',
    sourceHandle: 'read-data-mem',
    targetHandle: 'read-data-mem',
    data: {value: '', outputName: 'readDataMem', offsetX: 5, offsetY: 0}
  },
  {
    id: 'data-mux_reg-list',
    type: 'data',
    source: 'data-mux',
    target: 'reg-list',
    sourceHandle: 'write-data',
    targetHandle: 'write-data',
    data: {value: '', outputName: 'out', offsetX: 15, offsetY: 170}
  },
  {
    id: 'inst-decode_alu-control1',
    type: 'data',
    source: 'inst-decode',
    target: 'alu-control',
    sourceHandle: 'opcode',
    targetHandle: 'opcode',
    data: {value: '', outputName: 'opcode', offsetX: 33, offsetY: 193}
  },
  {
    id: 'inst-decode_alu-control2',
    type: 'data',
    source: 'inst-decode',
    target: 'alu-control',
    sourceHandle: 'funct3',
    targetHandle: 'funct3',
    data: {value: '', outputName: 'funct3', offsetX: 25, offsetY: 190}
  },
  {
    id: 'inst-decode_alu-control3',
    type: 'data',
    source: 'inst-decode',
    target: 'alu-control',
    sourceHandle: 'funct7',
    targetHandle: 'funct7',
    data: {value: '', outputName: 'funct7', offsetX: 16, offsetY: 190}
  },
  {
    id: 'alu-control_alu',
    type: 'data',
    source: 'alu-control',
    target: 'alu',
    sourceHandle: 'alu-code',
    targetHandle: 'alu-code',
    data: {value: '', outputName: 'aluCode', offsetX: 0, offsetY: 0}
  },
  {
    id: 'branch-control_addy-mux',
    type: 'data',
    source: 'branch-control',
    target: 'addy-mux',
    sourceHandle: 'branch-select',
    targetHandle: 'branch-select',
    data: {value: '', outputName: 'branchSelect', offsetX: 0, offsetY: 0}
  },
  {
    id: 'alu_branch-control',
    type: 'data',
    source: 'alu',
    target: 'branch-control',
    sourceHandle: 'alu-zero',
    targetHandle: 'alu-zero',
    data: {value: '', outputName: 'zero', offsetX: 12, offsetY: -270}
  },
  {
    id: 'alu_branch-control1',
    type: 'data',
    source: 'alu',
    target: 'branch-control',
    sourceHandle: 'alu-sign',
    targetHandle: 'alu-sign',
    data: {value: '', outputName: 'sign', offsetX: 16, offsetY: -290}
  },
  {
    id: 'control_branch-control',
    type: 'control',
    source: 'control',
    target: 'branch-control',
    sourceHandle: 'branch',
    targetHandle: 'branch',
    data: {value: '', outputName: 'branch',}
  },
  {
    id: 'control_jump-mux',
    type: 'control',
    source: 'control',
    target: 'jump-mux',
    sourceHandle: 'jump',
    targetHandle: 'jump',
    data: {value: '', outputName: 'jump',}
  },
  {
    id: 'jump-mux_branch-adder',
    type: 'data',
    source: 'jump-mux',
    target: 'branch-adder',
    sourceHandle: 'jump-mux-out',
    targetHandle: 'jump-mux-out',
    data: {value: '', outputName: 'out', offsetX: 30, offsetY: 0}
  },
  {
    id: 'pc_branch-adder',
    type: 'data',
    source: 'pc',
    target: 'branch-adder',
    sourceHandle: 'address',
    targetHandle: 'address',
    data: {value: '', outputName: 'address', offsetX: 15, offsetY: -200}
  },
  {
    id: 'branch-adder_addy-mux',
    type: 'data',
    source: 'branch-adder',
    target: 'addy-mux',
    sourceHandle: 'branch-adder-out',
    targetHandle: 'branch-adder-out',
    data: {value: '', outputName: 'out', offsetX: 30, offsetY: 0}
  },
  {
    id: 'inst-decode_jump-mux',
    type: 'data',
    source: 'inst-decode',
    target: 'jump-mux',
    sourceHandle: 'imm-val',
    targetHandle: 'imm-val',
    data: {value: '', outputName: 'immVal', offsetX: 45, offsetY: -470}
  },
  {
    id: 'alu_jump-mux',
    type: 'data',
    source: 'alu',
    target: 'jump-mux',
    sourceHandle: 'alu-out',
    targetHandle: 'alu-out',
    data: {value: '', outputName: 'out', offsetX: 18, offsetY: -300}
  },
  {
    id: 'alu_data-mux1',
    type: 'data',
    source: 'alu',
    target: 'data-mux',
    sourceHandle: 'alu-sign',
    targetHandle: 'alu-sign',
    data: {value: '', outputName: 'sign', offsetX: 15, offsetY: -70}
  },
  {
    id: 'addy-adder_data-mux',
    type: 'data',
    source: 'addy-adder',
    target: 'data-mux',
    sourceHandle: 'addy-adder-out',
    targetHandle: 'addy-adder-out',
    data: {value: '', outputName: 'out', offsetX: 15, offsetY: 600}
  },
  {
    id: 'inst-decode_data-mux',
    type: 'data',
    source: 'inst-decode',
    target: 'data-mux',
    sourceHandle: 'imm-val',
    targetHandle: 'imm-val',
    data: {value: '', outputName: 'immVal', offsetX: 45, offsetY: 80}
  },
];

export const edgeTypes = {
  'data': DataEdge,
  'control': ControlEdge
} satisfies EdgeTypes;
