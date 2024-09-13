import { memo, useEffect } from 'react';
import {
  Position,
  NodeProps,
  useReactFlow,
  Handle,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';

import { isNodeType, type AppNode, NodeType } from './types';

import bgSvg from '../assets/';

function component_name({ id, data }: NodeProps<NodeType>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const connections1 = useHandleConnections({
    type: 'target',
    id: 'handle_id'
  });
  const nodesData1 = useNodesData<AppNode>(connections1.map((connection) => connection.source),);

  const inputNode1 = nodesData1.filter(isNodeType);
  // end inputs

  const input1 = inputNode1[0]?.data.prop;
  // update outputs
  useEffect(() => {
    
    if (input1 == 'x') {
      updateNodeData(id, { out: 'x' });
      return;
    }
    const inputNum1 = parseInt(input1);
    const outputNum = inputNum1;

    const output = outputNum.toString();
    updateNodeData(id, { out: output });
  }, [input1]);

  return (
    <div
      className='container component_name'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='control'>
        <Handle
className='handle'
          type="target"
          position={Position.Top}
          id="ctrl-handle-id"
        />
      </div>
      <div className='inputs'>
        <Handle
className='handle'
          type="target"
          position={Position.Left}
          id="input-handle-id"
        />
         <div className="label">
          Input1
        </div>
      </div>
      <div className='name'>{data.label}</div>
      {/* {data.compdata} */}
      <div className='outputs'>
        <Handle
className='handle' 
          type="source" 
          position={Position.Right} 
          id="out-handle-id"
        />
        <div className="label">
          Output1
        </div>
      </div>
    </div>
  );
}

export default memo(component_name);
