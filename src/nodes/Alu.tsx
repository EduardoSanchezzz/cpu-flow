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
import { ALUCODES, TIMEOUT } from '../utils';

function Alu({ id }: NodeProps<AluNode>) {
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
      setTimeout(() => {
        updateNodeData(id, { out: 'x', zero: 'x', sign: 'x' });
      }, TIMEOUT);
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
      case ('XOR'):
        outputNum = inputNum1 ^ inputNum2;
        break;
      case ('SLL'):
        outputNum = inputNum1 << (inputNum2 & 0b1_1111);
        break;
      case ('SRL'):
        outputNum = inputNum1 >> (inputNum2 & 0b1_1111);
        break;
      case ('SRA'):
        outputNum = inputNum1 >>> (inputNum2 & 0b1_1111);
        break;
      default:
        console.log('unrecognized alu code: ', aluCodeNum.toString(2))
    }

    const output = outputNum.toString();
    const zero = outputNum == 0 ? '1' : '0';
    const sign = outputNum < 0 ? '1' : '0';
    setTimeout(() => {
      updateNodeData(id, { out: output, zero, sign });
    }, TIMEOUT);
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
            style={{ position: 'absolute', transform: 'translate(0%, -255%)' }}
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
            id="alu-zero"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="source"
            position={Position.Right}
            id="alu-sign"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="source"
            position={Position.Right}
            id="alu-out"
          />
        </div>
      </div>
      <div className='more-info'>
        ?
        <div className='tooltip'>
          <div className='tt-title'>ALU</div>
          <div>performs arithmetic and logical operations on two inputs</div>
          <div className='tt-subtitle'>Inputs</div>
          <div><span className='tt-param'>Input1: </span>First operand, sourced from register rs1</div>
          <div><span className='tt-param'>Input2: </span>Second operand, sourced from either rs2 or the immediate value encoded in instruction (depending on ALUSrc control signal)</div>
          <div className='tt-subtitle'>Outputs</div>
          <div><span className='tt-param'>Result: </span>Result of ALU Operation</div>
          <div><span className='tt-param'>Zero: </span>Indicates if result is zero</div>
          <div><span className='tt-param'>Sign: </span>Indicates if result is negative</div>
          <div className='tt-subtitle tt-ctrl'>Control</div>
          <div className='tt-ctrl-txt'><span className='tt-param tt-ctrl'>ALU Code: </span>Determines ALU operation based on following lookup table</div>
          <table>
            <thead>
            <tr>
              <th scope="col">ALU Code</th>
              <th scope="col">Operation</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <th scope='row'>000</th>
                <td>AND</td>
              </tr>
              <tr>
                <th scope='row'>001</th>
                <td>OR</td>
              </tr>
              <tr>
                <th scope='row'>010</th>
                <td>XOR</td>
              </tr>
              <tr>
                <th scope='row'>011</th>
                <td>ADD</td>
              </tr>
              <tr>
                <th scope='row'>100</th>
                <td>SUB</td>
              </tr>
              <tr>
                <th scope='row'>101</th>
                <td>Logical Shift Left</td>
              </tr>
              <tr>
                <th scope='row'>110</th>
                <td>Logical Shift Right</td>
              </tr>
              <tr>
                <th scope='row'>111</th>
                <td>Arithmetic Shift Right</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default memo(Alu);
