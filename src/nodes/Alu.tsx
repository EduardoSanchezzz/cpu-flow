import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isAluMuxNode, isRegListNode, type AppNode, AluNode, isAluControlNode } from './types';

import bgSvg from '../assets/ALU.svg';
import { ALUCODES } from '../utils';

function Alu({ id, data }: NodeProps<AluNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const regConnections = useHandleConnections({
    type: 'target',
    id: 'read-data1'
  });
  const regData = useNodesData<AppNode>(regConnections.map((connection) => connection.source),);

  const regNode = regData.filter(isRegListNode);
  const aluMuxConnections = useHandleConnections({
    type: 'target',
    id: 'alu-mux-out'
  });
  const aluMuxData = useNodesData<AppNode>(aluMuxConnections.map((connection) => connection.source),);

  const aluMuxNode = aluMuxData.filter(isAluMuxNode);
  const ControlConnections = useHandleConnections({
    type: 'target',
    id: 'alu-code'
  });
  const controlData = useNodesData<AppNode>(ControlConnections.map((connection) => connection.source),);

  const controlNode = controlData.filter(isAluControlNode);
  const input1 = regNode[0]?.data.readData1;
  const input2 = aluMuxNode[0]?.data.out;
  const aluCode = controlNode[0]?.data.aluCode;
  // end inputs

  // update outputs
  useEffect(() => {

    if (input1 == 'x' || input2 == 'x' || aluCode == 'x') {
      updateNodeData(id, { out: 'x' });
      return;
    }
    const inputNum1 = parseInt(input1);
    const inputNum2 = parseInt(input2);
    const aluCodeNum = parseInt(aluCode);
    let outputNum = 0;

    switch (ALUCODES.getName(aluCodeNum)) {
      case ('ADD'):
        outputNum = inputNum1 + inputNum2;
        break;
      case ('SUB'):
        outputNum = inputNum1 - inputNum2;
        break;
      case ('AND'):
        outputNum = inputNum1 & inputNum2;
        break;
      case ('OR'):
        outputNum = inputNum1 | inputNum2;
        break;
      default:
        console.log('unrecognized alu code: ', aluCodeNum.toString(2))
    }

    const output = outputNum.toString();
    updateNodeData(id, { out: output });
  }, [input1, input2, aluCode]);

  return (
    <div
      className='container alu'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='control'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Bottom}
            id="alu-code"
            style={{position: 'absolute'}}
          />
        </div>
      </div>
      <div className='inputs'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="read-data1"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="alu-mux-out"
          />
        </div>
      </div>
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle'
            type="source"
            position={Position.Right}
            id="alu-out"
          />
        </div>
      </div>
    </div>
  );
}

export default memo(Alu);
