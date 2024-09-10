import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';

function Clock({ id, data }: NodeProps<Node<{ label:string, clk: number }>>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div
      style={{
        background: '#eee',
        color: '#222',
        padding: 10,
        fontSize: 12,
        borderRadius: 10,
      }}
    >
      <div>{data.label}</div>
      <div>{data.clk}</div>
      <div style={{ marginTop: 5 }}>
        <button
          onClick={() => updateNodeData(id, { clk: !!data.clk ? 0 : 1 })}
          value={data.clk}
        >Step </button>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(Clock);