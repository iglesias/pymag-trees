import { WSThreads } from "./layouts/wsthreads.js";

function circle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
}

function line(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
) {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}

class DrawTree {
  x: number;
  y: number;
  children: DrawTree[];

  constructor(tree: Tree, depth: number = 0) {
    this.x = -1;
    this.y = depth;
    this.children = tree.children.map((t) => new DrawTree(t, depth + 1));
  }
}

class Tree {
  data: string;
  children: Tree[];

  constructor(data: string, ...children: Tree[]) {
    this.data = data;
    this.children = children;
  }
}

let knuth_x = 0;
function KnuthLayout(tree: DrawTree, depth: number = 0) {
  if (tree.children[0]) {
    KnuthLayout(tree.children[0], depth + 1);
  }
  tree.x = knuth_x;
  tree.y = depth;
  knuth_x += 1;
  if (tree.children[1]) {
    KnuthLayout(tree.children[1], depth + 1);
  }
}

function draw(
  ctx: CanvasRenderingContext2D,
  tree: DrawTree,
  verbose: boolean = false,
) {
  const nodewidth = 40;
  const radius = 16;
  const x = tree.x * nodewidth;
  const y = tree.y * nodewidth;

  // we want the lines underneath all the circles, so draw them first
  tree.children.forEach((t) => {
    const childX = t.x * nodewidth;
    const childY = t.y * nodewidth;
    line(ctx, x, y, childX, childY);
  });

  if (verbose) console.log("circle at ", x, y);
  circle(ctx, x, y, radius);
  tree.children.forEach((t) => draw(ctx, t));
}

function figure1(ctx: CanvasRenderingContext2D) {
  // prettier-ignore
  const tree = new Tree("root",
    new Tree("l"),
    new Tree("r",
      new Tree("r2",
        new Tree("r3",
          new Tree("r4")))));
  const dt = new DrawTree(tree);
  KnuthLayout(dt);

  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.translate(50, 50);
  draw(ctx, dt);
}

function WSMinwidth(tree: DrawTree) {
  const nexts = new Uint32Array(256);
  function minwidth(tree: DrawTree, depth: number = 0) {
    tree.x = nexts[depth];
    tree.y = depth;
    nexts[depth] += 1;
    tree.children.forEach((t) => minwidth(t, depth + 1));
  }
  minwidth(tree);
}

function figure2(ctx: CanvasRenderingContext2D) {
  // prettier-ignore
  const tree = new Tree("root",
    new Tree("l1",
      new Tree("ll1"),
      new Tree("lr1",
        new Tree("lrl"),
        new Tree("lrr"))),
    new Tree("r1",
      new Tree("rr2",
        new Tree("rr3",
          new Tree("rrl",
            new Tree("rrll",
              new Tree("rrlll"),
              new Tree("rrllr")),
            new Tree("rrlr"))))))
  const dt = new DrawTree(tree);
  WSMinwidth(dt);

  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.translate(50, 50);
  draw(ctx, dt);
}

function inorder(ctx: CanvasRenderingContext2D) {
  // prettier-ignore
  const tree = new Tree("root",
    new Tree("l",
      new Tree("l2",
        new Tree("l23"), new Tree("r23"))),
    new Tree("r",
      new Tree("r2",
        new Tree("l23"), new Tree("r23"))));

  const dt = new DrawTree(tree);
  // TODO: update this to a nicer layout!
  KnuthLayout(dt);

  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.translate(-180, 0);
  draw(ctx, dt);
}

function figure6(ctx: CanvasRenderingContext2D) {
  // prettier-ignore
  const tree = new Tree("root", 
    new Tree("l1", 
      new Tree("l2", 
        new Tree("l3"), new Tree("l4"))),
    new Tree("r1", 
      new Tree("rl1"),
      new Tree("rr1", 
        new Tree("rr2"), new Tree("rr3"))))

  const dt = WSThreads(tree);

  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.translate(20, 20);
  draw(ctx, dt);
}

function getCtx(id: string): CanvasRenderingContext2D {
  const elt = document.getElementById(id);
  if (!elt) {
    throw new Error(`unable to find ${id}`);
  }
  const ctx = (elt as HTMLCanvasElement).getContext("2d");
  if (!ctx) {
    throw new Error(`unable to get context for elt ${elt}`);
  }
  return ctx;
}

window.addEventListener("DOMContentLoaded", async (_: Event) => {
  figure1(getCtx("knuth"));
  inorder(getCtx("inorder"));
  figure2(getCtx("narrow"));
  figure6(getCtx("canvas6"));
});
