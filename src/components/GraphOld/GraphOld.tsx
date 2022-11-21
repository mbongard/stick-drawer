import React from 'react';
import 'vis-network/styles/vis-network.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Network, DataSet } from 'vis-network/standalone';
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
  nodes: new DataSet<any, 'id'>([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ]),
  edges: new DataSet<any, 'id'>([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 1, to: 6 },
    { from: 1, to: 7 },
  ]),
};

type GraphState = {
  network?: Network;
  selectedNode?: any;
  selectedEdge?: any;
};

class Graph extends React.Component<GraphState> {
  private readonly networkRef: React.RefObject<HTMLDivElement> =
    React.createRef();
  private network?: Network;

  public constructor(props: any) {
    super(props);
    this.state = {};
  }

  public async componentDidMount(): Promise<void> {
    if (this.networkRef.current) {
      this.network = new Network(
        this.networkRef.current,
        {
          nodes: STICK_FIGURE_1.nodes,
          edges: STICK_FIGURE_1.edges,
        },
        OPTIONS,
      );

      this.setState({ network: this.network });

      (window as unknown as WindowInterface).network = this.network;

      this.network.on('click', this.onClick);
    }
  }

  private onClick(clickProps: any): void {
    if (clickProps.nodes[0]) {
      console.log(this.state);
      // const node = this.nodes.get(clickProps.nodes[0]) as any;
      // console.log(node);
    }
  }

  public render(): React.ReactNode {
    return (
      <div className="Graph">
        <div id="my-network" ref={this.networkRef} />
      </div>
    );
  }
}

export default Graph;
