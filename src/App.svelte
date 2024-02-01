<script lang="ts">
  import Vec2 from "./lib/Vec2.ts";
  import Ball from "./lib/Ball.ts";
  import Brick from "./lib/Brick.ts";

  import BallElement from "./lib/BallElement.svelte";
  import BrickElement from "./lib/BrickElement.svelte";

  const areaSize: Vec2 = new Vec2(600, 600);
  
  const timeStep = 60;
  let balls: Ball[] = [];
  let bricks: Brick[] = [];
  for(let i = 0; i <= 12; i++){
    bricks.push(new Brick(new Vec2(i, 7), true));
    bricks.push(new Brick(new Vec2(i, 8), true));
    bricks.push(new Brick(new Vec2(i, 9), true));
    bricks.push(new Brick(new Vec2(i, 10), true));
  }
  balls.push(new Ball(new Vec2(100, 500), new Vec2(3, -4)));

  let gameloop = setInterval(() => {
    balls.forEach((ball) => {
      bricks.forEach((brick => {
        if(ball.handleBrickCollision(brick)){
          brick.active = false;
        }
      }));
      ball.move();
      if(ball.pos.x + ball.r >= areaSize.x){
        ball.speed.x = -Math.abs(ball.speed.x);
      }
      if(ball.pos.x - ball.r <= 0){
        ball.speed.x = Math.abs(ball.speed.x);
      }
      if(ball.pos.y + ball.r >= areaSize.y){
        ball.speed.y = -Math.abs(ball.speed.y);
      }
      if(ball.pos.y - ball.r <= 0){
        ball.speed.y = Math.abs(ball.speed.y);
      }
    });
    balls = balls;
    bricks = bricks;
  }, 1000/timeStep);
                  
</script>
<svg width={areaSize.x} height={areaSize.y}>
  {#each bricks as brick}
    <BrickElement props={brick} />
  {/each}
  {#each balls as ball}
    <BallElement props={ball} />
  {/each}
</svg>
<style lang="css">
  svg {
		  border: 5px solid black;
		  margin: 0 auto;
		  display: block;
  }
</style>
