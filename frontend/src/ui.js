// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { PromptNode } from './nodes/promptNode';
import { VectorDbNode } from './nodes/vectorDbNode';
import { AgentNode } from './nodes/agentNode';
import { WebhookNode } from './nodes/webhookNode';
import { GuardrailNode } from './nodes/guardrailNode';
import { RouterNode } from './nodes/routerNode';
import { GroupNode } from './nodes/groupNode';
import { PreFlightAuditWidget } from './PreFlightAuditWidget';

import 'reactflow/dist/style.css';

const gridSize = 16;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  prompt: PromptNode,
  vectorDb: VectorDbNode,
  agent: AgentNode,
  webhook: WebhookNode,
  guardrail: GuardrailNode,
  router: RouterNode,
  group: GroupNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      setNodes,
      setEdges
    } = useStore(selector, shallow);

    useEffect(() => {
        const savedNodes = JSON.parse(localStorage.getItem('workflow-nodes'));
        const savedEdges = JSON.parse(localStorage.getItem('workflow-edges'));
        if (savedNodes) setNodes(savedNodes);
        if (savedEdges) setEdges(savedEdges);
        setHasLoaded(true);
    }, [setNodes, setEdges]);

    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem('workflow-nodes', JSON.stringify(nodes));
            localStorage.setItem('workflow-edges', JSON.stringify(edges));
        }
    }, [nodes, edges, hasLoaded]);

    const selectedNodes = nodes.filter(n => n.selected);

    const handleGroupSelected = () => {
        if (selectedNodes.length < 2) return;

        const minX = Math.min(...selectedNodes.map(n => n.position.x));
        const minY = Math.min(...selectedNodes.map(n => n.position.y));
        const maxX = Math.max(...selectedNodes.map(n => n.position.x + (n.width || 250)));
        const maxY = Math.max(...selectedNodes.map(n => n.position.y + (n.height || 100)));

        const padding = 40;
        const groupWidth = maxX - minX + padding * 2;
        const groupHeight = maxY - minY + padding * 2;

        const groupId = `group_${Date.now()}`;
        const newGroup = {
            id: groupId,
            type: 'group',
            position: { x: minX - padding, y: minY - padding },
            style: { width: groupWidth, height: groupHeight },
            data: {}
        };

        const newNodes = nodes.map(n => {
            if (n.selected) {
                return {
                    ...n,
                    parentNode: groupId,
                    extent: 'parent',
                    position: {
                        x: n.position.x - (minX - padding),
                        y: n.position.y - (minY - padding)
                    }
                };
            }
            return n;
        });

        setNodes([newGroup, ...newNodes]);
    };

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, addNode, getNodeID]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <>
        <div ref={reactFlowWrapper} className="w-full flex-1 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                snapToGrid={true}
                connectionLineType='smoothstep'
            >
                <Background color="#27272a" gap={gridSize} size={1} />
                <Controls />
                <MiniMap 
                    maskColor="rgba(0, 0, 0, 0.75)" 
                    nodeColor="#09090b"
                    nodeStrokeColor="#10b981"
                    nodeStrokeWidth={12}
                    nodeBorderRadius={16}
                    pannable
                    zoomable
                />
            </ReactFlow>
            <PreFlightAuditWidget />
            {selectedNodes.length > 1 && (
                <button 
                    onClick={handleGroupSelected}
                    className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-emerald-500"
                >
                    Group Selected
                </button>
            )}
        </div>
        </>
    )
}
