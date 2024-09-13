import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isRegListNode, isInstDecodeNode, type AppNode, AluMuxNode, isControlNode } from './types';

import bgSvg from '../assets/Mux.svg';

function AluMux({ id }: NodeProps<AluMuxNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const regConnections = useHandleConnections({
    type: 'target',
    id: 'read-data2'
  });
  const regNodesData1 = useNodesData<AppNode>(regConnections.map((connection) => connection.source),);

  const regNode = regNodesData1.filter(isRegListNode);
  
  const instDecodeConnections = useHandleConnections({
    type: 'target',
    id: 'imm-val'
  });
  const instDecodeNodesData = useNodesData<AppNode>(instDecodeConnections.map((connection) => connection.source),);

  const instDecodeNode = instDecodeNodesData.filter(isInstDecodeNode);

  const controlConnections = useHandleConnections({
    type: 'target',
    id: 'alu-src'
  });
  const controlNodesData = useNodesData<AppNode>(controlConnections.map((connection) => connection.source),);

  const controlNode = controlNodesData.filter(isControlNode);
  
  const input0 = regNode[0]?.data.readData2;
  const input1 = instDecodeNode[0]?.data.immVal;
  const select = controlNode[0]?.data.aluSrc;
  // end inputs

  // update outputs
  useEffect(() => {

    if (select == 'x') {
      updateNodeData(id, { out: 'x' });
      return;
    }
    const selectNum = parseInt(select);

    const output = !selectNum ? input0 : input1;
    updateNodeData(id, { out: output });
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
          id="alu-src"
        />
      </div>
      <div className='inputs'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="read-data2"
          />
        </div>
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
            className='handle' type="source" position={Position.Right} id='alu-mux-out' />
        </div>
      </div>
    </div>
  );
}

export default memo(AluMux);
