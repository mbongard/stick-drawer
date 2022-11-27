import React, { ChangeEvent, useEffect, useState } from 'react';
import 'vis-network/styles/vis-network.css';
import { Network, DataSet, Node, Edge, Options } from 'vis-network/standalone';
import './Graph.scss';

interface WindowInterface extends Window {
  network: Network;
  nodes: DataSet<any, 'id'>;
  edges: DataSet<any, 'id'>;
  options: any;
}

interface StickFigure {
  nodes: DataSet<any>;
  edges: DataSet<Edge>;
}

const OPTIONS = {
  physics: {
    enabled: true,
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -2000,
      centralGravity: 0,
      springLength: 20,
      springConstant: 1,
      damping: 0.09,
      avoidOverlap: 0,
    },
    forceAtlas2Based: {
      theta: 0.5,
      gravitationalConstant: -50,
      centralGravity: 0,
      springConstant: 0.08,
      springLength: 1,
      damping: 0.4,
      avoidOverlap: 0,
    },
    repulsion: {
      centralGravity: 0,
      springLength: 20,
      springConstant: 1,
      nodeDistance: 20,
      damping: 0.09,
    },
    solver: 'barnesHut',
  },
  nodes: {
    shape: 'dot',
    color: '#343434',
    size: 5,
  },
  edges: {
    smooth: {
      enabled: false,
      type: 'dynamic',
      forceDirection: false,
      roundness: 0,
    },
  },
};

const STICK_FIGURE_1: StickFigure = {
  nodes: new DataSet<any>([
    { id: 1, x: 0, y: 0, size: 20 },
    { id: 2, x: 0, y: 50 },
    { id: 3, x: -20, y: 50 },
    { id: 4, x: 20, y: 50 },
    { id: 5, x: 0, y: 150 },
    { id: 6, x: -50, y: 250 },
    { id: 7, x: 50, y: 250 },
    { id: 8, x: -100, y: 100 },
    { id: 9, x: -150, y: 100 },
    { id: 10, x: 100, y: 100 },
    { id: 11, x: 150, y: 100 },
  ]),
  edges: new DataSet<Edge>([
    { id: 1, from: 1, to: 2, length: 50 },
    { id: 2, from: 2, to: 3, length: 20 },
    { id: 3, from: 2, to: 4, length: 20 },
    { id: 4, from: 2, to: 5, length: 100 },
    { id: 5, from: 5, to: 6, length: 50 },
    { id: 6, from: 5, to: 7, length: 50 },
    { id: 7, from: 3, to: 8, length: 50 },
    { id: 8, from: 8, to: 9, length: 50 },
    { id: 9, from: 4, to: 10, length: 50 },
    { id: 10, from: 10, to: 11, length: 50 },
  ]),
};

const STICK_FIGURE_3: StickFigure = {
  nodes: new DataSet<any>([
    { id: 1, x: 0, y: 0, size: 20 },
    { id: 2, x: 0, y: 50 },
    { id: 3, x: -50, y: 100 },
    { id: 4, x: 50, y: 100 },
    { id: 5, x: 0, y: 150 },
    { id: 6, x: -50, y: 250 },
    { id: 7, x: 50, y: 250 },
  ]),
  edges: new DataSet<Edge>([
    { id: 1, from: 1, to: 2 },
    { id: 2, from: 2, to: 3 },
    { id: 3, from: 2, to: 4 },
    { id: 4, from: 2, to: 5 },
    { id: 5, from: 5, to: 6 },
    { id: 6, from: 5, to: 7 },
  ]),
};

const STICK_FIGURE_2: StickFigure = {
  nodes: new DataSet<any>([
    { id: 1, x: 0, y: 0, size: 20 },
    { id: 2, x: 0, y: 50 },
    { id: 3, x: -50, y: 100 },
    { id: 4, x: 50, y: 100 },
    { id: 5, x: 0, y: 150 },
    { id: 6, x: -10, y: 170 },
    { id: 7, x: 10, y: 170 },
    { id: 8, x: -50, y: 250 },
    { id: 9, x: 50, y: 250 },
  ]),
  edges: new DataSet<Edge>([
    { id: 1, from: 1, to: 2 },
    { id: 2, from: 2, to: 3 },
    { id: 3, from: 2, to: 4 },
    { id: 4, from: 2, to: 5 },
    { id: 5, from: 5, to: 6 },
    { id: 6, from: 5, to: 7 },
    { id: 7, from: 6, to: 7 },
    { id: 8, from: 6, to: 8 },
    { id: 9, from: 7, to: 9 },
  ]),
};

const Graph = (): JSX.Element => {
  const networkRef = React.createRef<HTMLDivElement>();
  const fixedCheckboxRef = React.createRef<HTMLInputElement>();
  const [editNode, setEditNode] = useState<number>();
  const [editEdge, setEditEdge] = useState<number>();
  const [network, setNetwork] = useState<Network>();
  const [, updateState] = useState<any>();

  let windowInt: WindowInterface = window as unknown as WindowInterface;

  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => initializeNetwork(), []);

  useEffect(() => loadFigure(STICK_FIGURE_1), [network]);

  const initializeNetwork = (): void => {
    if (networkRef?.current) {
      const newNetwork = new Network(networkRef.current, {}, OPTIONS);

      newNetwork.on('click', onClick);
      newNetwork.on('dragStart', onDragStart);
      newNetwork.on('dragEnd', onDragEnd);
      newNetwork.on('deselectNode', onDeselect);
      newNetwork.on('deselectEdge', onDeselect);

      windowInt.network = newNetwork;
      windowInt.options = OPTIONS;
      setNetwork(newNetwork);
    }
  };

  const loadFigure = (stickFigure: StickFigure): void => {
    const nodesDataSet = stickFigure.nodes;
    const edgesDataSet = stickFigure.edges;

    network?.setData({ nodes: nodesDataSet, edges: edgesDataSet });

    windowInt.nodes = nodesDataSet;
    windowInt.edges = edgesDataSet;
  };

  const onClick = (clickProps: any): void => {
    const nodeId = clickProps.nodes[0];
    const edgeId = clickProps.edges[0];
    updateEdit(nodeId, edgeId);
    forceUpdate();
  };

  const onDeselect = (): void => {
    updateEdit(undefined, undefined);
    forceUpdate();
  };

  const onDragStart = (event: any): void => {
    if (event.nodes[0]?.fixed) {
      debugger;
      event.preventDefault();
    } else {
      updateEdit(event.nodes[0]);
      forceUpdate();
    }
  };

  const updateEdit = (nodeId?: number, edgeId?: number): void => {
    if (nodeId) {
      setEditEdge(undefined);
      setEditNode(nodeId);
    } else if (edgeId) {
      setEditNode(undefined);
      setEditEdge(edgeId);
    } else {
      setEditNode(undefined);
      setEditEdge(undefined);
    }
  };

  const onDragEnd = (event: any): void => {
    if (event.nodes.length === 1) {
      const position = windowInt.network.getPosition(event.nodes[0]);
      windowInt.nodes?.update({
        id: event.nodes[0],
        x: Math.round(position.x * 10) / 10,
        y: Math.round(position.y * 10) / 10,
      });
      forceUpdate();
    }
  };

  const getNode = (id: number): any => {
    return windowInt.nodes?.get(id);
  };

  const getEdge = (id: number): any => {
    return windowInt.edges?.get(id);
  };

  const getDefaultNodeSize = (): number => {
    return windowInt.options?.nodes.size ?? 0;
  };

  const setDefaultNodeSize = (event: ChangeEvent<HTMLInputElement>): void => {
    windowInt.options.nodes.size = +event.target.value;
    windowInt.network.setOptions({
      nodes: {
        size: +event.target.value,
      },
    });
    forceUpdate();
    event.preventDefault();
  };

  const getNodeSize = (): number => {
    if (editNode) {
      const nodeSize = getNode(editNode).size;
      if (nodeSize) {
        return nodeSize;
      }
      return getDefaultNodeSize();
    }
    return 0;
  };

  const setNodeSize = (event: ChangeEvent<HTMLInputElement>): void => {
    if (editNode) {
      windowInt.nodes?.update({
        id: editNode,
        size: +event.target.value,
      });
      forceUpdate();
    }
    event.preventDefault();
  };

  const getRoundness = (): number => {
    if (editEdge) {
      const smooth = getEdge(editEdge).smooth;

      if (smooth?.roundness && smooth.roundness !== 0) {
        return smooth.type === 'curvedCW'
          ? smooth.roundness
          : -smooth.roundness;
      }
    }
    return 0;
  };

  const setRoundness = (event: ChangeEvent<HTMLInputElement>): void => {
    if (editEdge) {
      const roundness = +event.target.value;

      windowInt.edges?.update({
        id: editEdge,
        smooth: {
          enabled: roundness !== 0,
          type: roundness < 0 ? 'curvedCCW' : 'curvedCW',
          forceDirection: false,
          roundness: roundness < 0 ? -roundness : roundness,
        },
      });
      forceUpdate();
    }
    event.preventDefault();
  };

  const handleDecoupleNodeSize = (): void => {
    windowInt.nodes?.update({
      id: editNode,
      size: null,
    });
    forceUpdate();
  };

  const getXCoordinate = (): number => {
    if (editNode) {
      return windowInt.network.getPosition(editNode).x;
    }
    return 0;
  };

  const getYCoordinate = (): number => {
    if (editNode) {
      return windowInt.network.getPosition(editNode).y;
    }
    return 0;
  };

  const updateXCoordinate = (event: any): void => {
    if (!isNaN(parseFloat(event.target.value))) {
      windowInt.nodes?.update({
        id: editNode,
        x: +event.target.value,
      });
      forceUpdate();
    }
  };

  const updateYCoordinate = (event: any): void => {
    if (!isNaN(parseFloat(event.target.value))) {
      windowInt.nodes?.update({
        id: editNode,
        y: +event.target.value,
      });
      forceUpdate();
    }
  };

  const getFixed = (): boolean => {
    if (editNode) {
      return windowInt.nodes.get(editNode).fixed ?? false;
    }
    return false;
  };

  const updateFixed = (): void => {
    windowInt.nodes?.update({
      id: editNode,
      fixed: fixedCheckboxRef.current?.checked,
    });
    forceUpdate();
  };

  const togglePhysics = (): void => {
    windowInt.options.physics = !windowInt.options.physics;
    windowInt.network.setOptions({ physics: windowInt.options.physics });
    forceUpdate();
  };

  return (
    <div className="Graph-Container">
      <div className="Graph">
        <div id="my-network" ref={networkRef} />
      </div>
      <div className="Graph-Controls">
        <div className="Graph-FigureButtons">
          <button onClick={() => loadFigure(STICK_FIGURE_1)}>
            Stick Figure 1
          </button>
          <button onClick={() => loadFigure(STICK_FIGURE_2)}>
            Stick Figure 2
          </button>
        </div>
        <div className="Graph-GroupEdit">
          <div className="Graph-GroupEdit-Title">Allgemein</div>
          <button onClick={togglePhysics}>
            {windowInt.options?.physics ? (
              <span>Physik ausschalten</span>
            ) : (
              <span>Physik einschalten</span>
            )}
          </button>
          <div className="Graph-RowEdit">
            <div>Standard Knoten Grösse</div>
            <div className="Graph-RowValue">
              <input
                type="range"
                min="0.1"
                max="20"
                step={0.1}
                value={getDefaultNodeSize()}
                onChange={setDefaultNodeSize}
              ></input>
            </div>
            <div className="Graph-SliderValue">{getDefaultNodeSize()}</div>
          </div>
        </div>
        {editNode && (
          <div className="Graph-GroupEdit">
            <div className="Graph-GroupEdit-Title">Knoten {editNode}</div>
            <div className="Graph-RowEdit">
              <div>X-Koordinate</div>
              <div className="Graph-RowValue">
                <input
                  type="number"
                  value={getXCoordinate()}
                  onChange={updateXCoordinate}
                />
              </div>
            </div>
            <div className="Graph-RowEdit">
              <div>Y-Koordinate</div>
              <div className="Graph-RowValue">
                <input
                  type="number"
                  value={getYCoordinate()}
                  onChange={updateYCoordinate}
                />
              </div>
            </div>
            <div className="Graph-RowEdit">
              <div>Position fixieren</div>
              <div className="Graph-RowValue">
                <label className="Switch-Container">
                  <input
                    type="checkbox"
                    checked={getFixed()}
                    onChange={updateFixed}
                    ref={fixedCheckboxRef}
                  />
                  <span className="Switch-Slider Switch-Round"></span>
                </label>
              </div>
            </div>
            <div className="Graph-RowEdit">
              <div>Individuelle Knoten Grösse</div>
              <div className="Graph-RowValue">
                <input
                  type="range"
                  min="0.1"
                  max="20"
                  step={0.1}
                  value={getNodeSize()}
                  onChange={setNodeSize}
                ></input>
                <div className="Graph-SliderValue">{getNodeSize()}</div>
              </div>
            </div>
            <button onClick={handleDecoupleNodeSize}>
              Grösse zurücksetzen
            </button>
          </div>
        )}
        {editEdge && (
          <div className="Graph-GroupEdit">
            <div className="Graph-GroupEdit-Title">Kante {editEdge}</div>
            <div className="Graph-RowEdit">
              <div>Bogen</div>
              <div className="Graph-RowValue">
                <input
                  type="range"
                  min="-0.5"
                  max="0.5"
                  step={0.1}
                  value={getRoundness()}
                  onChange={setRoundness}
                ></input>
                <div className="Graph-SliderValue">{getRoundness()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Graph;
