import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { AdderNode, isPCNode, type AppNode } from './types';

function Adder({ id, data }: NodeProps<AdderNode>) {
  const { updateNodeData } = useReactFlow();
  const connections = useHandleConnections({
    type: 'target',
  });
  const nodesData = useNodesData<AppNode>(connections.map((connection) => connection.source),);
  
  // textNode is input node
  const inputNode = nodesData.filter(isPCNode);

  // update node data
  useEffect(() => {
    updateNodeData(id, { out: inputNode[0]?.data.address + 4 });
  }, [inputNode]);

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
     <div>
      <Handle
        type="target"
        id='address'
        position={Position.Left}
      />
      <label htmlFor="address" className="label">
          Address
      </label>
     </div>
      <div>{data.label}</div>
      <div>{data.out}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(Adder);
