import Vec2 from "./Vec2.ts";
import Brick from "./Brick.ts";
import Paddle from "./Paddle.ts";
export default class Ball {
	pos: Vec2;
	speed: Vec2;
	readonly r: number = 5;
	constructor(pos: Vec2, speed: Vec2) {
		this.pos = pos;
		this.speed = speed;
	}
	move() {
		this.pos.add(this.speed);
	}
	handleBrickCollision(brick: Brick): boolean {
		if (!((this.pos.x + this.speed.x) >= brick.pos.x && (brick.pos.x + brick.size.x) >= (this.pos.x + this.speed.x) && (this.pos.y + this.speed.y) >= brick.pos.y && (brick.pos.y + brick.size.y) >= (this.pos.y + this.speed.y))) {
			// not going to collide at all, can skip
			return false;
		}
		if (!brick.active) {
			return false;
		}
		// top side - TODO
		if (this.speed.y > 0) {
			// is moving down
			// Y coord of contact point
			let ty = brick.pos.y;
			if (this.pos.y < ty && ty <= (this.pos.y + this.speed.y)) {
				// will cross line tangent to top side

				// calculate contact point
				let tx = (this.speed.x / this.speed.y) * (ty - this.pos.y) + this.pos.x;
				if (brick.pos.x < tx && tx <= brick.pos.x + brick.size.x) {
					// ball will bounce off top side

					// move ball to contact point
					this.pos = new Vec2(tx, ty);

					//change vertical speed
					this.speed.y *= -1;

					//deactivate brick
					return true;

				}
			}

		}
		// Bottom side
		if (this.speed.y < 0) {
			// is moving up
			// Y coord of contact point
			let ty = brick.pos.y + brick.size.y;
			if (this.pos.y > ty && ty >= (this.pos.y + this.speed.y)) {
				// will cross line tangent to bottom side

				// calculate contact point
				let tx = (this.speed.x / this.speed.y) * (ty - this.pos.y) + this.pos.x;
				if (brick.pos.x < tx && tx <= brick.pos.x + brick.size.x) {
					//ball will bounce off bottom side

					// move ball to contact point
					this.pos = new Vec2(tx, ty);

					// change vertical speed
					this.speed.y *= -1;

					//deactivate brick
					return true;

				}
			}
		}
		// left side - TODO
		if (this.speed.x < 0) {
			// is moving left
			// X coord of contact point
			let tx = brick.pos.x + brick.size.x;
			if (this.pos.x > tx && tx >= (this.pos.x + this.speed.x)) {
				// will cross line tangent to left side

				// calculate contact point
				let ty = (this.speed.y / this.speed.x) * (tx - this.pos.x) + this.pos.y;
				if (brick.pos.y < ty && ty <= brick.pos.y + brick.size.y) {
					//ball will bounce off bottom side

					// move ball to contact point
					this.pos = new Vec2(tx, ty);

					// change horizontal speed
					this.speed.x *= -1;

					//deactivate brick
					return true;

				}
			}
		}
		// right side - TODO
		if (this.speed.x > 0) {
			// is moving right
			// X coord of contact point
			let tx = brick.pos.x;
			if (this.pos.x < tx && tx <= (this.pos.x + this.speed.x)) {
				// will cross line tangent to right side

				// calculate contact point
				let ty = (this.speed.y / this.speed.x) * (tx - this.pos.x) + this.pos.y;
				if (brick.pos.y < ty && ty <= brick.pos.y + brick.size.y) {
					//ball will bounce off right side

					// move ball to contact point
					this.pos = new Vec2(tx, ty);

					// change horizontal speed
					this.speed.x *= -1;

					//deactivate brick
					return true;
				}
			}
		}
		return false;
	}
	handlePaddleCollision(paddle: Paddle): boolean{
		if(this.pos.y < paddle.pos.y){return false;}
		if(this.speed.y < 0){return false;}
		if(this.pos.x < paddle.pos.x || this.pos.x > paddle.pos.x + paddle.width){return false;}
		this.pos.y = paddle.pos.y-1;
		let offsetOnPaddle = ((this.pos.x - paddle.pos.x)/paddle.width)-0.5;
		let oldBallAngle = Math.atan2(this.speed.y, this.speed.x);
		let newBallAngle = offsetOnPaddle-oldBallAngle;
		if(newBallAngle < 0.5-Math.PI){newBallAngle = 0.5-Math.PI}
		if(newBallAngle > -0.5){newBallAngle = -0.5}
		this.speed.x = 5*Math.cos(newBallAngle);
		this.speed.y = 5*Math.sin(newBallAngle);
		return true;
	}
}
