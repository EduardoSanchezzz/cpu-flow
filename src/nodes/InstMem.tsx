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
import { TIMEOUT } from '../utils';

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
      setTimeout(() => {
        updateNodeData(id, { instruction: 'x' });
      }, TIMEOUT);
      return;
    }
    if (parseInt(PCIn) % 4 != 0) {
      alert('instruction address not 4 byte aligned, RESETTING')
      // RESET
      updateNodeData('pc', { address: 'x' });
      updateNodeData('clock', { clk: 0, step: -1 });
      return;
    }
    const address = parseInt(PCIn) / 4;
    if (address > data.instructions.length - 1) {
      updateNodeData(id, { instruction: 'x' });
      return;
    }
    const outputNum = data.instructions[address];

    const output = outputNum.toString();
    setTimeout(() => {
      updateNodeData(id, { instruction: output });
    }, TIMEOUT);
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
