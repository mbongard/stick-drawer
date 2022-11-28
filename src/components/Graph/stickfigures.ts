import { DataSet, Edge } from 'vis-network/standalone';

export interface StickFigure {
  nodes: DataSet<any>;
  edges: DataSet<Edge>;
}

export const STICK_FIGURE_1: StickFigure = {
  nodes: new DataSet<any>([
    { id: 1, size: 20, x: 1207, y: 713 },
    { id: 2, x: 1208, y: 754 },
    { id: 3, x: 1130, y: 732 },
    { id: 4, x: 1286, y: 731 },
    { id: 5, x: 1210, y: 835 },
    { id: 6, x: 1155, y: 893 },
    { id: 7, x: 1265, y: 892 },
  ]),
  edges: new DataSet<Edge>([
    { id: 1, from: 1, to: 2, length: 40 },
    { id: 2, from: 2, to: 3, length: 80 },
    { id: 3, from: 2, to: 4, length: 80 },
    { id: 4, from: 2, to: 5, length: 80 },
    { id: 5, from: 5, to: 6, length: 80 },
    { id: 6, from: 5, to: 7, length: 80 },
  ]),
};

export const STICK_FIGURE_2: StickFigure = {
  nodes: new DataSet<any>([
    { id: 1, size: 20, x: 149, y: 603 },
    { id: 2, x: 148, y: 646 },
    { id: 3, x: 122, y: 639 },
    { id: 4, x: 175, y: 640 },
    { id: 5, x: 149, y: 730 },
    { id: 6, x: 127, y: 745 },
    { id: 7, x: 170, y: 745 },
    { id: 8, x: 89, y: 627 },
    { id: 9, x: 58, y: 614 },
    { id: 10, x: 208, y: 629 },
    { id: 11, x: 239, y: 619 },
    { id: 12, x: 94, y: 773 },
    { id: 13, x: 66, y: 806 },
    { id: 14, x: 202, y: 776 },
    { id: 15, x: 230, y: 808 },
  ]),
  edges: new DataSet<Edge>([
    { id: 1, from: 1, to: 2, length: 40 },
    { id: 2, from: 2, to: 3, length: 20 },
    { id: 3, from: 2, to: 4, length: 20 },
    { id: 4, from: 2, to: 5, length: 80 },
    { id: 5, from: 5, to: 6, length: 20 },
    { id: 6, from: 5, to: 7, length: 20 },
    { id: 7, from: 3, to: 8, length: 30 },
    { id: 8, from: 8, to: 9, length: 30 },
    { id: 9, from: 4, to: 10, length: 30 },
    { id: 10, from: 10, to: 11, length: 30 },
    { id: 11, from: 6, to: 12, length: 40 },
    { id: 12, from: 12, to: 13, length: 40 },
    { id: 13, from: 7, to: 14, length: 40 },
    { id: 14, from: 14, to: 15, length: 40 },
  ]),
};

export const STICK_FIGURE_3: StickFigure = {
  nodes: new DataSet<any>([
    { id: 1, size: 20, x: 148, y: 617 },
    { id: 2, x: 147, y: 657 },
    { id: 3, x: 78, y: 614 },
    { id: 4, x: 219, y: 616 },
    { id: 5, x: 146, y: 739 },
    { id: 6, x: 122, y: 749 },
    { id: 7, x: 170, y: 749 },
    { id: 12, x: 85, y: 771 },
    { id: 13, x: 51, y: 795 },
    { id: 14, x: 206, y: 773 },
    { id: 15, x: 239, y: 797 },
  ]),
  edges: new DataSet<Edge>([
    { id: 1, from: 1, to: 2, length: 40 },
    { id: 2, from: 2, to: 3, length: 80 },
    { id: 3, from: 2, to: 4, length: 80 },
    { id: 4, from: 2, to: 5, length: 80 },
    { id: 5, from: 5, to: 6, length: 20 },
    { id: 6, from: 5, to: 7, length: 20 },
    { id: 11, from: 6, to: 12, length: 40 },
    { id: 12, from: 12, to: 13, length: 40 },
    { id: 13, from: 7, to: 14, length: 40 },
    { id: 14, from: 14, to: 15, length: 40 },
  ]),
};

export const STICK_FIGURE_4: StickFigure = {
  nodes: new DataSet<any>([
    { id: 1, size: 20, x: 152, y: 574 },
    { id: 2, x: 151, y: 616 },
    { id: 3, x: 124, y: 617 },
    { id: 4, x: 178, y: 618 },
    { id: 5, x: 148, y: 698 },
    { id: 6, x: 103, y: 764 },
    { id: 7, x: 188, y: 767 },
    { id: 8, x: 89, y: 615 },
    { id: 9, x: 57, y: 606 },
    { id: 10, x: 212, y: 620 },
    { id: 11, x: 245, y: 615 },
  ]),
  edges: new DataSet<Edge>([
    { id: 1, from: 1, to: 2, length: 40 },
    { id: 2, from: 2, to: 3, length: 20 },
    { id: 3, from: 2, to: 4, length: 20 },
    { id: 4, from: 2, to: 5, length: 80 },
    { id: 5, from: 5, to: 6, length: 80 },
    { id: 6, from: 5, to: 7, length: 80 },
    { id: 7, from: 3, to: 8, length: 30 },
    { id: 8, from: 8, to: 9, length: 30 },
    { id: 9, from: 4, to: 10, length: 30 },
    { id: 10, from: 10, to: 11, length: 30 },
  ]),
};

export const STICK_FIGURE_5: StickFigure = {
  nodes: new DataSet<any>([
    { id: 1, size: 20, x: 151, y: 587 },
    { id: 2, x: 151, y: 630 },
    { id: 3, x: 125, y: 622 },
    { id: 4, x: 177, y: 623 },
    { id: 5, x: 151, y: 714, shape: 'triangleDown', size: 15 },
    { id: 6, x: 129, y: 728 },
    { id: 7, x: 173, y: 729 },
    { id: 8, x: 93, y: 609 },
    { id: 9, x: 64, y: 593 },
    { id: 10, x: 209, y: 610 },
    { id: 11, x: 239, y: 595 },
    { id: 12, x: 96, y: 757 },
    { id: 13, x: 64, y: 785 },
    { id: 14, x: 206, y: 758 },
    { id: 15, x: 236, y: 788 },
  ]),
  edges: new DataSet<Edge>([
    { id: 1, from: 1, to: 2, length: 40 },
    { id: 2, from: 2, to: 3, length: 20 },
    { id: 3, from: 2, to: 4, length: 20 },
    { id: 4, from: 2, to: 5, length: 80 },
    { id: 5, from: 5, to: 6, length: 20 },
    { id: 6, from: 5, to: 7, length: 20 },
    { id: 7, from: 3, to: 8, length: 30 },
    { id: 8, from: 8, to: 9, length: 30 },
    { id: 9, from: 4, to: 10, length: 30 },
    { id: 10, from: 10, to: 11, length: 30 },
    { id: 11, from: 6, to: 12, length: 40 },
    { id: 12, from: 12, to: 13, length: 40 },
    { id: 13, from: 7, to: 14, length: 40 },
    { id: 14, from: 14, to: 15, length: 40 },
  ]),
};

export const STICK_FIGURE_6: StickFigure = {
  nodes: new DataSet<any>([
    { id: 1, size: 20, x: 146, y: 551 },
    { id: 2, x: 147, y: 594 },
    { id: 3, x: 120, y: 593 },
    { id: 4, x: 173, y: 593 },
    { id: 5, x: 147, y: 675, shape: 'triangleDown', size: 15 },
    { id: 6, x: 99, y: 741 },
    { id: 7, x: 196, y: 740 },
    { id: 8, x: 87, y: 588 },
    { id: 9, x: 54, y: 582 },
    { id: 10, x: 207, y: 586 },
    { id: 11, x: 239, y: 579 },
  ]),
  edges: new DataSet<Edge>([
    { id: 1, from: 1, to: 2, length: 40 },
    { id: 2, from: 2, to: 3, length: 20 },
    { id: 3, from: 2, to: 4, length: 20 },
    { id: 4, from: 2, to: 5, length: 80 },
    { id: 5, from: 5, to: 6, length: 80 },
    { id: 6, from: 5, to: 7, length: 80 },
    { id: 7, from: 3, to: 8, length: 30 },
    { id: 8, from: 8, to: 9, length: 30 },
    { id: 9, from: 4, to: 10, length: 30 },
    { id: 10, from: 10, to: 11, length: 30 },
  ]),
};
