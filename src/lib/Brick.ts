import Vec2 from "./Vec2.ts";
export default class Brick {
  pos: Vec2;
  size: Vec2;
  active: boolean;
  readonly r: number = 10;
  constructor(pos: Vec2, active: boolean){
	this.size = new Vec2(50, 30);
	this.active = active;
	this.pos = new Vec2(pos.x*this.size.x, pos.y*this.size.y);
  }
}
