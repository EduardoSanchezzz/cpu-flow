
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
    let NBitStr = num.toString(2);

    while (NBitStr.length < N) {
        NBitStr = '0' + NBitStr
    }

    return NBitStr;
}
export const makeDecStrNBitsLong = (str:string, N:number):string => {
    let NBitStr = parseInt(str).toString(2);

    while (NBitStr.length < N) {
        NBitStr = '0' + NBitStr
    }

    return NBitStr;
}

const R_OP = 0b011_0011;
const R_IMM_OP = 0b001_0011;
const LOAD_OP = 0b000_0011;
const S_OP = 0b010_0011;
const B_OP = 0b110_0011;

export const TIMEOUT = 0;

export const TYPES = new Map<number|"opcode", string>();
TYPES.set(R_OP, 'R');
TYPES.set(R_IMM_OP, 'I');
TYPES.set(LOAD_OP, 'I');
TYPES.set(S_OP, 'S');
TYPES.set(B_OP, 'B');

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
    toReg: '0',
    memRead: '0',
    memWrite: '0',
    regWrite: '1',
    branch: '0',
    size: 'x',
    jump: '0',
}
const LOAD_CTRL:CTRL = {
    aluSrc: '1',
    toReg: '1',
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
    branch: '1',
    size: 'x',
    jump: '0',
}

export const INSTRUCTIONS:Record<number, INST> =  {
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
    }

}

export const INST_NAMES = Object.fromEntries(Object.entries(INSTRUCTIONS).map(([key, value])=> {return [value.name, key]}));
