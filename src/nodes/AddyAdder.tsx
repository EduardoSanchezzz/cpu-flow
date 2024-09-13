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
  const pcIn = pcNode[0]?.data.address;
  useEffect(() => {
    if (pcIn == 'x') {
      updateNodeData(id, { out: 'x' });
      return;
    }

    const pcInNum = parseInt(pcIn);
    const outputNum = pcInNum + 32;

    const output = outputNum.toString();
    updateNodeData(id, { out: output });
  }, [pcIn]);

  return (
    <div
      className='adder container'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='inputs'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="address"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="addy-adder-4"
          />
        </div>

      </div>
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle'
            type="source"
            position={Position.Right}
            id='addy-adder-out'
          />
        </div>

      </div>
    </div>
  );
}

export default memo(component_name);
