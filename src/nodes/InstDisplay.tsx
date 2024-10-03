import { memo, useEffect, useState } from 'react';
import {
  useReactFlow,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isClockNode, isInstMemNode, isPCNode, type AppNode } from './types';

import { convertToNBitString, getBImmVal, getIImmVal, getJImmVal, getSImmVal, getUImmVal, INST_NAMES, INSTRUCTIONS, NOP_INST, TIMEOUT, TYPES } from '../utils';

function InstDisplay() {
  const { updateNodeData } = useReactFlow();

  const clockConnections = useHandleConnections({
    type: 'source',
    id: 'clk',
    nodeId: 'clock'
  });
  const clockNodesData = useNodesData<AppNode>(clockConnections.map((connection) => connection.source),);
  const clockNode = clockNodesData.filter(isClockNode);
  const clock = clockNode[0]?.data.clk;

  // inputs
  const pcConnections = useHandleConnections({
    type: 'source',
    id: 'address',
    nodeId: 'pc'
  });
  const pcNodesData = useNodesData<AppNode>(pcConnections.map((connection) => connection.source),);

  const PCNode = pcNodesData.filter(isPCNode);
  const PCIn = PCNode[0]?.data.address;
  const index = parseInt(PCIn) / 4;

  const connections = useHandleConnections({
    type: 'source',
    id: 'instruction',
    nodeId: 'inst-mem'
  });
  const nodesData = useNodesData<AppNode>(connections.map((connection) => connection.source),);

  const InstMemNode = nodesData.filter(isInstMemNode);

  const instMem = InstMemNode[0]?.data;
  // end inputs

  const instructions = instMem.instructions;

  const updateInsts = (i: number, inst: number) => {
    const newArr = [...instructions];

    newArr[i] = inst;
    setTimeout(() => {
      updateNodeData('inst-mem', { instructions: [...newArr] });
    }, TIMEOUT);
  }
  const newInst = () => {
    const newArr = [...instructions];
    newArr.push(NOP_INST);
    setTimeout(() => {
      updateNodeData('inst-mem', { instructions: [...newArr] });
    }, TIMEOUT);
  }

  return (
    <div
      className='inst-display'
    >
      <div className="display-title">INSTRUCTIONS</div>
      {instructions.map((inst, i) => {
        return (
          <div key={i} className={i == index ? clock ? 'inst-display-inner-high' : 'inst-display-inner-low' : 'inst-display-inner'}>
            <Instruction
              instruction={inst}
              updateInstruction={updateInsts}
              index={i}
              key={i + 'inst'}
            />
          </div>
        )
      })}
      <button onClick={newInst} className='new-inst'>+</button>
      <div className='more-info'>
        ?
        <div className='tooltip'>
          <div className='tt-title'>Instructions</div>
          <div><a href='https://riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf#page=21' target='_blank' >RISC-V Instruction Specs</a></div>
          <div className='tt-subtitle'>Integer Register-Immediate Operations</div>
          <div><span className='tt-param'>ADDI, SUBI, SLTI, XORI, ORI, ANDI </span></div>
          <div>Does respective operation on values stored in register rs1 and immediate value encoded in bits 31-20 of instruction, then stores the result in register rd</div>
          <div><a href="https://riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf#page=25" target='_blank'>I Type Instructions</a></div>
          <div className='tt-subtitle'>Integer Register-Register Operations</div>
          <div><span className='tt-param'>ADD, SUB, SLL, SLT, XOR, SRL, SRA, OR, AND </span></div>
          <div>Does respective operation on values stored in register rs1 and rs2, then stores the result in register rd</div>
          <div><a href="https://riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf#page=26" target='_blank'>R Type Instructions</a></div>
          <div className='tt-subtitle'>Unconditional Jumps</div>
          <div><span className='tt-param'>JAL, JALR </span></div>
          <div>JAL adds signed 21 bit number to current PC and jumps to that address in instruction memory, then stores pc+4 in register rd</div>
          <div>JALR adds signed 12 bit number and value in register rs1 to PC and jumps to that address in instruction memory, then stores pc+4 in register rd</div>
          <div><a href="https://riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf#page=27" target='_blank'>Jump Instructions</a></div>
          <div className='tt-subtitle'>Conditional Jumps</div>
          <div><span className='tt-param'>BEQ, BNE, BGE, BLT </span></div>
          <div>Compares the values in registers rs1 and rs2, if the respective condition is true (equal, not equal, greater than or equal, less than) then the immediate value encoded in the instruction is added to the current pc</div>
          <div><a href="https://riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf#page=29" target='_blank'>B Type Instructions</a></div>
          <div className='tt-subtitle'>Loads</div>
          <div><span className='tt-param'>LB, LH, LW</span></div>
          <div>Value in register rs1 is added to the immediate value encoded in instruction. This is used as the read address for the data memory, and the value at that address is stored in register rd</div>
          <div>LB - 1 Byte</div>
          <div>LH - 2 Byte</div>
          <div>LW - 4 Byte</div>
          <div className='tt-subtitle'>Store</div>
          <div><span className='tt-param'>SB, SH, SW</span></div>
          <div>Value in register rs1 is added to the immediate value encoded in instruction. This is used as the write address for the data memory, and the value in register rs2 is stored at that address</div>
          <div>SB - 1 Byte</div>
          <div>SH - 2 Byte</div>
          <div>SW - 4 Byte</div>
          <div><a href="https://riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf#page=29" target='_blank'>Loads and Stores</a></div>
        </div>
      </div>
    </div>
  );
}

export default memo(InstDisplay);

function Instruction({
  instruction,
  updateInstruction,
  index
}: {
  instruction: number,
  updateInstruction: (i: number, inst: number) => void,
  index: number
}) {
  // const [opcode, setOpcode] = useState<number | null>(null);
  const [rd, setRd] = useState<number | null>(null);
  const [rs1, setRs1] = useState<number | null>(null);
  const [rs2, setRs2] = useState<number | null>(null);
  // const [f3, setF3] = useState<number | null>(null);
  // const [f7, setF7] = useState<number | null>(null);
  const [imm, setImm] = useState<number | null>(null);
  const [immVal, setImmVal] = useState<number>(0);
  const [name, setName] = useState<string | null>(null);

  const getType = (inst: number) => {
    const opcode = inst & 0b111_1111;
    const type = TYPES.get(opcode);
    return type;
  }
  useEffect(() => {
    const type = getType(instruction);
    const op = instruction & 0b000_0000_00000_00000_000_00000_111_1111;
    const r0 = (instruction & 0b000_0000_00000_00000_000_11111_000_0000) >> 7;
    const r1 = (instruction & 0b000_0000_00000_11111_000_00000_000_0000) >> 15
    const r2 = (instruction & 0b000_0000_11111_00000_000_00000_000_0000) >> 20;
    const funct3 = (instruction & 0b000_0000_00000_00000_111_00000_000_0000) >> 12;
    const funct7 = (instruction & 0b111_1111_00000_00000_000_00000_000_0000) >> 25;

    const regId = op + (funct3 << 7);
    const rId = op + (funct3 << 7) + (funct7 << 10);
    const ujId = op;
    if (!((rId in INSTRUCTIONS) || (regId in INSTRUCTIONS) || (ujId in INSTRUCTIONS))) {
      setName('NOP');
      setImm(null);
      setRd(null);
      setRs1(null);
      setRs2(null);
      return;
    }

    switch (type) {
      case 'R':
        setName(INSTRUCTIONS[rId].name)
        // setOpcode(op);
        setRd(r0);
        // setF3(funct3);
        setRs1(r1);
        setRs2(r2);
        // setF7(funct7);
        setImm(null)
        break;
      case 'I':
        setName(INSTRUCTIONS[regId].name)
        // setOpcode(op);
        setRd(r0);
        // setF3(funct3);
        setRs1(r1);
        setImm(getIImmVal(instruction));
        // setF7(null);
        setRs2(null);
        break;
      case 'S':
        setName(INSTRUCTIONS[regId].name);
        // setOpcode(op);
        // setF3(funct3);
        setRs1(r1);
        setRs2(r2);
        setImm(getSImmVal(instruction));
        // setF7(null);
        setRd(null);
        break;
      case 'B':
        setName(INSTRUCTIONS[regId].name);
        setRs1(r1);
        setRs2(r2);
        setImm(getBImmVal(instruction));
        setRd(null);
        break;
      case 'J':
        setName(INSTRUCTIONS[ujId].name);
        setRs1(null);
        setRs2(null);
        setImm(getJImmVal(instruction));
        setRd(r0);
        break;
      case 'U':
        setName(INSTRUCTIONS[ujId].name);
        setRs1(null);
        setRs2(null);
        setImm(getUImmVal(instruction, true));
        setRd(r0);
        break;
    }

  }, [instruction]);

  useEffect(() => {
    if (name == null) { return; }
    const id = convertToNBitString(parseInt(INST_NAMES[name]), 17);
    const op = id.slice(10, 17);
    const funct3 = id.slice(7, 10);
    const funct7 = id.slice(0, 7);
    const r0 = convertToNBitString(rd, 5)
    const r1 = convertToNBitString(rs1, 5)
    const r2 = convertToNBitString(rs2, 5);

    // convert these to signed
    const immStr = convertToNBitString(imm, 12);
    const bImmStr = convertToNBitString(imm, 13);
    const jImmStr = convertToNBitString(imm, 21);
    const uImmStr = convertToNBitString(imm, 20);

    const type = TYPES.get(parseInt(op, 2));

    let instStr = ''

    switch (type) {
      case 'R':
        instStr = funct7 + r2 + r1 + funct3 + r0 + op;
        break;
      case 'I':
        instStr = immStr + r1 + funct3 + r0 + op;
        break;
      case 'S':
        instStr = immStr.slice(0, 7) + r2 + r1 + funct3 + immStr.slice(7, 12) + op;
        break;
      case 'B':
        instStr = bImmStr.slice(0, 1) + bImmStr.slice(2, 8) + r2 + r1 + funct3 + bImmStr.slice(8, 12) + bImmStr.slice(1, 2) + op;
        break;
      case 'U':
        instStr = uImmStr.slice(0, 20) + r0 + op;
        break;
      case 'J':
        instStr = jImmStr.slice(0, 1) + jImmStr.slice(10, 20) + jImmStr.slice(9, 10) + jImmStr.slice(1, 9) + r0 + op;
        break;
      default:
        console.table({ type, op, name })
        console.log('error')

    }
    // console.table({op, funct3, funct7, r0, r1, r2, immStr, type, id, instStr})

    updateInstruction(index, parseInt(instStr, 2))
  }, [rs1, rs2, rd, imm])

  const updateName = (e:any) => {
    const newName = e.target.value;
    setName(newName);
    setRs1(0);
    setRs2(0);
    setImm(0);
    setRd(0);
  }

  useEffect(() => {
    if (imm == null) { return; }
    setImmVal(imm)
  }, [imm])

  const REGLIST = [...Array(32).keys()]
  const updateImm = (e: any) => {
    const newImm = parseInt(e.target.value);
    if (Number.isNaN(newImm)) { setImm(0); return; }
    const type = getType(instruction);
    switch (type) {
      case 'B':
        if ((Math.abs(newImm) > 2 ** 12 - 1) || newImm % 2 != 0) {
          setImmVal(imm ?? 0)
          return;
        }
        break;
      case 'J':
        if ((Math.abs(newImm) > 2 ** 20 - 1) || newImm % 2 != 0) {
          setImmVal(imm ?? 0)
          return;
        }
        break;
      case 'U':
        if (Math.abs(newImm) > 2 ** 19 - 1) {
          setImmVal(imm ?? 0)
          return;
        }
        break;
      default:
        if (Math.abs(newImm) > 2 ** 11 - 1) {
          setImmVal(imm ?? 0)
          return;
        }
    }
    setImm(newImm);
  }

  return (
    <div className='inst-display-inst'>
      {name != null &&
        <div className='inst-param inst-name'>
          <select onChange={updateName} value={name}>
            {Object.keys(INST_NAMES).map((item, i) => { return <option key={i}>{item}</option> })}
          </select>
          <label>name</label>
        </div>}
      {rd != null &&
        <div className='inst-param rd'>
          <select onChange={(e) => { setRd(parseInt(e.target.value)) }} value={rd}>
            {Object.keys(REGLIST).map((item, i) => { return <option key={i}>{item}</option> })}
          </select>
          <label>rd</label>
        </div>}
      {rs1 != null &&
        <div className='inst-param rs1'>
          <select onChange={(e) => { setRs1(parseInt(e.target.value)) }} value={rs1}>
            {Object.keys(REGLIST).map((item, i) => { return <option key={i}>{item}</option> })}
          </select>
          <label>rs1</label>
        </div>}
      {rs2 != null &&
        <div className='inst-param rs2'>
          <select onChange={(e) => { setRs2(parseInt(e.target.value)) }} value={rs2}>
            {Object.keys(REGLIST).map((item, i) => { return <option key={i}>{item}</option> })}
          </select>
          <label>rs2</label>
        </div>}
      {imm != null &&
        <div className='inst-param imm'>
          <input onBlur={updateImm} value={immVal} onChange={(e: any) => setImmVal(e.target.value)} />
          <label>imm</label>
        </div>}
    </div>
  );
}
