
class TwoWayMap {
    map: Record<string, number>;
    reverseMap: Map<number, string>;

    constructor(map:Record<string, number>) {
       this.map = map;
       this.reverseMap = new Map();
       for(const key in map) {
          const code = map[key];
          this.reverseMap.set(code, key);   
       }
    }
    getCode(key:string) { return this.map[key]; }
    getName(code:number) { return this.reverseMap.get(code); }
}

export const signExtend = (out:number):number => {
    // sign extend
    if (!!(out & 0b1000_0000_0000)) {
        out += 0b1111_1111_1111_1111_1111_0000_0000_0000;
    }
    return out;
}
export const convertToNBitString = (num:number|null, N:number):string => {
    if (num == null) return '';
    let NBitStr = Math.abs(num).toString(2);
    const leadBit = num < 0 ? '1' : '0'

    while (NBitStr.length < N - 1) {
        NBitStr = '0' + NBitStr;
    }
    NBitStr = leadBit + NBitStr;

    return NBitStr;
}
export const makeDecStrNBitsLong = (str:string, N:number):string => {
    let NBitStr = parseInt(str).toString(2);

    while (NBitStr.length < N) {
        NBitStr = '0' + NBitStr
    }

    return NBitStr;
}
export const getIImmVal = (inst:number):number => {
    const sign = inst >> 31 & 0b1;
    let immValNum = inst >> 20 & 0x7ff;
    immValNum = !!sign ? -immValNum : immValNum;
    return immValNum;
}
export const getSImmVal = (inst:number):number => {
    const sign = inst >> 31 & 0b1;

    let immValNum = ((inst >> 20) & 0b0111_1110_0000) | ((inst >> 7) & 0b1_1111);
    immValNum = !!sign ? -immValNum : immValNum;

    return immValNum;
}
export const getBImmVal = (inst:number):number => {
    const sign = inst >> 31 & 0b1;
    const b7 = inst >> 7 & 0b1;
    const b25_6 = inst >> 25 & 0b11_1111;
    const b8_4 = inst >> 8 & 0b1111;
    
    const i11 = b7 << 11;
    const i5 = b25_6 << 5;
    const i1 = b8_4 << 1;
    const i0 = 0;
    const immValAbs = (i11 | i5 | i1 | i0);
    const immVal = !!sign ? -immValAbs : immValAbs;

    return immVal;
}
export const getJImmVal = (inst:number):number => {
    const sign = inst >> 31 & 0b1;

    // instructions b(instbit)_(size)
    const b12_8 = inst >> 12 & 0b1111_1111;
    const b20 = inst >> 20 & 0b1;
    const b21_10 = inst >> 21 & 0b11_1111_1111;
    
    // immediate bits i(immbit)
    const i1 = b21_10 << 1;
    const i11 = b20 << 11;
    const i12 = b12_8 << 12;
    const i0 = 0b0;

    const immValAbs = (i12 | i11 | i1 | i0);
    const immVal = !!sign ? -immValAbs : immValAbs;

    return immVal;
}
export const getUImmVal = (inst:number, shift:boolean):number => {
    const sign = inst >> 31 & 0b1;

    let immValNum = inst & 0x7f_ff_f0_00;

    immValNum = !!sign ? -immValNum : immValNum;

    const retVal = shift ? immValNum >> 12 : immValNum; 
    return retVal;
}

export const NOP_INST = 0b0000_0000_0000_0000_0000_0000_0001_0011

const R_OP = 0b011_0011;
const R_IMM_OP = 0b001_0011;
const LOAD_OP = 0b000_0011;
const S_OP = 0b010_0011;
const B_OP = 0b110_0011;
const JAL_OP = 0b110_1111;
const JALR_OP = 0b110_0111;
const LUI_OP = 0b011_0111;
const AUI_OP = 0b001_0111;

export const TIMEOUT = 0;

export const TYPES = new Map<number|"opcode", string>();
TYPES.set(R_OP, 'R');
TYPES.set(R_IMM_OP, 'I');
TYPES.set(LOAD_OP, 'I');
TYPES.set(JALR_OP, 'I');
TYPES.set(S_OP, 'S');
TYPES.set(B_OP, 'B');
TYPES.set(JAL_OP, 'J');
TYPES.set(LUI_OP, 'U');
TYPES.set(AUI_OP, 'U');

type CTRL = {
    aluSrc: string,
    toReg: string,
    memRead: string,
    memWrite: string,
    regWrite: string,
    branch: string,
    size: string,
    jump: string,
}
interface INST extends CTRL {
    name:string,
    op:number
}


export const ALUCODES = new TwoWayMap({
    'AND': 0b0000,
    'OR': 0b0001,
    'ADD': 0b0010,
    'SUB': 0b0110,
});
export const BRANCHCODES = new TwoWayMap({
    'nobranch': 0b000,
    'zero': 0b0001,
    'notzero': 0b0010,
    'signbit': 0b0011,
    'notsignbit': 0b0100,
    'jump': 0b111,
});
export const TOREGCODES = new TwoWayMap({
    'alu': 0b000,
    'data': 0b0001,
    'slt': 0b0010,
    'jump': 0b0011,
    'lui': 0b0100,
    'auipc': 0b101,
});

const R_CTRL:CTRL = {
    aluSrc: '0',
    toReg: TOREGCODES.getCode('alu').toString(),
    memRead: '0',
    memWrite: '0',
    regWrite: '1',
    branch: '0',
    size: 'x',
    jump: '0',
}
const LOAD_CTRL:CTRL = {
    aluSrc: '1',
    toReg: TOREGCODES.getCode('data').toString(),
    memRead: '1',
    memWrite: '0',
    regWrite: '1',
    branch: '0',
    size: 'x',
    jump: '0',
}
const STORE_CTRL:CTRL = {
    aluSrc: '1',
    toReg: 'x',
    memRead: '0',
    memWrite: '1',
    regWrite: '0',
    branch: '0',
    size: 'x',
    jump: '0',
}
const BRANCH_CTRL:CTRL = {
    aluSrc: '0',
    toReg: 'x',
    memRead: '0',
    memWrite: '0',
    regWrite: '0',
    branch: '0',
    size: 'x',
    jump: '0',
}
const UPPER_CTRL:CTRL = {
    aluSrc: 'x',
    toReg: 'x',
    memRead: '0',
    memWrite: '0',
    regWrite: '1',
    branch: '0',
    size: 'x',
    jump: '0',
}

const JUMP_CTRL:CTRL = {
    aluSrc: '0',
    toReg: TOREGCODES.getCode('jump').toString(),
    memRead: '0',
    memWrite: '0',
    regWrite: '1',
    branch: BRANCHCODES.getCode('jump').toString(),
    size: 'x',
    jump: '0',
}

export const INSTRUCTIONS:Record<number, INST> =  {
    0: {
        ...R_CTRL,
        name: 'NOP',
        op: ALUCODES.getCode('ADD'),
    },
    // R_TYPES
    0b0000000_000_0110011: {
        ...R_CTRL,
        name: 'ADD',
        op: ALUCODES.getCode('ADD'),
    },
    0b0100000_000_0110011: {
        ...R_CTRL,
        name: 'SUB',
        op: ALUCODES.getCode('SUB'),
    },
    0b0000000_110_0110011: {
        ...R_CTRL,
        name: 'OR',
        op: ALUCODES.getCode('OR'),
    },
    0b0000000_111_0110011: {
        ...R_CTRL,
        name: 'AND',
        op: ALUCODES.getCode('AND'),
    },

    // Loads
    0b000_0000011: {
        ...LOAD_CTRL,
        name: 'LB',
        op: ALUCODES.getCode('ADD'),
        size: '1',
    },
    0b001_0000011: {
        ...LOAD_CTRL,
        name: 'LH',
        op: ALUCODES.getCode('ADD'),
        size: '2',
    },
    0b010_0000011: {
        ...LOAD_CTRL,
        name: 'LW',
        op: ALUCODES.getCode('ADD'),
        size: '4',
    },
    // Stores
    0b000_0100011: {
        ...STORE_CTRL,
        name: 'SB',
        op: ALUCODES.getCode('ADD'),
        size: '1',
    },
    0b001_0100011: {
        ...STORE_CTRL,
        name: 'SH',
        op: ALUCODES.getCode('ADD'),
        size: '2',
    },
    0b010_0100011: {
        ...STORE_CTRL,
        name: 'SW',
        op: ALUCODES.getCode('ADD'),
        size: '4',
    },

    // branch
    0b000_1100011: {
        ...BRANCH_CTRL,
        name: 'BEQ',
        op: ALUCODES.getCode('SUB'),
        branch: BRANCHCODES.getCode('zero').toString()
    },
    0b001_1100011: {
        ...BRANCH_CTRL,
        name: 'BNE',
        op: ALUCODES.getCode('SUB'),
        branch: BRANCHCODES.getCode('notzero').toString()
    },
    0b100_1100011: {
        ...BRANCH_CTRL,
        name: 'BLT',
        op: ALUCODES.getCode('SUB'),
        branch: BRANCHCODES.getCode('signbit').toString()
    },
    0b101_1100011: {
        ...BRANCH_CTRL,
        name: 'BGE',
        op: ALUCODES.getCode('SUB'),
        branch: BRANCHCODES.getCode('notsignbit').toString()
    },

    // jump
    0b1101111: {
        ...JUMP_CTRL,
        name: 'JAL',
        // dont care
        op: ALUCODES.getCode('ADD'),
    },
    0b1100111: {
        ...JUMP_CTRL,
        name: 'JALR',
        op: ALUCODES.getCode('ADD'),
        jump: '1',
    },
    // upper
    0b011_0111: {
        ...UPPER_CTRL,
        name: 'LUI',
        // dont care
        op: ALUCODES.getCode('ADD'),
        toReg: TOREGCODES.getCode('lui').toString()
    },
    // 0b001_0111: {
    //     ...UPPER_CTRL,
    //     name: 'AUIPC',
    //     // dont care
    //     op: ALUCODES.getCode('ADD'),
    //     toReg: TOREGCODES.getCode('auipc').toString()
    // },

}

export const INST_NAMES = Object.fromEntries(Object.entries(INSTRUCTIONS).map(([key, value])=> {return [value.name, key]}));
