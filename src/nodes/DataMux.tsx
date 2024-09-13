import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isAluNode, type AppNode, DataMuxNode, isControlNode, isDataMemNode } from './types';

import bgSvg from '../assets/Mux.svg';

function DataMux({ id }: NodeProps<DataMuxNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const aluConnections = useHandleConnections({
    type: 'target',
    id: 'alu-out'
  });
  const aluNodesData1 = useNodesData<AppNode>(aluConnections.map((connection) => connection.source),);

  const aluNode = aluNodesData1.filter(isAluNode);

  // FIX data
  const dataMemConnections = useHandleConnections({
    type: 'target',
    id: 'read-data-mem'
  });
  const dataMemNodesData = useNodesData<AppNode>(dataMemConnections.map((connection) => connection.source),);

  const dataMemNode = dataMemNodesData.filter(isDataMemNode);

  const controlConnections = useHandleConnections({
    type: 'target',
    id: 'mem-to-reg'
  });
  const controlNodesData = useNodesData<AppNode>(controlConnections.map((connection) => connection.source),);

  const controlNode = controlNodesData.filter(isControlNode);

  const input0 = aluNode[0]?.data.out;
  const input1 = dataMemNode[0]?.data.readDataMem;
  const select = controlNode[0]?.data.memToReg;
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
          id="mem-to-reg"
        />
      </div>
      <div className='inputs'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="alu-out"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="read-data-mem"
          />
        </div>
      </div>
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='write-data' />
        </div>
      </div>
    </div>
  );
}

export default memo(DataMux);
