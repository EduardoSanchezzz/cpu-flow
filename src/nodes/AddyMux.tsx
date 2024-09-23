import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isAddyAdderNode, type AppNode, AddyMuxNode, isBranchAdderNode, isBranchControlNode } from './types';

import bgSvg from '../assets/Mux.svg';

function AddyMux({ id }: NodeProps<AddyMuxNode>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const addyAdderConnections = useHandleConnections({
    type: 'target',
    id: 'addy-adder-out'
  });
  const addyAdderNodesData = useNodesData<AppNode>(addyAdderConnections.map((connection) => connection.source),);

  const AddyAdderNode = addyAdderNodesData.filter(isAddyAdderNode);

  const branchAdderConnections = useHandleConnections({
    type: 'target',
    id: 'branch-adder-out'
  });
  const branchAdderNodesData = useNodesData<AppNode>(branchAdderConnections.map((connection) => connection.source),);

  const branchAdderNode = branchAdderNodesData.filter(isBranchAdderNode);
  
  const ControlConnections = useHandleConnections({
    type: 'target',
    id: 'branch-select'
  });
  const ControlNodesData = useNodesData<AppNode>(ControlConnections.map((connection) => connection.source),);

  const ControlNode = ControlNodesData.filter(isBranchControlNode);
  // end inputs

  // update outputs
  // FIX
  const addyAdderIn = AddyAdderNode[0]?.data.out;
  const branchAdderIn = branchAdderNode[0]?.data.out;
  const select = ControlNode[0]?.data.branchSelect;
  useEffect(() => {

    // if (controlIn == 'x') {
    //   updateNodeData(id, { out: 'x' });
    //   return;
    // }

    const selectNum = parseInt(select);
    const output = !selectNum ? addyAdderIn : branchAdderIn;

    // this one should never be high impedance honestly except at initial
    const forcedOutput = output == 'x' ? '0' : output;

    updateNodeData(id, { out: forcedOutput });
  }, [addyAdderIn, branchAdderIn, select]);

  return (
    <div
      className='container mux'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='control'>
        <Handle
          className='handle'
          type="target"
          position={Position.Bottom}
          id="branch-select"
          style={{position: 'absolute', transform: 'translate(0%, -255%)'}}
        />
      </div>
      <div className='inputs'>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="addy-adder-out"
          />
        </div>
        <div className="port">
          <Handle
            className='handle'
            type="target"
            position={Position.Left}
            id="branch-adder-out"
          />
        </div>
      </div>
      <div className='outputs'>
        <div className="port">
          <Handle
            className='handle' type="source" position={Position.Right} id='next-address' />
        </div>
      </div>
    </div>
  );
}

export default memo(AddyMux);
