import type { NodeTypes } from '@xyflow/react';

import { AppNode } from './types';
import PC from './PC';
import Clock from './Clock';
import AddyAdder from './AddyAdder';
import AddyMux from './AddyMux';

export const initialNodes: AppNode[] = [
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
    id: '8',
    type: 'Clock',
    data: { label: 'Clock', clk: 0 },
    position: { x: 350, y: 300 },
  },
];

// add type
export const nodeTypes = {
  'pc': PC,
  'Clock': Clock,
  'addy-adder': AddyAdder,
  'addy-mux': AddyMux,
} satisfies NodeTypes;
