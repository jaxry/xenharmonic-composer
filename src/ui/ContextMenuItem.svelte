<div class='item' on:click>
  <slot />
</div>

<style>
  .item {
    padding: 0.5rem 1rem;
    min-width: 10rem;
  }

  .item:hover {
    background: var(--hover);
  }
</style>
