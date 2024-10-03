import { memo } from 'react';

function Title() {

  return (
    <div
      className='title'
    >
      <div className='title-text'>RISC-V CPU Simulator</div>
      <div className='more-info'>
        ?
        <div className='tooltip'>
          <div className='tt-title'></div>
          <div>This tool is designed to help you(and me) explore understand the inner workings of a minimal RISC-V CPU, making it easier to visualize how data and instructions flow within a processor.</div>
          <div>This simulation helps you get familiar with how a CPU fetches, decodes, and executes instructions.</div>
          <div className='tt-subtitle'>More Info</div>
          <div>Hover over any question mark to give more info about that specific component</div>
          <div className='tt-subtitle'>How to Use</div>
          <div><span className='tt-param'>Clock: </span>The clock is the heartbeat of the CPU. Press Step to advance the clock and execute the next stage of an instruction. Each instruction needs a full clock cycle(2 steps) to execute</div>
          <div><span className='tt-param'>PC (Program Counter): </span>Watch as the PC increments or jumps to a new address, controlling the flow of instructions</div>
          <div><span className='tt-param'>Registers: </span>Monitor data being read from or written to registers, giving you insight into how values are handled during computation</div>
        </div>
      </div>
    </div>
  );
}

export default memo(Title);
