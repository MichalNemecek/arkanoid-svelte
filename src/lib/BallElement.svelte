<script lang="ts">
  import Ball from "./Ball.ts";
  export let props: Ball;
 </script>

<rect x={props.pos.x - props.r} y={props.pos.y - props.r} width={2*props.r} height={2* props.r} rx={props.r} />

<style>
  rect {
	fill: blue;
  }
</style>
