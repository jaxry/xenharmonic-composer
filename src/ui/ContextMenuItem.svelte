<div class='item' on:click>
  <slot />
</div>

<style>
  .item {
    position: relative;
    padding: 0.5rem 1rem;
  }

  .item:hover {
    background: var(--hover);
  }
</style>
