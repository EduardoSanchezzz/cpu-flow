import { memo, useEffect, useState } from 'react';
import {
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react';

import { isAluNode, isClockNode, isControlNode, isDataMemNode, isInstDecodeNode, isRegListNode, type AppNode, } from './types';
import { numToSignedNBitHexStr, signedNBitHexStrToNum, TIMEOUT } from '../utils';

function Display() {
  const { updateNodeData } = useReactFlow();
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
  const memRead = parseInt(ControlNode[0].data.memRead);
  const size = parseInt(ControlNode[0].data.size);
  const memAddy = parseInt(aluNode[0]?.data.out);


  const clock = clockNode[0]?.data.clk;

  const updateRegVal = (i: number, regVal: number) => {
    const newArr = [...regList];
    newArr[i] = regVal;
    newArr[0] = 0;
    setTimeout(() => {
      updateNodeData('reg-list', { regList: [...newArr] });
    }, TIMEOUT);
  }
  const updateDataval = (i: number, cellVal: string) => {
    const newArr = [...dataMem];
    newArr[i] = cellVal;
    setTimeout(() => {
      updateNodeData('data-mem', { dataMem: [...newArr] });
    }, TIMEOUT);
  }

  return (
    <div className='display'>
      <div className="reg-display-container-container">
        <div className="display-title">REGISTER LIST</div>
        <div className='reg-display-container'>
          {regList.map((item, i) => {
            return (
              <Register
                key={i}
                index={i}
                regVal={item}
                updateRegVal={updateRegVal}
                regType={
                  i == reg1 ? 'reg1-display' :
                    i == reg2 ? 'reg2-display' :
                      (i == reg3) && !clock && !!regWrite ? 'reg3-display' :
                        'regx-display'
                }
              />
            );
          })}
        </div>
      </div>
      <div className="data-display-container-container">
        <div className="display-title">DATA MEMORY</div>
        <div className='data-display-container'>
          {dataMem.map((item, i) => {
            // if ((i % 4) != 0) { return; }
            return (
              //   <div key={i + 'data-index'} className='data-display-index'>{i}</div>
              // </div>
              <DataCell
                key={i}
                index={i}
                cellVal={item}
                updateCellVal={updateDataval}
                cellType={
                  (i >= memAddy) && (i < (memAddy + size)) ?
                    !!memRead ? 'data-read-display' : !clock ? 'data-write-display' :
                      'data-cell-display' : 'data-cell-display'
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(Display);

function Register({
  regVal,
  updateRegVal,
  index,
  regType
}: {
  regVal: number,
  updateRegVal: (i: number, regVal: number) => void,
  index: number,
  regType: string
}) {
  const [regDisplay, setRegDisplay] = useState('');

  const updateReg = (e: any) => {
    let newReg = signedNBitHexStrToNum(e.target.value, 32);
    if (index == 0) {
      newReg = 0;
    }
    if (newReg === undefined) {
      setRegDisplay(numToSignedNBitHexStr(regVal, 32));
      return;
    }
    updateRegVal(index, newReg);
    setRegDisplay(numToSignedNBitHexStr(newReg, 32));
  }
  useEffect(() => {
    setRegDisplay(numToSignedNBitHexStr(regVal, 32));
  }, [regVal])

  return (
    <div className="reg-display">
      <div className="reg-addy">x{index}</div>
      <input type="text" className={regType} value={regDisplay} onBlur={updateReg} onChange={(e) => setRegDisplay(e.target.value)} />
    </div>
  )

}
function DataCell({
  cellVal,
  updateCellVal,
  index,
  cellType
}: {
  cellVal: string,
  updateCellVal: (i: number, cellVal: string) => void,
  index: number,
  cellType: string
}) {
  const [cellDisplay, setCellDisplay] = useState('');

  const updateCell = (e: any) => {
    const newCellNum = signedNBitHexStrToNum(e.target.value, 8);
    const newCell = newCellNum.toString();
    const newCellDisp = numToSignedNBitHexStr(newCellNum, 8);
    if (newCellNum === undefined) {
      setCellDisplay(numToSignedNBitHexStr(parseInt(cellVal), 8));
      return;
    }
    updateCellVal(index, newCell);
    setCellDisplay(newCellDisp);
  }
  useEffect(() => {
    const cellVallNum = parseInt(cellVal);
    setCellDisplay(numToSignedNBitHexStr(cellVallNum, 8));
  }, [cellVal])

  return (
    <input type="text" className={cellType} value={cellDisplay} onBlur={updateCell} onChange={(e) => setCellDisplay(e.target.value)} />
  )

}
