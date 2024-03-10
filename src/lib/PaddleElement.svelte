<script lang="ts">
	import Paddle from "./Paddle.ts";
	export let props: Paddle;
</script>
<rect x={props.pos.x} y={props.pos.y} width={props.width} height={props.height} rx=4 />

<style>
	rect {
		fill: #3b82f6;
	}
</style>
