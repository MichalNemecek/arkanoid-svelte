import Vec2 from "./Vec2.ts";
export default class Ball {
  pos: Vec2;
  speed: Vec2;
  readonly r: number = 10;
  constructor(pos: Vec2, speed: Vec2){
	this.pos = pos;
	this.speed = speed;
  }
  move(timestep: number){
	this.pos.add(this.speed.scaledBy(1/timestep));
  }
}
