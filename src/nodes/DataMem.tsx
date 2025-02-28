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
import { makeDecStrNBitsLong, TIMEOUT } from '../utils';

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
      setTimeout(() => {
        updateNodeData(id, { readDataMem: 'x' });
      }, TIMEOUT);
      return;
    }

    const addressNum = parseInt(address);
    const sizeNum = parseInt(size);

    if (memRead == '1') {
      let readDataMem = '';
      for (let i = 0; i < sizeNum; ++i) {
        readDataMem = makeDecStrNBitsLong(data.dataMem[addressNum + i], 8) + readDataMem;
      }
      readDataMem = parseInt(readDataMem, 2).toString()
      setTimeout(() => {
        updateNodeData(id, { readDataMem });
      }, TIMEOUT);
    }

  }, [address, memRead, size]);

  useEffect(() => {
    if (address == 'x' || size == 'x') {
      setTimeout(() => {
        updateNodeData(id, { readDataMem: 'x' });
      }, TIMEOUT);
      return;
    }
    if (clock == 1 || memWrite != '1') return;
    const newDataMem = [...data.dataMem];
    const addressNum = parseInt(address);
    const writeDataNum = parseInt(writeData);
    const sizeNum = parseInt(size);


    for (let i = 0; i < sizeNum; ++i) {
      const writeDataByte = (writeDataNum >> (8 * i)) & 0b1111_1111;
      newDataMem[addressNum + i] = writeDataByte.toString();
    }

    setTimeout(() => {
      updateNodeData(id, {
        dataMem: newDataMem
      });
    }, TIMEOUT);
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
      <div className='more-info'>
        ?
        <div className='tooltip'>
          <div className='tt-title'>Data Memory</div>
          <div>stores and retrieves data during program execution </div>
          <div>Note: writes occur on negative clock edges</div>
          <div className='tt-subtitle'>Inputs</div>
          <div><span className='tt-param'>Address:</span> Specifies the memory location for read/write operations</div>
          <div><span className='tt-param'>Write Data:</span> Data to be stored in memory at the given address</div>
          <div className='tt-subtitle'>Output</div>
          <div><span className='tt-param'>Read Data:</span> Data read from memory at the specified address</div>
          <div className='tt-subtitle tt-ctrl'>Control</div>
          <div className='tt-ctrl-txt'><span className='tt-param tt-ctrl'>MemRead:</span> Signal to perform a memory read operation</div>
          <div className='tt-ctrl-txt'><span className='tt-param tt-ctrl'>MemWrite:</span> Signal to perform a memory write operation</div>
          <div className='tt-ctrl-txt'><span className='tt-param tt-ctrl'>Size:</span> Defines the size of the data to be read or written in bytes</div>
        </div>
      </div>
    </div>
  );
}

export default memo(DataMem);
