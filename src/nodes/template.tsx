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

import bgSvg from '';

function component_name({ id, data }: NodeProps<NodeType>) {
  const { updateNodeData } = useReactFlow();

  // inputs
  const connections1 = useHandleConnections({
    type: 'target',
    // id: 'handle_id'
  });
  const nodesData1 = useNodesData<AppNode>(connections1.map((connection) => connection.source),);

  const inputNode1 = nodesData1.filter(isNodeType);
  // end inputs

  // update outputs
  useEffect(() => {
    const output = inputNode1[0]?.data.prop;
    updateNodeData(id, { out: output });
  }, [inputNode1]);

  return (
    <div
      className='container component'
    >
      <div className='bg'>
        <img src={bgSvg}></img>
      </div>
      <div className='control'>
        <Handle
          type="target"
          position={Position.Top}
          id="ctrl-handle-id"
        />
      </div>
      <div className='inputs'>
        <Handle
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
        <Handle type="source" position={Position.Right} />
        <div className="label">
          Output1
        </div>
      </div>
    </div>
  );
}

export default memo(component_name);
