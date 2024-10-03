import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow } from '@xyflow/react';
import { ClockNode } from './types';

function Clock({ id, data }: NodeProps<ClockNode>) {
  const { updateNodeData } = useReactFlow();

  const reset = () => {
    updateNodeData('pc', { address: 'x' });
    updateNodeData('clock', { clk: 0, step: -1 });
}

  return (
    <div
      className='clock'
    >
      <div className="display-title">CLOCK</div>
      <button
      // the exoression for the clock step is a lil weird but it just increments the step only on positive clock edge
        onClick={() => updateNodeData(id, { clk: !!data.clk ? 0 : 1, step: Math.floor(data.step + 1 - 0.5*data.clk) })}
        value={data.clk}
        className={`step${!data.clk ? ' step-low' : ''}`}
      >
        Step
         {/* {data.step < 0 ? 'x' : data.step} */}
      </button>
      <button className='reset' onClick={reset}>reset</button>
      <Handle
        className='handle' type="source"
        position={Position.Bottom}
        style={{ position: 'absolute' }}
        id='clk'
      />
      <div className='more-info'>
        ?
        <div className='tooltip'>
          <div className='tt-title'>Clock</div>
          <div>a timing mechanism that coordinates the execution of instructions</div>
          <div className='tt-subtitle'>Step</div>
          <div>Toggles the clock signal between high and low, mimicking a single clock cycle</div>
          <div>Click once to set the clock high (execute), and again to set it low (complete)</div>
          <div className='tt-subtitle'>Reset</div>
          <div>Resets the CPU to its initial state by setting PC to high impedance state (x) and next address to 0</div>
        </div>
      </div>
    </div>
  );
}

export default memo(Clock);