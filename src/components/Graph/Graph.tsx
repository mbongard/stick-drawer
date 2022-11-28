import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import 'vis-network/styles/vis-network.css';
import { Network, DataSet, Node, Edge, Options } from 'vis-network/standalone';
import './Graph.scss';
import {
  StickFigure,
  STICK_FIGURE_1,
  STICK_FIGURE_2,
  STICK_FIGURE_3,
  STICK_FIGURE_4,
  STICK_FIGURE_5,
  STICK_FIGURE_6,
} from './stickfigures';

interface WindowInterface extends Window {
  network: Network;
  nodes: DataSet<any, 'id'>;
  edges: DataSet<any, 'id'>;
  options: any;
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

const Graph = (): JSX.Element => {
  const networkRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const fixedCheckboxRef = useRef<HTMLInputElement>(null);
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
    let value = event.target.value;
    if (!isNaN(parseFloat(value))) {
      windowInt.nodes?.update({
        id: editNode,
        x: +value,
      });
      forceUpdate();
    }
  };

  const updateYCoordinate = (event: any): void => {
    let value = event.target.value;
    if (!isNaN(parseFloat(value))) {
      windowInt.nodes?.update({
        id: editNode,
        y: +value,
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

  const getLength = (): number => {
    if (editEdge) {
      return windowInt.edges.get(editEdge).length;
    }
    return 0;
  };

  const setLength = (event: any): void => {
    if (editEdge) {
      windowInt.edges.update({
        id: editEdge,
        length: +event.target.value,
      });
      forceUpdate();
    }
  };

  const download = (): void => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            nodes: windowInt.nodes
              .get()
              .map((n) => ({ ...n, ...windowInt.network.getPosition(n.id) })),
            edges: windowInt.edges.get(),
            options: windowInt.options,
          },
          null,
          2,
        ),
      );
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'strichmaennli.json');
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const triggerUpload = (): void => {
    uploadInputRef.current?.click();
  };

  const upload = (): void => {
    if (uploadInputRef.current) {
      const files = uploadInputRef.current.files;
      if (files?.length && files.length > 0) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(files[0]);
      }
    }
  };

  function onReaderLoad(event: any): void {
    var data: any = JSON.parse(event.target.result);
    loadFigure({
      nodes: new DataSet<any>(data.nodes),
      edges: new DataSet<Edge>(data.edges),
    } as StickFigure);
    windowInt.options = data.options;
    windowInt.network.setOptions(data.options);

    if (uploadInputRef?.current) {
      // Wipe the value on the input because otherwise Chrome can only upload once
      uploadInputRef.current.value = '';
    }
  }

  return (
    <div className="Graph-Container">
      <div className="Graph">
        <div id="my-network" ref={networkRef} />
      </div>
      <div className="Graph-Controls">
        <div className="Graph-JsonButtons">
          <button onClick={() => download()}>Strichmännli exportierä</button>
          <button onClick={() => triggerUpload()}>
            Strichmännli importierä
          </button>
          <input
            className="InputUpload"
            type="file"
            ref={uploadInputRef}
            onChange={() => upload()}
          />
        </div>
        <div className="Graph-FigureButtons">
          <button onClick={() => loadFigure(STICK_FIGURE_1)}>
            Strichmännli 1
          </button>
          <button onClick={() => loadFigure(STICK_FIGURE_2)}>
            Strichmännli 2
          </button>
          <button onClick={() => loadFigure(STICK_FIGURE_3)}>
            Strichmännli 3
          </button>
          <button onClick={() => loadFigure(STICK_FIGURE_4)}>
            Strichmännli 4
          </button>
          <button onClick={() => loadFigure(STICK_FIGURE_5)}>
            Strichmännli 5
          </button>
          <button onClick={() => loadFigure(STICK_FIGURE_6)}>
            Strichmännli 6
          </button>
        </div>
        <div className="Graph-GroupEdit">
          <div className="Graph-GroupEdit-Title">Allgemeini Sache</div>
          <button onClick={togglePhysics}>
            {windowInt.options?.physics ? (
              <span>D&apos;Physik uusschalte</span>
            ) : (
              <span>D&apos;Physik wieder iischalte</span>
            )}
          </button>
          <div className="Graph-RowEdit">
            <div>Standard Punkt Grössi</div>
            <div className="Graph-RowValue">
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
        </div>
        {editNode && (
          <div className="Graph-GroupEdit">
            <div className="Graph-GroupEdit-Title">De Punkt {editNode}</div>
            <div className="Graph-RowEdit">
              <div>X-Koordinatä</div>
              <div className="Graph-RowValue">
                <input
                  type="number"
                  value={getXCoordinate()}
                  onChange={updateXCoordinate}
                />
              </div>
            </div>
            <div className="Graph-RowEdit">
              <div>Y-Koordinatä</div>
              <div className="Graph-RowValue">
                <input
                  type="number"
                  value={getYCoordinate()}
                  onChange={updateYCoordinate}
                />
              </div>
            </div>
            <div className="Graph-RowEdit">
              <div>D&apos;Position fixierä</div>
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
              <div>Individuelli Punkt Grössi</div>
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
            <button onClick={handleDecoupleNodeSize}>Grössi zruggsetze</button>
          </div>
        )}
        {editEdge && (
          <div className="Graph-GroupEdit">
            <div className="Graph-GroupEdit-Title">De Strich {editEdge}</div>
            <div className="Graph-RowEdit">
              <div>D&apos;Kurvigkeit vom Strich</div>
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
            <div className="Graph-RowEdit">
              <div>D&apos;Längi vom Strich</div>
              <div className="Graph-RowValue">
                <input
                  type="range"
                  min="0'"
                  max="100"
                  step={1}
                  value={getLength()}
                  onChange={setLength}
                ></input>
                <div className="Graph-SliderValue">{getLength()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Graph;
