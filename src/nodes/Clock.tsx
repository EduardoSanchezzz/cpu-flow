import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';
import { ClockNode } from './types';

function Clock({ id, data }: NodeProps<ClockNode>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div
      className='clock'
    >
      <div>
        <div>clk: {!!data.clk ? 'HIGH': 'LOW'}</div>
        <div>step: {data.step < 0 ? 'X': data.step}</div>
      </div>
      <button
      // the exoression for the clock step is a lil weird but it just increments the step only on positive clock edge
        onClick={() => updateNodeData(id, { clk: !!data.clk ? 0 : 1, step: Math.floor(data.step + 1 - 0.5*data.clk) })}
        value={data.clk}
      >
        Step
      </button>
      <Handle
        className='handle' type="source"
        position={Position.Bottom}
        style={{ position: 'absolute' }}
        id='clk'
      />
    </div>
  );
}

export default memo(Clock);