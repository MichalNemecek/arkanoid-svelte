import Confs from "./Confs.ts";
import Vec2 from "./Vec2.ts";
export default class Paddle {
	speed: number = 6;
	readonly height: number = 10;
	width: number = 90;
	pos: Vec2 = new Vec2((Confs.gameWidth-this.width)/2, Confs.gameHeight - this.height-5);
	constructor(){

	}
	move(right: boolean){
		this.pos.x += right ? this.speed : -this.speed;
		if(this.pos.x <= 0){
			this.pos.x = 0;
		}
		if(this.pos.x + this.width >= Confs.gameWidth){
			this.pos.x = Confs.gameWidth - this.width;
		}
	}
}
