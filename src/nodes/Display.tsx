import { memo } from 'react';
import {
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isAluNode, isClockNode, isControlNode, isDataMemNode, isInstDecodeNode, isRegListNode, type AppNode, } from './types';

function Display() {
  // inputs
  const clockConnections = useHandleConnections({
    type: 'source',
    id: 'clk',
    nodeId: 'clock'
  });
  const clockNodesData = useNodesData<AppNode>(clockConnections.map((connection) => connection.source),);
  const clockNode = clockNodesData.filter(isClockNode);

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
    type: 'source',
    id: 'read-data-mem',
    nodeId: 'data-mem'
  });
  const dataMemNodesData = useNodesData<AppNode>(dataMemConnections.map((connection) => connection.source),);

  const dataMemNode = dataMemNodesData.filter(isDataMemNode);

  const aluConnections = useHandleConnections({
    type: 'source',
    id: 'alu-out',
    nodeId: 'alu',
  });
  const aluNodesData1 = useNodesData<AppNode>(aluConnections.map((connection) => connection.source),);
  const aluNode = aluNodesData1.filter(isAluNode);

  const controlConnections = useHandleConnections({
    type: 'source',
    id: 'mem-read',
    nodeId: 'control',
  });
  const ControlData = useNodesData<AppNode>(controlConnections.map((connection) => connection.source),);
  const ControlNode = ControlData.filter(isControlNode);
  // end inputs

  const regList = regNode[0]?.data.regList;
  const dataMem = dataMemNode[0]?.data.dataMem;

  const reg1 = parseInt(instDecodeNode[0]?.data.readAddress1)
  const reg2 = parseInt(instDecodeNode[0]?.data.readAddress2)
  const reg3 = parseInt(instDecodeNode[0]?.data.writeAddress);
  const regWrite = parseInt(ControlNode[0].data.regWrite);
  const memWrite = parseInt(ControlNode[0].data.memWrite);
  const memRead = parseInt(ControlNode[0].data.memRead);
  const size = parseInt(ControlNode[0].data.size);
  const memAddy = parseInt(aluNode[0]?.data.out);

  console.table({ size, memAddy, memRead })

  const clock = clockNode[0]?.data.clk;

  const display2BitHex = (decStr: string): string => {
    if (!decStr) { return ''; }
    let out = parseInt(decStr).toString(16)
    while (out.length < 2) {
      out = '0' + out;
    }
    return out;
  }
  const display32BitHex = (dec: number): string => {
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
            <div className='reg-display' key={i + 'reg'}>
              x{i}
              <li className={i == reg1 ? 'reg1-display' :
                i == reg2 ? 'reg2-display' :
                  (i == reg3) && !clock && !!regWrite ? 'reg3-display' : ''}
                key={i}>0x{display32BitHex(item)}</li>
            </div>
          );
        })}
      </div>
      <div>
        DATA
        {dataMem.map((item, i) => {
          if ((i % 4) != 0) { return; }
          return (
            <div className="data-display-container" key={i + 'data-container'}>
              <div className='data-display' key={i + 'data'}>
                <li
                  className={((i + 3) >= memAddy) && ((i + 3) < (memAddy + size)) ?
                    !!memRead ? 'highlight-data-read' : !clock ? 'highlight-data-write' : '' :
                    ''}
                  key={i + 3}>{display2BitHex(dataMem[i + 3])}</li>
                <li
                  className={((i + 2) >= memAddy) && ((i + 2) < (memAddy + size)) ?
                    !!memRead ? 'highlight-data-read' : !clock ? 'highlight-data-write' : '' :
                    ''}
                  key={i + 2}>{display2BitHex(dataMem[i + 2])}</li>
                <li
                  className={((i + 1) >= memAddy) && ((i + 1) < (memAddy + size)) ?
                    !!memRead ? 'highlight-data-read' : !clock ? 'highlight-data-write' : '' :
                    ''}
                  key={i + 1}>
                  {display2BitHex(dataMem[i + 1])}
                </li>
                <li
                  className={(i >= memAddy) && (i < (memAddy + size)) ?
                    !!memRead ? 'highlight-data-read' : !clock ? 'highlight-data-write' : '' :
                    ''}
                  key={i}>{display2BitHex(item)}</li>
              </div>
              <div key={i + 'data-index'} className='data-display-index'>{i}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Display);
