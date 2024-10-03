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
import bgSvg from '../assets/PC.svg'

import { isAddyMuxNode, isClockNode, type AppNode } from './types';
import { TIMEOUT } from '../utils';

function PC({ id, data }: NodeProps<Node<{ label: string, address: number }>>) {
  const { updateNodeData } = useReactFlow();
  const addyConnections = useHandleConnections({
    type: 'target',
    id: 'next-address'
  });
  const addyNodesData = useNodesData<AppNode>(addyConnections.map((connection) => connection.source),);

  const clockConnections = useHandleConnections({
    type: 'target',
    id: 'clk'
  });
  const clockNodesData = useNodesData<AppNode>(clockConnections.map((connection) => connection.source),);

  const clockNode = clockNodesData.filter(isClockNode);
  const adderNode = addyNodesData.filter(isAddyMuxNode);

  const clock = clockNode[0]?.data.clk;

  // update node data
  useEffect(() => {
    if (!clock) { return; }

    setTimeout(() => {
      updateNodeData(id, { address: adderNode[0]?.data.out });
    }, TIMEOUT);

  }, [clock]);

  return (
    <div
      className='container pc'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='control'>
        <Handle
          className='handle'
          type="target"
          position={Position.Top}
          id="clk"
        />
      </div>
      <div className='inputs'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="next-address"
          />
          <div className="label">
            Next
            Address
          </div>
        </div>
      </div>
      <div className='name'>{data.label}</div>
      {/* {data.address} */}
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='address' />
          <div className="label">
            Instruction
            Address
          </div>
        </div>
      </div>
      <div className='more-info'>
        ?
        <div className='tooltip'>
          <div className='tt-title'>Program Counter</div>
          <div>register that holds the address of the next instruction to be executed</div>
          <div className='tt-subtitle'>Inputs</div>
          <div><span className='tt-param'>Next Address: </span>receives the next instruction address from the address multiplexer</div>
          <div className='tt-subtitle'>Output</div>
          <div><span className='tt-param'>Instruction Address: </span>output provides the current address of the instruction</div>
          <div className='tt-subtitle tt-ctrl'>Control</div>
          <div className='tt-ctrl-txt'><span className='tt-param tt-ctrl'>Clock: </span>On each clock pulse, the PC updates to the new address</div>
        </div>
      </div>
    </div>
  );
}

export default memo(PC);
