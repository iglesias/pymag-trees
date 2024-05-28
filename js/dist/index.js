var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WSThreads } from "./layouts/wsthreads.js";
function circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
}
function line(ctx, fromX, fromY, toX, toY) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
}
class DrawTree {
    constructor(tree, depth = 0) {
        this.x = -1;
        this.y = depth;
        this.children = tree.children.map((t) => new DrawTree(t, depth + 1));
    }
}
class Tree {
    constructor(data, ...children) {
        this.data = data;
        this.children = children;
    }
}
let knuth_x = 0;
function KnuthLayout(tree, depth = 0) {
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
function draw(ctx, tree, verbose = false) {
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
    if (verbose)
        console.log("circle at ", x, y);
    circle(ctx, x, y, radius);
    tree.children.forEach((t) => draw(ctx, t));
}
function figure1(ctx) {
    // prettier-ignore
    const tree = new Tree("root", new Tree("l"), new Tree("r", new Tree("r2", new Tree("r3", new Tree("r4")))));
    const dt = new DrawTree(tree);
    KnuthLayout(dt);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.translate(50, 50);
    draw(ctx, dt);
}
function WSMinwidth(tree) {
    const nexts = new Uint32Array(256);
    function minwidth(tree, depth = 0) {
        tree.x = nexts[depth];
        tree.y = depth;
        nexts[depth] += 1;
        tree.children.forEach((t) => minwidth(t, depth + 1));
    }
    minwidth(tree);
}
function figure2(ctx) {
    // prettier-ignore
    const tree = new Tree("root", new Tree("l1", new Tree("ll1"), new Tree("lr1", new Tree("lrl"), new Tree("lrr"))), new Tree("r1", new Tree("rr2", new Tree("rr3", new Tree("rrl", new Tree("rrll", new Tree("rrlll"), new Tree("rrllr")), new Tree("rrlr"))))));
    const dt = new DrawTree(tree);
    WSMinwidth(dt);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.translate(50, 50);
    draw(ctx, dt);
}
function inorder(ctx) {
    // prettier-ignore
    const tree = new Tree("root", new Tree("l", new Tree("l2", new Tree("l23"), new Tree("r23"))), new Tree("r", new Tree("r2", new Tree("l23"), new Tree("r23"))));
    const dt = new DrawTree(tree);
    // TODO: update this to a nicer layout!
    KnuthLayout(dt);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.translate(-180, 0);
    draw(ctx, dt);
}
function figure6(ctx) {
    // prettier-ignore
    const tree = new Tree("root", new Tree("l1", new Tree("l2", new Tree("l3"), new Tree("l4"))), new Tree("r1", new Tree("rl1"), new Tree("rr1", new Tree("rr2"), new Tree("rr3"))));
    const dt = WSThreads(tree);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.translate(20, 20);
    draw(ctx, dt);
}
function getCtx(id) {
    const elt = document.getElementById(id);
    if (!elt) {
        throw new Error(`unable to find ${id}`);
    }
    const ctx = elt.getContext("2d");
    if (!ctx) {
        throw new Error(`unable to get context for elt ${elt}`);
    }
    return ctx;
}
window.addEventListener("DOMContentLoaded", (_) => __awaiter(void 0, void 0, void 0, function* () {
    figure1(getCtx("knuth"));
    inorder(getCtx("inorder"));
    figure2(getCtx("narrow"));
    figure6(getCtx("canvas6"));
}));
//# sourceMappingURL=index.js.map