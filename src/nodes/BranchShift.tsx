import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { type AppNode, BranchShiftNode, isInstDecodeNode } from './types';

import bgSvg from '../assets/Circle.svg';
import { TIMEOUT } from '../utils';

function BranchShift({ id }: NodeProps<BranchShiftNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const instDecodeConnections = useHandleConnections({
    type: 'target',
    id: 'imm-val'
  });
  const instDecodeData = useNodesData<AppNode>(instDecodeConnections.map((connection) => connection.source),);

  const instDecodeNode = instDecodeData.filter(isInstDecodeNode);
  // end inputs

  // update outputs
  const imm = instDecodeNode[0]?.data.immVal;
  useEffect(() => {
    if (imm == 'x') {
      setTimeout(() => {
        updateNodeData(id, { out: 'x' });
      }, TIMEOUT);
      return;
    }

    const immNum = parseInt(imm);
    const outputNum = immNum * 2;

    const output = outputNum.toString();
    setTimeout(() => {
      updateNodeData(id, { out: output });
    }, TIMEOUT);
  }, [imm]);

  return (
    <div
      className='shift container'
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
            id="imm-val"
          />
        </div>

      </div>
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle'
            type="source"
            position={Position.Right}
            id='branch-shift-out'
          />
        </div>

      </div>
    </div>
  );
}

export default memo(BranchShift);
