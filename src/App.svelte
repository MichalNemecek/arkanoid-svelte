<script lang="ts">
  import Vec2 from "./lib/Vec2.ts";
  import Ball from "./lib/Ball.ts";

  import BallElement from "./lib/BallElement.svelte";

  const areaSize: Vec2 = new Vec2(600, 600);
  
  const timeStep = 60;
  let balls: Ball[] = [];
  balls.push(new Ball(new Vec2(100, 100), new Vec2(300, 200)));
  balls.push(new Ball(new Vec2(200, 100), new Vec2(400, 100)));

  let mainLoop = setInterval(() => {
    balls.forEach((ball) => {
      ball.move(timeStep);
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
  }, 1000/timeStep);
                  
</script>

<svg width={areaSize.x} height={areaSize.y}>
  {#each balls as ball}
    <BallElement props={ball} />
  {/each}
</svg>
<style>
  svg {
    border: 5px solid black;
  }
</style>
