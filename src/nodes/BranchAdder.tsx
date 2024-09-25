import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isPCNode, type AppNode, BranchAdderNode, isJumpMuxNode } from './types';

import bgSvg from '../assets/Adder.svg';
import { TIMEOUT } from '../utils';

function BranchAdder({ id }: NodeProps<BranchAdderNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const connections1 = useHandleConnections({
    type: 'target',
    id: 'address'
  });
  const nodesData1 = useNodesData<AppNode>(connections1.map((connection) => connection.source),);

  const pcNode = nodesData1.filter(isPCNode);

  const jumpMuxConnections = useHandleConnections({
    type: 'target',
    id: 'jump-mux-out'
  });
  const jumpMuxNodesData = useNodesData<AppNode>(jumpMuxConnections.map((connection) => connection.source),);

  const jumpMuxNode = jumpMuxNodesData.filter(isJumpMuxNode);
  // end inputs

  // update outputs
  const pcIn = pcNode[0]?.data.address;
  const jumpIn = jumpMuxNode[0]?.data.out;
  useEffect(() => {
    if (pcIn == 'x' || jumpIn == 'x') {
      setTimeout(() => {
        updateNodeData(id, { out: 'x' });
      }, TIMEOUT);
      return;
    }

    const pcInNum = parseInt(pcIn);
    const jumpInNum = parseInt(jumpIn);
    const outputNum = pcInNum + jumpInNum;

    const output = outputNum.toString();
    setTimeout(() => {
      updateNodeData(id, { out: output });
    }, TIMEOUT);
  }, [pcIn, jumpIn]);

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
            id="jump-mux-out"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="address"
          />
        </div>

      </div>
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle'
            type="source"
            position={Position.Right}
            id='branch-adder-out'
          />
        </div>

      </div>
    </div>
  );
}

export default memo(BranchAdder);
