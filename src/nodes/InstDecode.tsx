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
import { getBImmVal, getIImmVal, getJImmVal, getSImmVal, getUImmVal, TIMEOUT, TYPES } from '../utils';

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
      setTimeout(() => {
        updateNodeData(id, {
          readAddress1: 'x',
          readAddress2: 'x',
          writeAddress: 'x',
          opcode: 'x',
          funct3: 'x',
          funct7: 'x',
          immVal: 'x',
        });
      }, TIMEOUT);
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

    switch (TYPES.get(opcodeNum)) {
      case "I":
        immValNum = getIImmVal(instruction);
        break;
      case "S":
        immValNum = getSImmVal(instruction);
        break;
      case "B":
        immValNum = getBImmVal(instruction);
        break;
      case "J":
        immValNum = getJImmVal(instruction);
        break;
      case "U":
        immValNum = getUImmVal(instruction, false);
        break;
    }

    const readAddress1 = readAddress1Num.toString();
    const readAddress2 = readAddress2Num.toString();
    const writeAddress = writeAddressNum.toString();
    const opcode = opcodeNum.toString();
    const funct3 = funct3Num.toString();
    const funct7 = funct7Num.toString();
    const immVal = immValNum.toString();

    setTimeout(() => {
      updateNodeData(id, {
        readAddress1,
        readAddress2,
        writeAddress,
        opcode,
        funct3,
        funct7,
        immVal,
      });
    }, TIMEOUT);
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
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='read-reg2' />
          <div className="label">
            Read Reg 2
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='write-reg' />
          <div className="label">
            Write Reg
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='opcode' />
          <div className="label">
            opcode
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='funct3' />
          <div className="label">
            funct3
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='funct7' />
          <div className="label">
            funct7
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='imm-val' />
          <div className="label">
            Imm Value
          </div>
        </div>
      </div>
      <div className='more-info'>
        ?
        <div className='tooltip'>
          <div className='tt-title'>Instruction Decode</div>
          <div>decodes a binary instruction into its relevant parts</div>
          <div className='tt-subtitle'>Inputs</div>
          <div><span className='tt-param'>Instruction: </span>32-bit binary instruction from the instruction memory</div>
          <div className='tt-subtitle'>Output</div>
          <div><span className='tt-param'>Read Reg 1: </span>Address of the first source register; bits 15-19</div>
          <div><span className='tt-param'>Read Reg 2: </span>Address of the second source register; bits 20-24</div>
          <div><span className='tt-param'>Write Reg: </span>Address of destination register; bits; bits 7-11</div>
          <div><span className='tt-param'>opcode: </span>type identifier used in all instructions; bits 0-6</div>
          <div><span className='tt-param'>funct3: </span>bits 12-14</div>
          <div><span className='tt-param'>funct7: </span>for R-type instructions; bits 25-31</div>
          <div><span className='tt-param'>Imm Value: </span>12, 20, or 32 bit immediate value extracted from instruction based on type (I, S, B, J, or U)</div>
        </div>
      </div>
    </div>
  );
}

export default memo(InstDecode);
