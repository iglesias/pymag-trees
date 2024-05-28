class Tree {
  data: string;
  children: Tree[];

  constructor(data: string, ...children: Tree[]) {
    this.data = data;
    this.children = children;
  }
}

class DrawTree {
  x: number;
  y: number;
  tree: Tree;
  children: DrawTree[];
  thread?: number;
  offset: number;

  constructor(tree: Tree, depth: number = 0) {
    this.x = -1;
    this.y = depth;
    this.tree = tree;
    this.children = tree.children.map((t) => new DrawTree(t, depth + 1));
    this.offset = 0;
  }
}

function setup(
  tree: DrawTree,
  depth: number = 0,
  nexts: Uint16Array = new Uint16Array(256),
  offset: Uint16Array = new Uint16Array(256),
) {
  tree.children.forEach((t) => setup(t, depth + 1, nexts, offset));
  tree.y = depth;

  let place: number;
  if (!tree.children.length) {
    place = nexts[depth];
    tree.x = place;
  } else if (tree.children.length === 1) {
    place = tree.children[0].x - 1;
  } else {
    place = (tree.children[0].x + tree.children[1].x) / 2;
  }

  offset[depth] = Math.max(offset[depth], nexts[depth] - place);

  if (tree.children.length) {
    tree.x = place + offset[depth];
  }

  nexts[depth] += 2;
  tree.offset = offset[depth];
}

function addmods(tree: DrawTree, modsum: number = 0) {
  tree.x += modsum;
  modsum += tree.offset;
  tree.children.forEach((t) => addmods(t, modsum));
}

export function WSThreads(tree: Tree): DrawTree {
  const dt = new DrawTree(tree);
  setup(dt);
  addmods(dt);
  return dt;
}
