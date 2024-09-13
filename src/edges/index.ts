import type { Edge, EdgeTypes } from '@xyflow/react';
import DataEdge from './DataEdge';
import ControlEdge from './ControlEdge';

export type dataEdge = Edge<{outputName: string, value:string}, 'data'>;
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
    data: {value: '', outputName: 'address'}
  },
  {
    id: 'addy-adder_addy-mux',
    type: 'data',
    source: 'addy-adder',
    target: 'addy-mux',
    sourceHandle: 'addy-adder-out',
    targetHandle: 'addy-adder-out',
    data: {value: '', outputName: 'out'}
  },
  {
    id: 'addy-mux_pc',
    type: 'data',
    source: 'addy-mux',
    target: 'pc',
    sourceHandle: 'next-address',
    targetHandle: 'next-address',
    data: {value: '', outputName: 'out'}
  },
  {
    id: 'pc_inst-mem',
    type: 'data',
    source: 'pc',
    target: 'inst-mem',
    sourceHandle: 'address',
    targetHandle: 'address',
    data: {value: '', outputName: 'address'} 
  },
  {
    id: 'inst-mem_inst-decode',
    type: 'data',
    source: 'inst-mem',
    target: 'inst-decode',
    sourceHandle: 'instruction',
    targetHandle: 'instruction',
    data: {value: '', outputName: 'instruction'}
  },
  {
    id: 'inst-decode_reg-list1',
    type: 'data',
    source: 'inst-decode',
    target: 'reg-list',
    sourceHandle: 'read-reg1',
    targetHandle: 'read-reg1',
    data: {value: '', outputName: 'readAddress1'}
  },
  {
    id: 'inst-decode_reg-list2',
    type: 'data',
    source: 'inst-decode',
    target: 'reg-list',
    sourceHandle: 'read-reg2',
    targetHandle: 'read-reg2',
    data: {value: '', outputName: 'readAddress2'}
  },
  {
    id: 'inst-decode_reg-list3',
    type: 'data',
    source: 'inst-decode',
    target: 'reg-list',
    sourceHandle: 'write-reg',
    targetHandle: 'write-reg',
    data: {value: '', outputName: 'writeAddress'}
  },
  {
    id: 'reg-list_alu-mux',
    type: 'data',
    source: 'reg-list',
    target: 'alu-mux',
    sourceHandle: 'read-data2',
    targetHandle: 'read-data2',
    data: {value: '', outputName: 'readData2'}
  },
  {
    id: 'inst-decode_alu-mux',
    type: 'data',
    source: 'inst-decode',
    target: 'alu-mux',
    sourceHandle: 'imm-val',
    targetHandle: 'imm-val',
    data: {value: '', outputName: 'immVal'}
  },
  {
    id: 'reg-list_alu',
    type: 'data',
    source: 'reg-list',
    target: 'alu',
    sourceHandle: 'read-data1',
    targetHandle: 'read-data1',
    data: {value: '', outputName: 'readData1'}
  },
  {
    id: 'alu-mux_alu',
    type: 'data',
    source: 'alu-mux',
    target: 'alu',
    sourceHandle: 'alu-mux-out',
    targetHandle: 'alu-mux-out',
    data: {value: '', outputName: 'out'}
  },
  {
    id: 'inst-mem_control',
    type: 'data',
    source: 'inst-mem',
    target: 'control',
    sourceHandle: 'instruction',
    targetHandle: 'instruction',
    data: {value: '', outputName: 'instruction'}
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
    data: {value: '', outputName: 'aluSrc'},
  },
  {
    id: 'control_data-mux',
    type: 'control',
    source: 'control',
    target: 'data-mux',
    sourceHandle: 'mem-to-reg',
    targetHandle: 'mem-to-reg',
    data: {value: '', outputName: 'memToReg'}
  },
  {
    id: 'control_data-mem1',
    type: 'control',
    source: 'control',
    target: 'data-mem',
    sourceHandle: 'mem-read',
    targetHandle: 'mem-read',
    data: {value: '', outputName: 'memRead'}
  },
  {
    id: 'control_data-mem2',
    type: 'control',
    source: 'control',
    target: 'data-mem',
    sourceHandle: 'mem-write',
    targetHandle: 'mem-write',
    data: {value: '', outputName: 'memWrite'}
  },
  {
    id: 'control_data-mem3',
    type: 'control',
    source: 'control',
    target: 'data-mem',
    sourceHandle: 'size',
    targetHandle: 'size',
    data: {value: '', outputName: 'size'}
  },
  {
    id: 'alu_data-mux',
    type: 'data',
    source: 'alu',
    target: 'data-mux',
    sourceHandle: 'alu-out',
    targetHandle: 'alu-out',
    data: {value: '', outputName: 'out'}
  },
  {
    id: 'alu_data-mem',
    type: 'data',
    source: 'alu',
    target: 'data-mem',
    sourceHandle: 'alu-out',
    targetHandle: 'alu-out',
    data: {value: '', outputName: 'out'}
  },
  {
    id: 'reg-list_data-mem',
    type: 'data',
    source: 'reg-list',
    target: 'data-mem',
    sourceHandle: 'read-data2',
    targetHandle: 'read-data2',
    data: {value: '', outputName: 'readData2'}
  },
  {
    id: 'data-mem_data-mux',
    type: 'data',
    source: 'data-mem',
    target: 'data-mux',
    sourceHandle: 'read-data-mem',
    targetHandle: 'read-data-mem',
    data: {value: '', outputName: 'readDataMem'}
  },
  {
    id: 'data-mux_reg-list',
    type: 'data',
    source: 'data-mux',
    target: 'reg-list',
    sourceHandle: 'write-data',
    targetHandle: 'write-data',
    data: {value: '', outputName: 'out'}
  },
  {
    id: 'inst-decode_alu-control1',
    type: 'data',
    source: 'inst-decode',
    target: 'alu-control',
    sourceHandle: 'opcode',
    targetHandle: 'opcode',
    data: {value: '', outputName: 'opcode'}
  },
  {
    id: 'inst-decode_alu-control2',
    type: 'data',
    source: 'inst-decode',
    target: 'alu-control',
    sourceHandle: 'funct3',
    targetHandle: 'funct3',
    data: {value: '', outputName: 'funct3'}
  },
  {
    id: 'inst-decode_alu-control3',
    type: 'data',
    source: 'inst-decode',
    target: 'alu-control',
    sourceHandle: 'funct7',
    targetHandle: 'funct7',
    data: {value: '', outputName: 'funct7'}
  },
  {
    id: 'alu-control',
    type: 'data',
    source: 'alu-control',
    target: 'alu',
    sourceHandle: 'alu-code',
    targetHandle: 'alu-code',
    data: {value: '', outputName: 'aluCode'}
  },
];

export const edgeTypes = {
  'data': DataEdge,
  'control': ControlEdge
} satisfies EdgeTypes;
