import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      fitView
      nodesDraggable={false}
      nodesConnectable={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      zoomOnScroll={false}
      panOnDrag={false}
      // elementsSelectable={false}
      // nodesFocusable={false}
    >
      {/* <MiniMap /> */}
      <Controls 
      showInteractive={false}/>
    </ReactFlow>
  );
}
