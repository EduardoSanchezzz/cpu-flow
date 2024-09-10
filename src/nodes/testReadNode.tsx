import { Handle, Position, useHandleConnections, useNodesData, useReactFlow, type NodeProps } from '@xyflow/react';

import { AppNode, PositionLoggerNode, type testReadNode } from './types';
import { useEffect, useState } from 'react';

export function testReadNode({id, data}:NodeProps<testReadNode>) {
  const connections = useHandleConnections({
    type:'target',
  });
  const {updateNodeData} = useReactFlow();
  const [value, setValue] = useState(0);
  const nodesData = useNodesData<AppNode>(
    connections.map((connection) => connection.source),
  );

  function isTextNode(node: any): node is PositionLoggerNode {
    return node.type === 'position-logger';
  }
  const posNodes = nodesData.filter(isTextNode);

  useEffect(() => {
    let newval = posNodes[0].data.value;
    setValue(newval)
    updateNodeData(id, {value: newval})
  }, [posNodes]);

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="react-flow__node-default">

      <div>
        {value}
      </div>

      <Handle type="target" position={Position.Top} />
    </div>
  );
}
