import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSimpleBezierPath, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import { AppNode } from '../nodes/types';
import { useEffect } from 'react';
import { controlEdge } from './index';

export default function ControlEdge({ id, sourceX, sourceY, targetX, targetY, source, sourceHandleId, data }: EdgeProps<controlEdge> ) {
  const { updateEdgeData } = useReactFlow();
    const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const connections = useHandleConnections({
    type: 'source',
    nodeId: source,
    id: sourceHandleId
  });

  const nodesData = useNodesData<AppNode>(connections.map((connection) => connection.source),);
  useEffect(() => {
    // @ts-ignore
    updateEdgeData(id, { value: nodesData[0]?.data[data?.outputName]});
  }, [nodesData]);

  const val = data?.value ?? 'err';
  const text = typeof val == 'object' ? 'err' : val;
 
  return (
    <>
      <BaseEdge id={id} path={edgePath} style = {{stroke: '#9dd6f5'}} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(0%, -50%) translate(${sourceX}px,${sourceY}px)`,
            background: '#fefefe',
            padding: 2,
            borderRadius: 5,
            fontSize: 10,
            fontWeight: 400,
            color: '#79a5ed',
          }}
          className="nodrag nopan"
        >
          {text}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}