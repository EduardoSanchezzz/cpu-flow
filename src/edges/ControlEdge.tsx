import { BaseEdge, EdgeLabelRenderer, EdgeProps, getStraightPath, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import { AppNode } from '../nodes/types';
import { useEffect } from 'react';
import { controlEdge } from './index';

export default function ControlEdge({ id, sourceX, sourceY, targetX, targetY, source, sourceHandleId, data }: EdgeProps<controlEdge> ) {
  const { updateEdgeData } = useReactFlow();
  const [path1] = getStraightPath({
    sourceX, sourceY, 
    targetX: targetX, targetY: sourceY
  })
  const [path2] = getStraightPath({
    sourceX: targetX, sourceY, 
    targetX, targetY
  })
  const path = path1+path2;
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
      <BaseEdge id={id} path={path} style = {{stroke: '#9dd6f5'}} />
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