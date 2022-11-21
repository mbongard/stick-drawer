import React, { ChangeEvent, useEffect, useState } from 'react';
import 'vis-network/styles/vis-network.css';
import { Network, DataSet, Node, Edge, Options } from 'vis-network/standalone';
import './Graph.scss';

interface WindowInterface extends Window {
  network: Network;
  nodes: DataSet<any, 'id'>;
  edges: DataSet<any, 'id'>;
}

const OPTIONS = {
  physics: false,
  nodes: {
    color: '#343434',
    widthConstraint: 5,
    heightConstraint: 5,
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

const STICK_FIGURE_1 = {
  nodes: new DataSet<any>([
    { id: 1, x: 0, y: 0, widthConstraint: 20, heightConstraint: 20 },
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

const STICK_FIGURE_2 = {
  nodes: new DataSet<any>([
    { id: 1, x: 0, y: 0, widthConstraint: 20, heightConstraint: 20 },
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

type GraphData = {
  nodes: any;
  edges: any;
  options: any;
  viewPort?: any;
  scale?: number;
};

const Graph = (): JSX.Element => {
  const networkRef = React.createRef<HTMLDivElement>();
  const [graphData, setGraphData] = useState<GraphData>();
  const [network, setNetwork] = useState<Network>();
  const [editNode, setEditNode] = useState<number>();
  const [editEdge, setEditEdge] = useState<number>();

  let windowInt: WindowInterface = window as unknown as WindowInterface;

  useEffect(() => {
    loadFigure(STICK_FIGURE_1);
  }, []);

  useEffect(() => {
    initializeNetwork();
  }, [graphData]);

  const initializeNetwork = (): void => {
    if (networkRef?.current) {
      const newNetwork = new Network(
        networkRef.current,
        { nodes: graphData?.nodes, edges: graphData?.edges },
        graphData?.options,
      );

      newNetwork.moveTo({
        position: graphData?.viewPort,
        scale: graphData?.scale,
      });
      newNetwork.on('click', onClick);
      newNetwork.on('dragStart', onDragStart);
      newNetwork.on('dragEnd', onDragEnd);

      windowInt.network = newNetwork;
      setNetwork(newNetwork);
    }
  };

  const loadFigure = (stickFigure: any): void => {
    setGraphData({ ...stickFigure, options: OPTIONS, scale: 2 });
  };

  const onClick = (clickProps: any): void => {
    const nodeId = clickProps.nodes[0];
    const edgeId = clickProps.edges[0];
    updateEdit(nodeId, edgeId);
  };

  const onDragStart = (eventProps: any): void => {
    updateEdit(eventProps.nodes[0]);
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

  const onDragEnd = (eventProps: any): void => {
    if (eventProps.nodes.length === 1) {
      graphData?.nodes.map((n: any) => {
        if (n.id === eventProps.nodes[0]) {
          n.x = Math.round(eventProps.pointer.canvas.x * 10) / 10;
          n.y = Math.round(eventProps.pointer.canvas.y * 10) / 10;
        }
        return n;
      });
      updateGraphData();
    }
  };

  const currentSize = (): number => {
    if (editNode) {
      if (getNode(editNode).widthConstraint) {
        return getNode(editNode).widthConstraint;
      }
      return OPTIONS.nodes.widthConstraint;
    }
    return -1;
  };

  const getNode = (id: number): any => {
    return graphData?.nodes?.get(id);
  };

  const getEdge = (id: number): any => {
    return graphData?.edges?.get(id);
  };

  const getDefaultNodeSize = (): number => {
    if (graphData?.options) {
      return graphData.options.nodes.widthConstraint;
    }
    return 0;
  };

  const setDefaultNodeSize = (event: ChangeEvent<HTMLInputElement>): void => {
    if (graphData) {
      graphData.options.nodes.widthConstraint = +event.target.value;
      graphData.options.nodes.heightConstraint = +event.target.value;
      updateGraphData();
    }
    event.preventDefault();
  };

  const getNodeSize = (): number => {
    if (editNode) {
      const nodeSize = getNode(editNode).widthConstraint;
      if (nodeSize) {
        return nodeSize;
      }
      return getDefaultNodeSize();
    }
    return 0;
  };

  const setNodeSize = (event: ChangeEvent<HTMLInputElement>): void => {
    if (graphData && editNode) {
      graphData.nodes.map((n: any) => {
        if (n.id === editNode) {
          n.widthConstraint = +event.target.value;
          n.heightConstraint = +event.target.value;
        }
      });
      updateGraphData();
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
    if (graphData && editEdge) {
      graphData.edges.map((n: any) => {
        if (n.id === editEdge) {
          const roundness = +event.target.value;

          n.smooth = {
            enabled: roundness !== 0,
            type: roundness < 0 ? 'curvedCCW' : 'curvedCW',
            forceDirection: false,
            roundness: roundness < 0 ? -roundness : roundness,
          };
        }
      });
      updateGraphData();
    }
    event.preventDefault();
  };

  const handleDecoupleNodeSize = (): void => {
    graphData?.nodes.map((n: any) => {
      if (n.id === editNode) {
        n.widthConstraint = undefined;
        n.heightConstraint = undefined;
      }
    });
    updateGraphData();
  };

  const updateGraphData = (): void => {
    const viewPort = windowInt.network.getViewPosition();
    const scale = windowInt.network.getScale();
    setGraphData({ ...graphData, viewPort, scale } as GraphData);
  };

  const getXCoordinate = (): number => {
    if (editNode) {
      return getNode(editNode).x;
    }
    return 0;
  };

  const getYCoordinate = (): number => {
    if (editNode) {
      return getNode(editNode).y;
    }
    return 0;
  };

  const updateXCoordinate = (event: any): void => {
    graphData?.nodes.map((n: any) => {
      if (n.id === editNode) {
        n.x = event.target.value;
      }
      return n;
    });
    updateGraphData();
  };

  const updateYCoordinate = (event: any): void => {
    graphData?.nodes.map((n: any) => {
      if (n.id === editNode) {
        n.y = event.target.value;
      }
      return n;
    });
    updateGraphData();
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
          <div className="Graph-RowEdit">
            <div>Standard Knoten Grösse</div>
            <input
              type="range"
              min="0.1"
              max="20"
              step={0.1}
              value={getDefaultNodeSize()}
              onChange={setDefaultNodeSize}
            ></input>
            <div className="Graph-SliderValue">{getDefaultNodeSize()}</div>
          </div>
        </div>
        {editNode && (
          <div className="Graph-GroupEdit">
            <div className="Graph-GroupEdit-Title">Knoten {editNode}</div>
            <div className="Graph-RowEdit">
              <div>X-Koordinate</div>
              <input
                type="number"
                value={getXCoordinate()}
                onChange={updateXCoordinate}
              />
            </div>
            <div className="Graph-RowEdit">
              <div>Y-Koordinate</div>
              <input
                type="number"
                value={getYCoordinate()}
                onChange={updateYCoordinate}
              />
            </div>
            <div className="Graph-RowEdit">
              <div>Individuelle Knoten Grösse</div>
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
        )}
      </div>
    </div>
  );
};

export default Graph;
