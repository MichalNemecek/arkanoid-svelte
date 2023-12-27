export default class Vec2 {
  x: number;
  y: number;
  constructor(x: number, y: number){
	this.x = x;
	this.y = y;
  }
  add(v: Vec2){
	this.x += v.x;
	this.y += v.y;
  }
  sub(v: Vec2){
	this.x -= v.x;
	this.y -= v.y;
  }
	scaledBy(q: number){
		return new Vec2(this.x*q, this.y*q);
	}
}
