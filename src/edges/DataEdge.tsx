import { BaseEdge, EdgeLabelRenderer, EdgeProps, getStraightPath, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import { AppNode } from '../nodes/types';
import { useEffect } from 'react';
import { dataEdge } from './index';

export default function DataEdge({ id, sourceX, sourceY, targetX, targetY, source, sourceHandleId, data }: EdgeProps<dataEdge> ) {
  const { updateEdgeData } = useReactFlow();
  const offsetX = data?.offsetX ?? 15;
  const offsetY = data?.offsetY ?? 100;

  const [path0] = getStraightPath({sourceX, sourceY, targetX: sourceX+offsetX, targetY:sourceY});
  const [path1] = getStraightPath({sourceX:sourceX+offsetX, sourceY, targetX: sourceX+offsetX, targetY:sourceY+offsetY});
  const [path2] = getStraightPath({sourceX:sourceX+offsetX, sourceY:sourceY+offsetY, targetX: targetX-offsetX, targetY:sourceY + offsetY});
  const [path3] = getStraightPath({sourceX:targetX-offsetX, sourceY:sourceY + offsetY, targetX:targetX-offsetX, targetY});
  const [path4] = getStraightPath({sourceX:targetX-offsetX, sourceY:targetY, targetX, targetY});
  const path = path0 + path1 + path2 + path3 + path4;
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
      <BaseEdge id={id} path={path} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(0%, -60%) translate(${sourceX}px,${sourceY}px)`,
            background: '#fefefe',
            padding: 2,
            borderRadius: 5,
            fontSize: 15,
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