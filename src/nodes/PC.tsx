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
    if (!!clock) {
      updateNodeData(id, { address: adderNode[0]?.data.out });
    }
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
    </div>
  );
}

export default memo(PC);
