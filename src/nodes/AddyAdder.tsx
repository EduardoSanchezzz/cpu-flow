import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isPCNode, type AppNode, AddyAdderNode } from './types';

import bgSvg from '../assets/Adder.svg';

function component_name({ id }: NodeProps<AddyAdderNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const connections1 = useHandleConnections({
    type: 'target',
    id: 'address'
  });
  const nodesData1 = useNodesData<AppNode>(connections1.map((connection) => connection.source),);

  const pcNode = nodesData1.filter(isPCNode);
  // end inputs

  // update outputs
  useEffect(() => {
    const output = pcNode[0]?.data.address + 4;
    updateNodeData(id, { out: output });
  }, [pcNode]);

  return (
    <div
      className='adder'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="address"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="addy-adder-4"
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(component_name);
