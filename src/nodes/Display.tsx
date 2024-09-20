import { memo } from 'react';
import {
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isDataMemNode, isInstDecodeNode, isRegListNode, type AppNode, } from './types';

function Display() {
  // inputs
  const regConnections = useHandleConnections({
    type: 'target',
    id: 'read-data1',
    nodeId: 'alu'
  });
  const regNodesData = useNodesData<AppNode>(regConnections.map((connection) => connection.source),);
  const regNode = regNodesData.filter(isRegListNode);

  const instDecodeConnections = useHandleConnections({
    type: 'target',
    id: 'read-reg1',
    nodeId: 'reg-list'
  });
  const instDecodeData = useNodesData<AppNode>(instDecodeConnections.map((connection) => connection.source),);

  const instDecodeNode = instDecodeData.filter(isInstDecodeNode);

  const dataMemConnections = useHandleConnections({
    type: 'target',
    id: 'read-data-mem',
    nodeId: 'data-mux'
  });
  const dataMemNodesData = useNodesData<AppNode>(dataMemConnections.map((connection) => connection.source),);

  const dataMemNode = dataMemNodesData.filter(isDataMemNode);
  // end inputs

  const regList = regNode[0]?.data.regList;
  const dataMem = dataMemNode[0]?.data.dataMem;

  const reg1 = parseInt(instDecodeNode[0]?.data.readAddress1)
  const reg2 = parseInt(instDecodeNode[0]?.data.readAddress2)

  const display8BitBinary = (decStr:string):string => {
    if (!decStr) {return '';}
    let out = parseInt(decStr).toString(2)
    while (out.length < 8) {
      out = '0' + out;
    }
    return out;
  }
  const display32BitHex = (dec:number):string => {
    let out = dec.toString(16)
    while (out.length < 8) {
      out = '0' + out;
    }
    return out;
  }

  return (
    <div
      className='display'
    >
      <div>
        REG
        {regList.map((item, i) => { 
          return (
            <div className='reg-display'>
              x{i}
            <li style={{backgroundColor: i == reg1 ? '#d6eaff' : i == reg2 ? '#d6eaff' : ''}}key={i}>0x{display32BitHex(item)}</li>
            </div>
          );
        })}
      </div>
      <div>
        DATA
        {dataMem.map((item, i) => {
          if ((i % 4) != 0) {return;} 
          return (
            <div className='data-display'>
              <li key={i+3}>{display8BitBinary(dataMem[i+3])}</li>
              <li key={i+2}>{display8BitBinary(dataMem[i+2])}</li>
              <li key={i+1}>{display8BitBinary(dataMem[i+1])}</li>
              <li key={i}>{display8BitBinary(item)}</li>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Display);
