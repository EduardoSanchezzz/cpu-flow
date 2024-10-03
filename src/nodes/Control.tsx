import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isInstMemNode, type AppNode, ControlNode } from './types';

import bgSvg from '../assets/Control.svg';
import { INSTRUCTIONS, TIMEOUT, TYPES } from '../utils';

function Control({ id, data }: NodeProps<ControlNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const connections = useHandleConnections({
    type: 'target',
    id: 'instruction'
  });
  const nodesData = useNodesData<AppNode>(connections.map((connection) => connection.source),);
  const instMemNode = nodesData.filter(isInstMemNode);

  const instMemIn = instMemNode[0]?.data.instruction;
  // end inputs

  // update outputs
  useEffect(() => {
    if (instMemIn == 'x') {
      setTimeout(() => {
        updateNodeData(id, {
          branch: 'x',
          regWrite: 'x',
          memRead: 'x',
          toReg: 'x',
          memWrite: 'x',
          size: 'x',
          aluSrc: 'x',
          jump: 'x',
        });
      }, TIMEOUT);
      return;
    }
    const instruction = parseInt(instMemIn);

    const opcodeNum = instruction & 0b111_1111;
    const funct3Num = (instruction >> 12) & 0b111;
    const funct7Num = (instruction >> 25) & 0b111_1111;

    const rId = opcodeNum + (funct3Num << 7) + (funct7Num << 10);
    const regId = opcodeNum + (funct3Num << 7);
    const ujId = opcodeNum;

    const type = TYPES.get(opcodeNum);
    const instId = type === 'R' ? rId : ((type == 'U') || (type == 'J')) ? ujId : regId;

    const { aluSrc, memRead, toReg, memWrite, size, branch, regWrite, jump } = { ...INSTRUCTIONS[instId] }

    setTimeout(() => {
      updateNodeData(id, { aluSrc, memRead, toReg, memWrite, size, branch, regWrite, jump });
    }, TIMEOUT);
  }, [instMemIn]);

  return (
    <div
      className='container control-node'
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
      {/* {data.aluSrc}
      {data.memRead}
      {data.toReg}
      {data.memWrite}
      {data.branch}
      {data.size}
      {data.regWrite} */}
      <div className='outputs'>
        <div className='port'>
          <Handle
            className='handle' type="source" position={Position.Right} id='jump' />
          <div className="label">
            jump
          </div>
        </div>
        <div className='port'>
          <Handle
            className='handle' type="source" position={Position.Right} id='branch' />
          <div className="label">
            branch
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='mem-to-reg' />
          <div className="label">
            toReg

          </div></div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='mem-read' />
          <div className="label">
            memRead
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='mem-write' />
          <div className="label">
            memWrite
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='size' />
          <div className="label">
            size
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='alu-src' />
          <div className="label">
            aluSrc
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='reg-write' />
          <div className="label">
            regWrite
          </div>
        </div>
      </div>
      <div className='more-info'>
        ?
        <div className='tooltip'>
          <div className='tt-title'>Control Unit</div>
          <div>generates control signals based on the instruction, determining the behavior of various parts of the processor</div>
          <div className='tt-subtitle'>Inputs</div>
          <div><span className='tt-param'>Instruction: </span>binary instruction from the instruction memory</div>
          <div className='tt-subtitle'>Outputs</div>
          <div><span className='tt-param'>aluSrc: </span>Selects ALU input 2 source (rs2 or immediate value from instruction)</div>
          <div><span className='tt-param'>memRead: </span>Enables memory read operation</div>
          <div><span className='tt-param'>memWrite: </span>Enables memory write operation</div>
          <div><span className='tt-param'>toReg: </span>Selects data source to be written to register</div>
          <div><span className='tt-param'>branch: </span>Indicates a branch instruction (conditional jump)</div>
          <div><span className='tt-param'>jump: </span>Indicates a jump instruction</div>
          <div><span className='tt-param'>size: </span>Defines the size in bytes for memory operations</div>
          <div><span className='tt-param'>regWrite: </span>Enables writing to the register</div>
        </div>
      </div>
    </div>
  );
}

export default memo(Control);
