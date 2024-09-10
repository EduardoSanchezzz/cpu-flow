import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react';

import { type PositionLoggerNode } from './types';
import { useState } from 'react';

export function PositionLoggerNode({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<PositionLoggerNode>) {
  const [value, setValue] = useState(0);
  const { updateNodeData } = useReactFlow();

  const update = () => {
    let newVal = value + 1
    updateNodeData(id, {value :newVal});
    setValue(newVal);
  }
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="react-flow__node-default">
      {data.label && <div>{data.label}</div>}
      <button onClick={update}>Click Me</button>

      <div>
        {x} {y}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
