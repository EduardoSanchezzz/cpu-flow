import type { NodeTypes } from '@xyflow/react';

import { AppNode } from './types';
import PC from './PC';
import Clock from './Clock';
import AddyAdder from './AddyAdder';
import AddyMux from './AddyMux';
import InstMem from './InstMem';
import InstDecode from './InstDecode';
import RegList from './RegList';
import AluMux from './AluMux';
import Alu from './Alu';
import Control from './Control';
import DataMux from './DataMux';
import AluControl from './AluControl';
import DataMem from './DataMem';
import Display from './Display';
import InstDisplay from './InstDisplay';
import BranchControl from './BranchControl';
import BranchAdder from './BranchAdder';
import JumpMux from './JumpMux';
import Title from './Title';

const INSTRUCTIONS = [
  0b0000000_00001_00000_000_00010_0110011, //add x0 + x1 to x2
  0b0000_0000_1100_00100_000_00111_0000011, //load mem[x4 + 12] = mem[16] into x7 1 byte
  0b0000_000_00000_01000_000_00000_0100011, //stores value from x0 into mem[x8 + 0] = mem[8]
]
const REGLIST = [
  0,1,2,3,4,5,6,7,
  8,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
]
const DATAMEM = [
  '0', '1', '2', '3', '4', '5', '6', '7',
  '0', '1', '2', '3', '4', '5', '6', '7',
  '0', '1', '2', '3', '4', '5', '6', '7',
  '0', '1', '2', '3', '4', '5', '6', '7',
]

export const initialNodes: AppNode[] = [
  {
    id: 'clock',
    type: 'clock',
    data: { label: 'Clock', clk: 0, step:-1 },
    position: { x: 1200, y: 0 },
  },
  {
    id: 'pc',
    type: 'pc',
    data: { label: 'Program Counter', address: 'x' },
    position: { x: 0, y: 314 },
  },
  {
    id: 'addy-adder',
    type: 'addy-adder',
    data: { out: 'x' },
    position: { x: 146, y: 0 },
  },
  {
    id: 'addy-mux',
    type: 'addy-mux',
    data: { out: '0' },
    position: { x: 1100, y: 0 },
  },
  {
    id: 'inst-mem',
    type: 'inst-mem',
    data: { label: 'Instruction Memory', instruction: 'x', instructions: INSTRUCTIONS },
    position: { x: 140, y: 300 },
  },
  {
    id: 'inst-decode',
    type: 'inst-decode',
    data: { label: 'Instruction Decode',
      readAddress1: 'x',
      readAddress2: 'x',
      writeAddress: 'x',
      opcode: 'x',
      funct3: 'x',
      funct7: 'x' ,
      immVal: 'x',
     },
    position: { x: 320, y: 400 },
  },
  {
    id: 'reg-list',
    type: 'reg-list',
    data: { label: 'Register List',
      readData1: 'x',
      readData2: 'x',
      regList: REGLIST,
     },
    position: { x: 540, y: 400 },
  },
  {
    id: 'alu-mux',
    type: 'alu-mux',
    data: { out: 'x' },
    position: { x: 700, y: 500 },
  },
  {
    id: 'alu',
    type: 'alu',
    data: { out: 'x', zero: 'x', sign: 'x' },
    position: { x: 770, y: 400 },
  },

  {
    id: 'control',
    type: 'control',
    data: { label: 'Control Unit',
      aluSrc: 'x',
      memRead: 'x',
      toReg: 'x',
      memWrite: 'x',
      regWrite: 'x',
      size: 'x' ,
      branch: 'x',
      jump: 'x',
     },
    position: { x: 320, y: 150 },
  },
  {
    id: 'data-mux',
    type: 'data-mux',
    data: { out: 'x' },
    position: { x: 1120, y: 400 },
  },
  {
    id: 'alu-control',
    type: 'alu-control',
    data: { label: 'ALU Control', aluCode: 'x' },
    position: { x: 600, y: 650 },
  },
  {
    id: 'data-mem',
    type: 'data-mem',
    data: { label: 'Data Memory', readDataMem: 'x', dataMem: DATAMEM },
    position: { x: 924, y: 420 },
  },
  {
    id: 'display',
    type: 'display',
    position: { x: 1200, y: 400 },
    data: {}
  },
  {
    id: 'inst-display',
    type: 'inst-display',
    position: { x: 1200, y: 100 },
    data: {}
  },
  {
    id: 'branch-control',
    type: 'branch-control',
    data: { label: 'Branch Control', branchSelect: 'x' },
    position: { x: 950, y: 250 },
  },
  {
    id: 'title',
    type: 'title',
    data:{},
    position: { x: 0, y: 600 },
  },
  {
    id: 'jump-mux',
    type: 'jump-mux',
    data: { out: 'x' },
    position: { x: 700, y: 30 },
  },
  {
    id: 'branch-adder',
    type: 'branch-adder',
    data: { out: 'x' },
    position: { x: 850, y: 50 },
  },

];

// add type
export const nodeTypes = {
  'pc': PC,
  'clock': Clock,
  'addy-adder': AddyAdder,
  'addy-mux': AddyMux,
  'inst-mem': InstMem,
  'inst-decode': InstDecode,
  'reg-list': RegList,
  'alu-mux': AluMux,
  'alu': Alu,
  'control': Control,
  'data-mux': DataMux,
  'alu-control': AluControl,
  'data-mem': DataMem,
  'display': Display,
  'inst-display': InstDisplay,
  'title': Title,
  'branch-control': BranchControl,
  'branch-adder': BranchAdder,
  'jump-mux': JumpMux,
} satisfies NodeTypes;