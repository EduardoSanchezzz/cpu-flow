import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isInstDecodeNode, type AppNode, RegListNode, isControlNode, isDataMuxNode, isClockNode } from './types';

import bgSvg from '../assets/RegList.svg';
import { TIMEOUT } from '../utils';

function RegList({ id, data }: NodeProps<RegListNode>) {
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
  const instDecodeConnections = useHandleConnections({
    type: 'target',
    id: 'read-reg1'
  });
  const instDecodeData = useNodesData<AppNode>(instDecodeConnections.map((connection) => connection.source),);

  const instDecodeNode = instDecodeData.filter(isInstDecodeNode);

  const dataMuxConnections = useHandleConnections({
    type: 'target',
    id: 'write-data'
  });
  const DataMuxData = useNodesData<AppNode>(dataMuxConnections.map((connection) => connection.source),);

  const DataMuxNode = DataMuxData.filter(isDataMuxNode);

  const controlConnections = useHandleConnections({
    type: 'target',
    id: 'reg-write'
  });
  const ControlData = useNodesData<AppNode>(controlConnections.map((connection) => connection.source),);

  const ControlNode = ControlData.filter(isControlNode);
  // end inputs

  const readAddress1 = instDecodeNode[0]?.data.readAddress1;
  const readAddress2 = instDecodeNode[0]?.data.readAddress2;
  const writeAddress = instDecodeNode[0]?.data.writeAddress;
  const regWrite = ControlNode[0]?.data.regWrite;
  const writeData = DataMuxNode[0].data.out;
  // update outputs
  useEffect(() => {
    if (readAddress1 == 'x') {
      setTimeout(() => {
        updateNodeData(id, {
          readData1: 'x',
          readData2: 'x',
        });
      }, TIMEOUT);
      return;
    }

    const readAddress1Num = parseInt(readAddress1);
    const readAddress2Num = parseInt(readAddress2);

    const readData1Num = data.regList[readAddress1Num];
    const readData2Num = data.regList[readAddress2Num];

    const readData1 = readData1Num;
    const readData2 = readData2Num;

    setTimeout(() => {
      updateNodeData(id, {
        readData1,
        readData2
      });
    }, TIMEOUT);
  }, [readAddress1, readAddress2]);

  useEffect(() => {
    if (clock == 1 || regWrite != '1') return;
    const newRegList = [...data.regList];
    const writeAddressNum = parseInt(writeAddress);
    const writeDataNum = parseInt(writeData);

    newRegList[writeAddressNum] = writeDataNum;
    newRegList[0] = 0;

    setTimeout(() => {
      updateNodeData(id, {
        regList: newRegList
      });
    }, TIMEOUT);
  }, [clock, regWrite, writeData, writeAddress])

  return (
    <div
      className='container reg-list'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='control'>
        <Handle
          className='handle'
          type="target"
          position={Position.Top}
          id="reg-write"
        />
      </div>
      <div className='inputs'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="read-reg1"
          />
          <div className="label">
            Read Reg 1
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="read-reg2"
          />
          <div className="label">
            Read Reg 2
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="write-reg"
          />
          <div className="label">
            Write Reg
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="write-data"
          />
          <div className="label">
            Write Data
          </div>
        </div>
      </div>
      <div className='name'>{data.label}</div>
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='read-data1' />
          <div className="label">
            Read Data 1
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='read-data2' />
          <div className="label">
            Read Data 2
          </div>
        </div>
      </div>
      <div className='more-info'>
        ?
        <div className='tooltip'>
          <div className='tt-title'>Register List</div>
          <div>stores a list of 32 32-bit registers</div>
          <div className='tt-subtitle'>Inputs</div>
          <div><span className='tt-param'>Read Register 1: </span>5-bit address of the first register to read (rs1)</div>
          <div><span className='tt-param'>Read Register 2: </span>5-bit address of the second register to read (rs2)</div>
          <div><span className='tt-param'>Write Register: </span>5-bit address of the register to write to (rd)</div>
          <div><span className='tt-param'>Write Data: </span>32-bit value to be written into the write register</div>
          <div className='tt-subtitle'>Outputs</div>
          <div><span className='tt-param'>Read Data 1: </span>value read from the first register(rs1)</div>
          <div><span className='tt-param'>Read Data 2: </span>value read from the second register(rs2)</div>
          <div className='tt-subtitle tt-ctrl'>Control</div>
          <div className='tt-ctrl-txt'><span className='tt-param tt-ctrl'>Reg Write: </span>control signal that enables or disables writing to the register file</div>
        </div>
      </div>
    </div>
  );
}

export default memo(RegList);
