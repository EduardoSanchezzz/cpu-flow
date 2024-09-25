import { BaseEdge, EdgeLabelRenderer, EdgeProps, getStraightPath, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import { AppNode } from '../nodes/types';
import { useEffect, useState } from 'react';
import { dataEdge } from './index';

export default function DataEdge({ id, sourceX, sourceY, targetX, targetY, source, sourceHandleId, data }: EdgeProps<dataEdge> ) {
  const { updateEdgeData } = useReactFlow();
  const [primary, setPrimary] = useState(false);
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
  // @ts-ignore
  const value = nodesData[0]?.data[data?.outputName]
  useEffect(() => {
    updateEdgeData(id, { value });
    if (value != 'x') {setPrimary(!primary);}
    // console.table({id, value, primary})
  }, [nodesData]);

  const val = data?.value ?? 'err';
  const text = typeof val == 'object' ? 'err' : val;

  const color1 = '#999';
  const color2 = '#999';
 
  return (
    <>
      <BaseEdge id={id} path={path} 
      // style={{stroke: primary ? color1 : color2, transition: 'all 1ms linear'}} 
      />
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
            color: primary ? color1 : color2,
          }}
          className="nodrag nopan"
        >
          {text}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}