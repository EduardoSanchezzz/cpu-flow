import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isAluNode, type AppNode, DataMuxNode, isControlNode, isDataMemNode, isAddyAdderNode } from './types';

import bgSvg from '../assets/Mux.svg';
import { TIMEOUT, TOREGCODES } from '../utils';

function DataMux({ id }: NodeProps<DataMuxNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const aluConnections = useHandleConnections({
    type: 'target',
    id: 'alu-out'
  });
  const aluNodesData1 = useNodesData<AppNode>(aluConnections.map((connection) => connection.source),);

  const aluNode = aluNodesData1.filter(isAluNode);

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

  const addyAdderConnections = useHandleConnections({
    type: 'target',
    id: 'addy-adder-out'
  });
  const addyAdderNodesData = useNodesData<AppNode>(addyAdderConnections.map((connection) => connection.source),);

  const AddyAdderNode = addyAdderNodesData.filter(isAddyAdderNode);

  const alu = aluNode[0]?.data.out;
  const data = dataMemNode[0]?.data.readDataMem;
  const slt = aluNode[0]?.data.sign;
  const jump = AddyAdderNode[0]?.data.out;
  const lui = '0';
  const auipc = '0';
  const select = controlNode[0]?.data.toReg;
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
    let output:string;

    switch (TOREGCODES.getName(selectNum)) {
      case 'alu':
        output = alu;
        break;
      case 'data':
        output = data;
        break;
      case 'slt':
        output = slt;
        break;
      case 'jump':
        output = jump;
        break;
      case 'lui':
        output = lui;
        break;
      case 'auipc':
        output = auipc;
        break;
      default:
        output = 'err'
    }
    setTimeout(() => {
      updateNodeData(id, { out: output });
    }, TIMEOUT);
  }, [alu, data, select]);

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
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="alu-sign"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="addy-adder-out"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="lui"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="auipc"
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
