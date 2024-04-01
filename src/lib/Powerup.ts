import Confs from "./Confs.ts";
import Vec2 from "./Vec2.ts";
import Paddle from "./Paddle.ts";

export enum PowerupType {
	Disrupt,
	Xtra,
	Player
}

export class Powerup {
	speed: number = 2;
	readonly height: number = 20;
	type: PowerupType;
	width: number = 30;
	pos: Vec2 = new Vec2((Confs.gameWidth - this.width) / 2, Confs.gameHeight - this.height - 5);
	constructor(pos: Vec2, type: PowerupType) {
		this.pos = pos;
		this.type = type;
	}
	move() {
		this.pos.y += this.speed;
	}
	checkPaddleCollision(p: Paddle): boolean {
		if (this.pos.y < p.pos.y) { return false; }
		if (this.pos.x < p.pos.x) { return false; }
		if (this.pos.x > p.pos.x + p.width) { return false; }
		return true;
	}
}


