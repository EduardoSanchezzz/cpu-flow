import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSimpleBezierPath, getSmoothStepPath, getStraightPath, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import { AppNode } from '../nodes/types';
import { useEffect } from 'react';
import { dataEdge } from './index';

export default function DataEdge({ id, sourceX, sourceY, targetX, targetY, source, sourceHandleId, data }: EdgeProps<dataEdge> ) {
  const { updateEdgeData } = useReactFlow();
    const [edgePath, labelX, labelY] = getSimpleBezierPath({
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
      <BaseEdge id={id} path={edgePath} />
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
            color: '#999',
          }}
          className="nodrag nopan"
        >
          {text}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}