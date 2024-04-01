<script lang="ts">
	import { Sound } from "svelte-sound";
	import * as _ from "lodash";

	import Confs from "./lib/Confs.ts";
	import Vec2 from "./lib/Vec2.ts";
	import Ball from "./lib/Ball.ts";
	import Brick from "./lib/Brick.ts";
	import Paddle from "./lib/Paddle.ts";
	import { Powerup, PowerupType } from "./lib/Powerup.ts";

	import BallElement from "./lib/BallElement.svelte";
	import BrickElement from "./lib/BrickElement.svelte";
	import PaddleElement from "./lib/PaddleElement.svelte";
	import PowerupElement from "./lib/PowerupElement.svelte";

	import arkanoidstart from "./assets/arkanoidstart.wav";
	import collision_sfx_hi from "./assets/collision_sfx_hi.wav";
	import collision_sfx_lo from "./assets/collision_sfx_lo.wav";
	import { levels } from "./assets/levels.json";

	let gameState: number = 0;
	let score: number = 0;
	// 0 = intro;
	// 1 = playing;
	let lifeCount: number = 3;
	let balls: Ball[] = [];
	let bricks: Brick[] = [];
	let powerups: Powerup[] = [];
	let paddle: Paddle = new Paddle();

	let bricksLeft: boolean = true;
	let ballsLeft: boolean = true;
	let pressedKeys = 0x00;

	let gameLoopInterval: number;
	let startSound = new Sound(arkanoidstart);
	let collSfxHi = new Sound(collision_sfx_hi);
	let collSfxLo = new Sound(collision_sfx_lo);

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
	let loadLevel = (l: number) => {
		for (let i of levels[l].layout) {
			bricks.push(new Brick(new Vec2(i.x, i.y), true));
		}
		bricks = bricks;
	};

	let gameRespawn = () => {
		startSound.play();
		setTimeout(() => {
			balls.push(
				new Ball(
					new Vec2(
						paddle.pos.x + paddle.width / 2,
						Confs.gameHeight - paddle.height - 5,
					),
					new Vec2(3, -4),
				),
			);
			gameLoopInterval = setInterval(
				gameLoopFunction,
				1000 / Confs.gameSpeed,
			);
		}, 4500);
	};
	let gameStart = () => {
		gameState = 1;
		lifeCount = 3;
		score = 0;
		loadLevel(0);
		gameRespawn();
	};

	let gameLoopFunction = () => {
		let ballCollidedWithBrick = false;
		for (let ball of balls) {
			if (ball.handlePaddleCollision(paddle)) {
				collSfxLo.play();
			}
			bricks.forEach((brick) => {
				if (ball.handleBrickCollision(brick)) {
					brick.active = false;
					ballCollidedWithBrick = true;
					collSfxHi.play();
					score += 100;
					if (Math.random() > 0.7) {
					let rand = Math.random();
					let choice: PowerupType;
					if(rand > 0.9){
						choice = PowerupType.Player;
					}else if(rand > 0.5){
						choice = PowerupType.Disrupt;
					}else{
						choice = PowerupType.Xtra;
					}
						powerups.push(
							new Powerup(
								new Vec2(
									brick.pos.x + brick.size.x / 2,
									brick.pos.y + brick.size.y / 2,
								),
								choice
							),
						);
					}
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
		powerups.forEach((p: Powerup) => {
			p.move();
			if (p.checkPaddleCollision(paddle)) {
				if ((p.type == PowerupType.Disrupt)) {
					balls.forEach((ball) => {
						balls.push(
							new Ball(
								new Vec2(ball.pos.x, ball.pos.y),
								new Vec2(
									ball.speed.x * 0.866 - ball.speed.y * 0.5,
									ball.speed.x * 0.5 + ball.speed.y * 0.866,
								),
							),
						);
						balls.push(
							new Ball(
								new Vec2(ball.pos.x, ball.pos.y),
								new Vec2(
									ball.speed.x * 0.866 + ball.speed.y * 0.5,
									-ball.speed.x * 0.5 + ball.speed.y * 0.866,
								),
							),
						);
					});
				}else if(p.type == PowerupType.Xtra){
				let angle = (Math.random()-0.5)*Math.PI/2;
					balls.push(new Ball(
						new Vec2(paddle.pos.x + paddle.width / 2, Confs.gameHeight - paddle.height - 5),
						new Vec2(5*Math.sin(angle), -5*Math.cos(angle))
					));
				}else if(p.type == PowerupType.Break){
					score += 100*bricks.length;
					bricks = [];
				}else if(p.type == PowerupType.Player){
					lifeCount++;
				}
			}
		});
		powerups = powerups.filter((p) => !p.checkPaddleCollision(paddle));
		powerups = powerups.filter((p) => p.pos.y <= Confs.gameHeight);
		powerups = powerups;
		bricksLeft = bricks.some((b) => b.active);
		ballsLeft = balls.length > 0;
		if (pressedKeys == 0x01) {
			paddle.move(true);
		} else if (pressedKeys == 0x10) {
			paddle.move(false);
		}
		paddle = paddle;
		if (!bricksLeft) {
		clearInterval(gameLoopInterval);
		powerups = [];
			setTimeout(() => {
				loadLevel(levels.indexOf(_.sample(levels)));
				balls = [];
				bricksLeft = true;
				gameRespawn();
				
			}, 1000);
		}
		if (!ballsLeft) {
			powerups = [];
			clearInterval(gameLoopInterval);
			if (bricksLeft) {
				lifeCount--;
				if (lifeCount > 0) {
					setTimeout(gameRespawn, 1000);
				}
			}
		}
	};
</script>

{#if gameState == 0}
	<div
		class="intro"
		style="width:{Confs.gameWidth}px; height:{Confs.gameHeight}px;"
	>
		<div class="button" role="button" on:click={gameStart}>Start game</div>
	</div>
{:else if gameState == 1}
	<svg width={Confs.gameWidth} height={Confs.gameHeight}>
		{#if gameState == 1}
			{#each bricks as brick}
				<BrickElement props={brick} />
			{/each}
			{#each balls as ball}
				<BallElement props={ball} />
			{/each}
			<PaddleElement props={paddle} />
			{#each powerups as powerup}
				<PowerupElement props={powerup} />
			{/each}
			{#if !bricksLeft}
				<text
					class="success"
					text-anchor="middle"
					x={Confs.gameWidth / 2}
					y={Confs.gameHeight / 2}>Level Clear!</text
				>
			{/if}
			{#if !ballsLeft && bricksLeft && lifeCount == 0}
				<text
					class="failure"
					text-anchor="middle"
					x={Confs.gameWidth / 2}
					y={Confs.gameHeight / 2}>Game over!</text
				>
			{/if}
		{/if}
	</svg>
	<div class="statusline" style="width: {Confs.gameWidth}px">
		Lives: {lifeCount}, Score: {score}
	</div>
{/if}
<svelte:window on:keydown={handlePressed} on:keyup={handleReleased} />

<style lang="css">
	svg {
		border: 5px solid black;
		margin: 0 auto;
		display: block;
	}
	text.success,
	text.failure {
		fill: black;
		font-size: 4em;
		font-family: monospace;
	}
	div.intro {
		border: 5px solid black;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: space-evenly;
	}
	.button {
		width: 30%;
		background-color: #a86;
		height: 2em;
		text-align: center;
		color: white;
		vertical-align: middle;
		line-height: 2em;
		border-radius: 0.5em;
		align-self: center;
		font-size: 1.5em;
		font-family: monospace;
	}
	.statusline {
		margin: 0 auto;
		display: block;
	}
</style>
