import type { NodeTypes } from '@xyflow/react';

import { PositionLoggerNode } from './PositionLoggerNode';
import { AppNode } from './types';
import { testReadNode } from './testReadNode';
import TextNode from './TextNode';
import ResultNode from './ResultNode';
import UppercaseNode from './UppercaseNode';
import PC from './PC';
import Adder from './Adder';
import Clock from './Clock';
import AddyAdder from './AddyAdder';
import AddyMux from './AddyMux';
// add import

export const initialNodes: AppNode[] = [
  { id: 'a', type: 'input', position: { x: 0, y: 0 }, data: { label: 'wire' } },
  {
    id: 'b',
    type: 'position-logger',
    position: { x: -100, y: 100 },
    data: { label: 'drag me!', value: 0 },
  },
  { id: 'c', position: { x: 100, y: 100 }, data: { label: 'your ideas' } },
  {
    id: 'd',
    type: 'output',
    position: { x: 0, y: 200 },
    data: { label: 'with React Flow' },
  },
  {
    id: 'e',
    type: 'testReadNode',
    position: { x: -100, y: 250 },
    data: { label: 'test', value: 0 },
  },
  {
    id: '1',
    type: 'text',
    data: {
      text: 'hello',
    },
    position: { x: -100, y: -50 },
  },
  {
    id: '2',
    type: 'text',
    data: {
      text: 'world',
    },
    position: { x: 0, y: 100 },
  },
  {
    id: '3',
    type: 'uppercase',
    data: { text: '' },
    position: { x: 100, y: -100 },
  },
  {
    id: '4',
    type: 'result',
    data: {},
    position: { x: 300, y: -75 },
  },
  {
    id: '5',
    type: 'uppercase',
    data: { text: '' },
    position: { x: 100, y: 100 },
  },
  {
    id: 'pc',
    type: 'pc',
    data: { label: 'Program Counter', address: 0 },
    position: { x: 100, y: 600 },
  },
  {
    id: 'addy-adder',
    type: 'addy-adder',
    data: { out: 0 },
    position: { x: 440, y: 600 },
  },
  {
    id: 'addy-mux',
    type: 'addy-mux',
    data: { out: 0 },
    position: { x: 540, y: 600 },
  },
  {
    id: '7',
    type: 'Adder',
    data: { label: 'Adder', out: 0 },
    position: { x: 300, y: 400 },
  },
  {
    id: '8',
    type: 'Clock',
    data: { label: 'Clock', clk: 0 },
    position: { x: 350, y: 300 },
  },
];

// add type
export const nodeTypes = {
  'position-logger': PositionLoggerNode,
  'testReadNode': testReadNode,
  'text': TextNode,
  'result': ResultNode,
  'uppercase': UppercaseNode,
  'pc': PC,
  'Adder': Adder,
  'Clock': Clock,
  'addy-adder': AddyAdder,
  'addy-mux': AddyMux,
} satisfies NodeTypes;
