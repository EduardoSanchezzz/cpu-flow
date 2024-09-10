import type { Edge, EdgeTypes } from '@xyflow/react';
import DataEdge from './DataEdge';

export type dataEdge = Edge<{sourceId:string, outputName: string, value:number}, 'data'>;
export type AppEdge = dataEdge;

export const initialEdges: AppEdge[] = [
  { id: 'a->c', source: 'a', target: 'c', animated: true },
  { id: 'b->d', source: 'b', target: 'd' },
  { id: 'c->d', source: 'c', target: 'd', animated: true },
  { id: 'b->e', source: 'b', target: 'e', animated: true },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
  },
  {
    id: 'e5-4',
    source: '5',
    target: '4',
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
  },
  {
    id: 'e8-6',
    source: '8',
    target: '6',
    targetHandle: 'clock',
  },
  {
    id: 'clock',
    source: '8',
    target: 'pc',
    targetHandle: 'clock',
  },
  {
    id: 'pc_addyadder',
    type: 'data',
    source: 'pc',
    target: 'addy-adder',
    targetHandle: 'address',
    data: {value: 0, outputName: 'address', sourceId: 'pc'}
  },
  {
    id: 'addy-adder_addy-mux',
    type: 'data',
    source: 'addy-adder',
    target: 'addy-mux',
    targetHandle: 'addy-adder-out',
    data: {value: 0, outputName: 'out', sourceId: 'addy-adder'}
  },
  {
    id: 'addy-mux_pc',
    type: 'data',
    source: 'addy-mux',
    target: 'pc',
    targetHandle: 'next-address',
    data: {value: 0, outputName: 'out', sourceId: 'addy-mux'}
  },
];

export const edgeTypes = {
  // Add your custom edge types here!
  'data': DataEdge
} satisfies EdgeTypes;
