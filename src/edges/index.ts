import type { Edge, EdgeTypes } from '@xyflow/react';
import DataEdge from './DataEdge';

export type dataEdge = Edge<{sourceId:string, outputName: string, value:number}, 'data'>;
export type AppEdge = dataEdge;

export const initialEdges: AppEdge[] = [
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
  'data': DataEdge
} satisfies EdgeTypes;
