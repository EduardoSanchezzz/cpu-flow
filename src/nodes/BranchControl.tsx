import { memo, useEffect } from 'react';
import {
    Position,
    NodeProps,
    useReactFlow,
    Handle,
    useHandleConnections,
    useNodesData,
} from '@xyflow/react';

import { type AppNode, BranchControlNode, isAluNode, isControlNode } from './types';

import bgSvg from '../assets/BranchControl.svg';
import { BRANCHCODES, TIMEOUT } from '../utils';

function BranchControl({ id, data }: NodeProps<BranchControlNode>) {
    const { updateNodeData } = useReactFlow();

    // inputs
    const controlConnections = useHandleConnections({
        type: 'target',
        id: 'branch'
    });
    const ControlData = useNodesData<AppNode>(controlConnections.map((connection) => connection.source),);
    const ControlNode = ControlData.filter(isControlNode);

    const aluConnections = useHandleConnections({
        type: 'target',
        id: 'alu-zero'
    });
    const aluNodesData1 = useNodesData<AppNode>(aluConnections.map((connection) => connection.source),);
    const aluNode = aluNodesData1.filter(isAluNode);
    // end inputs

    const zero = aluNode[0]?.data.zero;
    const sign = aluNode[0]?.data.sign;
    const branch = ControlNode[0]?.data.branch;
    // update outputs
    useEffect(() => {
        if (branch == 'x') {
            setTimeout(() => {
                updateNodeData(id, { branchSelect: 'x' });
            }, TIMEOUT);
            return;
        }
        let outputBool;
        switch (BRANCHCODES.getName(parseInt(branch))) {
            case 'nobranch':
                outputBool = false;
                break;
            case 'zero':
                outputBool = zero == '1';
                break;
            case 'notzero':
                outputBool = zero != '1';
                break;
            case 'signbit':
                outputBool = sign == '1';
                break;
            case 'notsignbit':
                outputBool = sign != '1';
                break;
            case 'jump':
                outputBool = true;
                break;

            default:
                outputBool = false;
                break;
        }
        const output = outputBool ? '1' : '0';
        // console.table({zero, sign, branch, output, outputBool})
        setTimeout(() => {
            updateNodeData(id, { branchSelect: output });
        }, TIMEOUT);
    }, [zero, sign, branch]);

    return (
        <div
            className='container branch-control'
        >
            <div className='bg'>
                <img src={bgSvg}></img>
            </div>
            <div className='control'>
                <Handle
                    className='handle'
                    type="target"
                    position={Position.Top}
                    id="branch"
                />
            </div>
            <div className='inputs'>
                <div className="port">
                    <Handle
                        className='handle'
                        type="target"
                        position={Position.Left}
                        id="alu-zero"
                    />
                    <div className="label">
                        zero
                    </div>
                </div>
                <div className="port">
                    <Handle
                        className='handle'
                        type="target"
                        position={Position.Left}
                        id="alu-sign"
                    />
                    <div className="label">
                        sign
                    </div>
                </div>
            </div>
            <div className='name'>{data.label}</div>
            {/* {data.compdata} */}
            <div className='outputs'>
                <div className="port">
                    <Handle
                        className='handle'
                        type="source"
                        position={Position.Right}
                        id="branch-select"
                    />
                    <div className="label">
                        select
                    </div>
                </div>
            </div>
            <div className='more-info'>
                ?
                <div className='tooltip'>
                    <div className='tt-title'>Branch Control</div>
                    <div>determines whether a branch should be taken based on branch conditions and control signals from the instruction</div>
                    <div className='tt-subtitle'>Inputs</div>
                    <div><span className='tt-param'>branch: </span>specifies the type of branch condition(equal, not equal, less than, etc.)</div>
                    <div><span className='tt-param'>zero: </span>Indicates if the ALU result is zero</div>
                    <div><span className='tt-param'>sign: </span>Indicates if the ALU result is negative</div>
                    <div className='tt-subtitle'>Output</div>
                    <div><span className='tt-param'>select: </span>Signal to decide whether to take the branch or not</div>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">branch code</th>
                                <th scope="col">Instruction</th>
                                <th scope="col">Output</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope='row'>000</th>
                                <td>Other</td>
                                <td>never take branch</td>
                            </tr>
                            <tr>
                                <th scope='row'>001</th>
                                <td>BEQ</td>
                                <td>take branch only if difference is zero (operands are equal)</td>
                            </tr>
                            <tr>
                                <th scope='row'>010</th>
                                <td>BNE</td>
                                <td>take branch only if difference is not zero (operands are not equal)</td>
                            </tr>
                            <tr>
                                <th scope='row'>011</th>
                                <td>BLT</td>
                                <td>take branch only if difference is negative (operand1 is less than operand2)</td>
                            </tr>
                            <tr>
                                <th scope='row'>100</th>
                                <td>BGE</td>
                                <td>take branch only if difference is not negative (operand1 is greater than or equal to operand2)</td>
                            </tr>
                            <tr>
                                <th scope='row'>111</th>
                                <td>JAL, JALR</td>
                                <td>always take branch</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default memo(BranchControl);
