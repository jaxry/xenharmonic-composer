<script lang="ts">
  import { afterUpdate, beforeUpdate } from "svelte"
  import useClickOutside from "./useClickOutside"

  let visible = false
  let x: number
  let y: number
  let elem: HTMLElement
  
  export function show(_x: number, _y: number) {
    x = _x
    y = _y
    visible = true
  }

  export function hide() {
    if (visible) {
      visible = false
    }
  }

  function fixPosition() {
    if (!elem) {
      return
    }

    if (x + elem.offsetWidth > document.documentElement.clientWidth) {
      x = document.documentElement.clientWidth - elem.offsetWidth
    }
    if (y + elem.offsetHeight > document.documentElement.clientHeight) {
      y -= elem.offsetHeight
    }
  }

  beforeUpdate(fixPosition)
  afterUpdate(fixPosition)

  const { clickInside, clickOutside } = useClickOutside(() => {
    hide()
  })

</script>

<svelte:window on:click={clickOutside} />

{#if visible}
  <div class='menu'
    bind:this={elem}
    style='transform: translate({x}px, {y}px)'
    on:click={clickInside} 
  >
    <slot />
  </div>
{/if}

<style>
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
</style>