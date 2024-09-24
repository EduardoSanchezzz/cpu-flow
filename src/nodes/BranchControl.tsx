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
        id: 'zero'
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
                outputBool = !!zero;
                break;
            case 'notzero':
                outputBool = !zero;
                break;
            case 'signbit':
                outputBool = !!sign;
                break;
            case 'notsignbit':
                outputBool = !sign;
                break;
            case 'jump':
                outputBool = true;
                break;

            default:
                outputBool = false;
                break;
        }
        const output = outputBool ? '1' : '0';
        setTimeout(() => {
            updateNodeData(id, { out: output });
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
        </div>
    );
}

export default memo(BranchControl);
