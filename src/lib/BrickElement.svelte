<script lang="ts">
  import Brick from "./Brick.ts";
  export let props: Brick;
 </script>
{#if props.active}
<rect x={props.pos.x+1} y={props.pos.y+1} width={props.size.x-2} height={props.size.y-2} rx=4 />
{/if}
<style>
  rect {
	fill: #A55;
  }
</style>
