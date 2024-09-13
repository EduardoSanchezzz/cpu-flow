import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isInstMemNode, type AppNode, InstDecodeNode } from './types';

import bgSvg from '../assets/InstDecode.svg';
import { signExtend, TYPES } from '../utils';

function InstDecode({ id, data }: NodeProps<InstDecodeNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const connections = useHandleConnections({
    type: 'target',
    id: 'instruction'
  });
  const nodesData = useNodesData<AppNode>(connections.map((connection) => connection.source),);

  const InstMemNode = nodesData.filter(isInstMemNode);
  
  const instMemIn = InstMemNode[0]?.data.instruction;
  // end inputs

  // update outputs
  useEffect(() => {
    if (instMemIn == 'x') {
      updateNodeData(id, { 
        readAddress1: 'x',
        readAddress2: 'x',
        writeAddress: 'x',
        opcode: 'x',
        funct3: 'x',
        funct7: 'x' 
      });
      return;
    }

    const instruction = parseInt(instMemIn);

    const readAddress1Num = (instruction >> 15) & 0b11111;
    const readAddress2Num = (instruction >> 20) & 0b11111;
    const writeAddressNum = (instruction >> 7) & 0b11111;
    const opcodeNum = instruction & 0b111_1111;
    const funct3Num = (instruction >> 12) & 0b111;
    const funct7Num = (instruction >> 25) & 0b111_1111;
    let immValNum = 0;

    switch (TYPES.get(opcodeNum)){
      case "I":
          immValNum = instruction >> 20;
          break;
      case "S":
          immValNum = ((instruction >> 20) & 0b1111_1110_0000) + ((instruction >> 7) & 0b1_1111);
          break;
      case "B":
          let b12 = (instruction >> 20) &     0b1000_0000_0000;
          let b11 = (instruction << 3) &      0b0100_0000_0000;
          let b10to5 = (instruction >> 21) &   0b0011_1111_0000;
          let b4to0 = (instruction >> 8) &     0b0000_0000_1111;
          immValNum = b12 + b11 + b10to5 + b4to0;
          break;
    }
    immValNum = signExtend(immValNum);

    const readAddress1 = readAddress1Num.toString();
    const readAddress2 = readAddress2Num.toString();
    const writeAddress = writeAddressNum.toString();
    const opcode = opcodeNum.toString();
    const funct3 = funct3Num.toString();
    const funct7 = funct7Num.toString();
    const immVal = immValNum.toString();

    updateNodeData(id, { 
      readAddress1,
      readAddress2,
      writeAddress,
      opcode,
      funct3,
      funct7,
      immVal, 
    });
  }, [instMemIn]);

  return (
    <div
      className='container inst-decode'
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
            id="instruction"
          />
           <div className="label">
            Instruction
          </div>
        </div>
      </div>
      <div className='name'>{data.label}</div>
      <div className='outputs'>
        <div className="port">
          <Handle
          className='handle' type="source" position={Position.Right} id='read-reg1' />
          <div className="label">
            Read Reg 1
          </div>
        </div>     <div className="port">
          <Handle
          className='handle' type="source" position={Position.Right} id='read-reg2' />
          <div className="label">
            Read Reg 2
          </div>
        </div>     <div className="port">
          <Handle
          className='handle' type="source" position={Position.Right} id='write-reg' />
          <div className="label">
            Write Reg
          </div>
        </div>     <div className="port">
          <Handle
          className='handle' type="source" position={Position.Right} id='opcode' />
          <div className="label">
            opcode
          </div>
        </div>     <div className="port">
          <Handle
          className='handle' type="source" position={Position.Right} id='funct3' />
          <div className="label">
            funct3
          </div>
        </div>     <div className="port">
          <Handle
          className='handle' type="source" position={Position.Right} id='funct7' />
          <div className="label">
            funct7
          </div>
        </div>     <div className="port">
          <Handle
          className='handle' type="source" position={Position.Right} id='imm-val' />
          <div className="label">
            Imm Value
          </div>
        </div>   </div>
    </div>
  );
}

export default memo(InstDecode);
