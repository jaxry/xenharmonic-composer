<script lang="ts">


</script>

<div class='item'>
  <slot />
</div>

<style>
  .item {
    padding: 0.5rem 1rem;
    background: var(--background);
  }

  .item:hover {
    background: var(--hover);
  }

  .item:active {
    background: var(--active);
  }
</style>