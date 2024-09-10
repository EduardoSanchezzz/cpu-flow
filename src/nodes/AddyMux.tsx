import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isAddyAdderNode, type AppNode, AddyMuxNode } from './types';

import bgSvg from '../assets/Mux.svg';

function AddyMux({ id, data }: NodeProps<AddyMuxNode>) {
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

  const branchAdderNode = branchAdderNodesData.filter(isAddyAdderNode);
  
  const ControlConnections = useHandleConnections({
    type: 'target',
    id: 'branch-and-out'
  });
  const ControlNodesData = useNodesData<AppNode>(ControlConnections.map((connection) => connection.source),);

  const ControlNode = ControlNodesData.filter(isAddyAdderNode);
  // end inputs

  // update outputs
  useEffect(() => {
    const output = !false ? AddyAdderNode[0]?.data.out : branchAdderNode[0].data.out;
    updateNodeData(id, { out: output });
  }, [AddyAdderNode]);

  return (
    <div
      className='container addy-mux'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='control'>
        <Handle
          type="target"
          position={Position.Bottom}
          id="branch-and-out"
          style={{transform: 'translate(-50%, -200%)'}}
        />
      </div>
      <div className='inputs'>
        <Handle
          type="target"
          position={Position.Left}
          id="addy-adder-out"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="branch-adder-out"
        />
      </div>
      {/* {data.compdata} */}
      <div className='outputs'>
        <Handle type="source" position={Position.Right}/>
      </div>
    </div>
  );
}

export default memo(AddyMux);
