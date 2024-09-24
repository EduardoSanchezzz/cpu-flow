import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isPCNode, type AppNode, InstMemNode } from './types';

import bgSvg from '../assets/InstMem.svg';

function InstMem({ id, data }: NodeProps<InstMemNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const connections = useHandleConnections({
    type: 'target',
    id: 'address'
  });
  const nodesData = useNodesData<AppNode>(connections.map((connection) => connection.source),);

  const PCNode = nodesData.filter(isPCNode);
  const PCIn = PCNode[0]?.data.address;
  // end inputs

  // update outputs
  useEffect(() => {
    if (PCIn == 'x') {
      updateNodeData(id, { out: 'x' });
      return;
    }
    const address = parseInt(PCIn) / 4;
    const outputNum = data.instructions[address];

    const output = outputNum.toString();
    updateNodeData(id, { instruction: output });
  }, [PCIn]);

  return (
    <div
      className='container inst-mem'
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
          <div className="label">
            Address
          </div>
        </div>
      </div>
      <div className='name'>{data.label}</div>
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='instruction' />
          <div className="label">
            Instruction
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(InstMem);
