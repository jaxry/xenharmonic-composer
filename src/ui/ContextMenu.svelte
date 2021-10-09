<script lang="ts">

  let x = 0
  let y = 0

  function click(e: MouseEvent) {
    x = e.clientX
    y = e.clientY
  }

</script>

<svelte:window on:contextmenu={click}/>

<div class='menu' style='transform: translate({x}px, {y}px)'>
  test
</div>

<style>
  .menu {
    position: fixed;
  }
</style>