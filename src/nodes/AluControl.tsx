import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isInstDecodeNode, type AppNode, AluControlNode } from './types';

import bgSvg from '../assets/AluControl.svg';
import { INSTRUCTIONS, TYPES } from '../utils';

function AluControl({ id, data }: NodeProps<AluControlNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const instDecodeConnections = useHandleConnections({
    type: 'target',
    id: 'opcode'
  });
  const instDecodeData = useNodesData<AppNode>(instDecodeConnections.map((connection) => connection.source),);

  const instDecodeNode = instDecodeData.filter(isInstDecodeNode);
  const opcode = instDecodeNode[0]?.data.opcode;
  const funct3 = instDecodeNode[0]?.data.funct3;
  const funct7 = instDecodeNode[0]?.data.funct7;
  // end inputs

  // update outputs
  useEffect(() => {
    if (opcode == 'x') {
      updateNodeData(id, { aluCode: 'x' });
      return;
    }
    const type = TYPES.get(parseInt(opcode));

    const rId = (parseInt(funct7) << 10) + (parseInt(funct3) << 7) + parseInt(opcode);
    const regId = (parseInt(funct3) << 7) + parseInt(opcode);

    const instId = type === 'R' ? rId : regId;

    const { op } = { ...INSTRUCTIONS[instId] };
    
    console.log({funct7, funct3, opcode})
    const aluCode = op.toString();

    updateNodeData(id, { aluCode });
  }, [opcode, funct3, funct7]);

  return (
    <div
      className='container alu-control'
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
            id="opcode"
          />
          <div className="label">
            opcode
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="funct3"
          />
          <div className="label">
            funct3
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="funct7"
          />
          <div className="label">
            funct7
          </div>
        </div>
      </div>
      <div className='name'>{data.label}</div>
      {/* {data.compdata} */}
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle'
            type="source"
            position={Position.Right}
            id="alu-code"
          />
          <div className="label">
            ALU Code
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AluControl);
