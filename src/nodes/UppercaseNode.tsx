import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
  Node
} from '@xyflow/react';

import { isTextNode, type AppNode } from './types';

function UppercaseNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();
  const connections = useHandleConnections({
    type: 'target',
  });
  const nodesData = useNodesData<AppNode>(connections.map((connection) => connection.source),);
  
  const textNode = nodesData.filter(isTextNode);


  useEffect(() => {
    updateNodeData(id, { text: textNode[0]?.data.text.toUpperCase() + 'a' });
  }, [textNode]);

  return (
    <div
      style={{
        background: '#eee',
        color: '#222',
        padding: 10,
        fontSize: 12,
        borderRadius: 10,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={connections.length === 0}
      />
      {data.text}
      <div>uppercase transform</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(UppercaseNode);
