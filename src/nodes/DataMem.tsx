import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { type AppNode, DataMemNode, isControlNode, isAluNode, isRegListNode, isClockNode } from './types';

import bgSvg from '../assets/DataMem.svg';

function DataMem({ id, data }: NodeProps<DataMemNode>) {
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
  const aluConnections = useHandleConnections({
    type: 'target',
    id: 'alu-out'
  });
  const aluNodesData1 = useNodesData<AppNode>(aluConnections.map((connection) => connection.source),);
  const aluNode = aluNodesData1.filter(isAluNode);

  const regConnections = useHandleConnections({
    type: 'target',
    id: 'read-data2'
  });
  const regData = useNodesData<AppNode>(regConnections.map((connection) => connection.source),);
  const regNode = regData.filter(isRegListNode);

  const controlConnections = useHandleConnections({
    type: 'target',
    id: 'mem-read'
  });
  const ControlData = useNodesData<AppNode>(controlConnections.map((connection) => connection.source),);
  const ControlNode = ControlData.filter(isControlNode);
  // end inputs

  const address = aluNode[0]?.data.out;
  const writeData = regNode[0]?.data.readData2;
  const memRead = ControlNode[0]?.data.memRead;
  const memWrite = ControlNode[0]?.data.memWrite;
  const size = ControlNode[0]?.data.size;
  // update outputs
  useEffect(() => {
    if (address == 'x' || size == 'x') {
      updateNodeData(id, { readDataMem: 'x' });
      return;
    }

    const addressNum = parseInt(address);
    const writeDataNum = parseInt(writeData);
    const sizeNum = parseInt(size);

    const index = addressNum / 8;

    if (memRead == '1') {
      if ((addressNum % 8) != 0) {
        console.log('address not byte aligned ' + address);
        // return;
      }
      let readDataMem = '';
      for (let i = 0; i < sizeNum; ++i) {
        readDataMem = data.dataMem[index + i] + readDataMem;
        console.log(readDataMem)
      }
      updateNodeData(id, { readDataMem });
    }

  }, [address, memRead, size]);

  useEffect(() => {
    if (address == 'x' || size == 'x') {
      updateNodeData(id, { readDataMem: 'x' });
      return;
    }
    if (clock == 1 || memWrite != '1') return;
    const newDataMem = [...data.dataMem];
    const addressNum = parseInt(address);
    const writeDataNum = parseInt(writeData);
    const sizeNum = parseInt(size);

    if ((addressNum % 8) != 0) {
      alert('address not byte aligned ' + address);
      return;
    }

    const index = addressNum / 8;

    for (let i = 0; i < sizeNum; ++i) {
      const writeDataByte = (writeDataNum >> (8 * i)) & 0b1111_1111;
      newDataMem[index + i] = writeDataByte.toString();
      updateNodeData(id, {});
    }

    updateNodeData(id, {
      dataMem: newDataMem
    });
  }, [clock, memWrite, writeData, address, size])

  return (
    <div
      className='container data-mem'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='control'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Top}
            id="mem-read"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Top}
            id="mem-write"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Top}
            id="size"
          />
        </div>
      </div>
      <div className='inputs'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="alu-out"
          />
          <div className="label">
            Address
          </div>
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="read-data2"
          />
          <div className="label">
            Write Data
          </div>
        </div>
      </div>
      <div className='name'>{data.label}</div>
      <div className='outputs'><div className="port">

        <Handle
          className='handle'
          type="source"
          position={Position.Right}
          id="read-data-mem"
        />
        <div className="label">
          Read Data
        </div>

      </div></div>
    </div>
  );
}

export default memo(DataMem);
