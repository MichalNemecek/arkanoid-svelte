<script lang="ts">
	import {Powerup, PowerupType} from "./Powerup.ts";
	export let props: Powerup;
</script>
{#if props.type == PowerupType.Disrupt}
	<rect class="disrupt" x={props.pos.x-props.width/2} y={props.pos.y-props.height/2} width={props.width} height={props.height} rx=10 ry=10 />
		<text text-anchor="middle" x={props.pos.x} y={props.pos.y+4}>D</text>
{:else if props.type == PowerupType.Xtra}
	<rect class="xtra" x={props.pos.x-props.width/2} y={props.pos.y-props.height/2} width={props.width} height={props.height} rx=10 ry=10 />
		<text text-anchor="middle" x={props.pos.x} y={props.pos.y+4}>X</text>
{:else if props.type == PowerupType.Player}
	<rect class="player" x={props.pos.x-props.width/2} y={props.pos.y-props.height/2} width={props.width} height={props.height} rx=10 ry=10 />
		<text text-anchor="middle" x={props.pos.x} y={props.pos.y+4}>P</text>
{/if}

<style>
	.disrupt {
		fill: #AAAA00;
	}
	.xtra {
		fill: #88AA00;
	}
	.player {
		fill: #FF3300;
	}
	text {
		fill: white;
		font-family: monospace
	}
</style>
