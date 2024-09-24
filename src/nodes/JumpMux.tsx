import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isAluNode, type AppNode, JumpMuxNode, isControlNode, isBranchShiftNode } from './types';

import bgSvg from '../assets/Mux.svg';
import { TIMEOUT } from '../utils';

function JumpMux({ id }: NodeProps<JumpMuxNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const aluConnections = useHandleConnections({
    type: 'target',
    id: 'alu-out'
  });
  const aluNodesData1 = useNodesData<AppNode>(aluConnections.map((connection) => connection.source),);

  const aluNode = aluNodesData1.filter(isAluNode);

  // FIX data
  const BranchShiftConnections = useHandleConnections({
    type: 'target',
    id: 'branch-shift-out'
  });
  const BranchShiftNodesData = useNodesData<AppNode>(BranchShiftConnections.map((connection) => connection.source),);

  const BranchShiftNode = BranchShiftNodesData.filter(isBranchShiftNode);

  const controlConnections = useHandleConnections({
    type: 'target',
    id: 'mem-to-reg'
  });
  const controlNodesData = useNodesData<AppNode>(controlConnections.map((connection) => connection.source),);

  const controlNode = controlNodesData.filter(isControlNode);

  const input0 = aluNode[0]?.data.out;
  const input1 = BranchShiftNode[0]?.data.out;
  const select = controlNode[0]?.data.jump;
  // end inputs

  // update outputs
  useEffect(() => {
    if (select == 'x') {
      setTimeout(() => {
        updateNodeData(id, { out: 'x' });
      }, TIMEOUT);
      return;
    }
    const selectNum = parseInt(select);

    const output = !selectNum ? input0 : input1;
    setTimeout(() => {
      updateNodeData(id, { out: output });
    }, TIMEOUT);
  }, [input0, input1, select]);

  return (
    <div
      className='container mux'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='control'>
        <Handle
          className='handle'
          type="target"
          position={Position.Bottom}
          style={{ position: 'absolute', transform: 'translate(0%, -255%)' }}
          id="jump"
        />
      </div>
      <div className='inputs'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="branch-shift-out"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="alu-out"
          />
        </div>
      </div>
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='jump-mux-out' />
        </div>
      </div>
    </div>
  );
}

export default memo(JumpMux);
