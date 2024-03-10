<script lang="ts">
	import Confs from "./lib/Confs.ts";
	import Vec2 from "./lib/Vec2.ts";
	import Ball from "./lib/Ball.ts";
	import Brick from "./lib/Brick.ts";
	import Paddle from "./lib/Paddle.ts";
	import BallElement from "./lib/BallElement.svelte";
	import BrickElement from "./lib/BrickElement.svelte";
	import PaddleElement from "./lib/PaddleElement.svelte";

	let gameState: number = 1;
	// 0 = intro;
	// 1 = playing;

	let balls: Ball[] = [];
	let bricks: Brick[] = [];
	let paddle: Paddle = new Paddle();

	let bricksLeft: boolean = true;
	let ballsLeft: boolean = true;
	let pressedKeys = 0x00;

	let gameLoopInterval: number;

	let handlePressed = (e: KeyboardEvent) => {
		switch (e.key) {
			case "ArrowLeft":
				pressedKeys |= 0x10;
				break;
			case "ArrowRight":
				pressedKeys |= 0x01;
				break;
		}
	};
	let handleReleased = (e: KeyboardEvent) => {
		switch (e.key) {
			case "ArrowLeft":
				pressedKeys &= 0x01;
				break;
			case "ArrowRight":
				pressedKeys &= 0x10;
		}
	};
	for (let i = 0; i < 12; i++) {
		bricks.push(new Brick(new Vec2(i, 4), true));
		bricks.push(new Brick(new Vec2(i, 5), true));
	}
	balls.push(
		new Ball(
			new Vec2(Confs.gameWidth / 2, Confs.gameHeight - 50),
			new Vec2(3, -4),
		),
	);
	let gameLoopFunction = () => {
		let ballCollidedWithBrick = false;
		for (let ball of balls) {
			ball.handlePaddleCollision(paddle);
			bricks.forEach((brick) => {
				if (ball.handleBrickCollision(brick)) {
					brick.active = false;
					ballCollidedWithBrick = true;
				}
			});
			if (ballCollidedWithBrick) {
				return;
			}
			ball.move();
			if (ball.pos.x + ball.r >= Confs.gameWidth) {
				ball.speed.x = -Math.abs(ball.speed.x);
			}
			if (ball.pos.x - ball.r <= 0) {
				ball.speed.x = Math.abs(ball.speed.x);
			}
			if (ball.pos.y - ball.r <= 0) {
				ball.speed.y = Math.abs(ball.speed.y);
			}
		}
		balls = balls.filter((ball) => ball.pos.y <= Confs.gameHeight);
		bricks = bricks;
		bricksLeft = bricks.some((b) => b.active);
		ballsLeft = balls.length > 0;
		if (pressedKeys == 0x01) {
			paddle.move(true);
		} else if (pressedKeys == 0x10) {
			paddle.move(false);
		}
		//paddle.move(true);
		paddle = paddle;
		if (!ballsLeft) {
			clearInterval(gameLoopInterval);
		}
	};
	gameLoopInterval = setInterval(gameLoopFunction, 1000 / Confs.gameSpeed);
</script>

<svg width={Confs.gameWidth} height={Confs.gameHeight}>
	{#if gameState == 1}
		{#each bricks as brick}
			<BrickElement props={brick} />
		{/each}
		{#each balls as ball}
			<BallElement props={ball} />
		{/each}
		<PaddleElement props={paddle} />
		{#if !bricksLeft}
			<text text-anchor="middle" x="300" y="300" class="text-3xl"
				>You win</text
			>
		{/if}
		{#if !ballsLeft && bricksLeft}
			<text text-anchor="middle" x="300" y="300" class="text-3xl"
				>Game over!</text
			>
		{/if}
	{/if}
</svg>
<svelte:window on:keydown={handlePressed} on:keyup={handleReleased} />

<style lang="css">
	svg {
		border: 5px solid black;
		margin: 0 auto;
		display: block;
	}
	text {
		fill: black;
		font-size: 4em;
		font-family: monospace;
	}
</style>
