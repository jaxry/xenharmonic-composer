<script lang="ts">
  import type { SvelteComponent } from 'svelte'

  export let tabs: {
    name: string,
    content: typeof SvelteComponent
  }[] = []

  let selectedTab = 0
</script>

<div class='container'>
  <div class='tabs'>
    {#each tabs as tab, i}
      <div 
        class='tab'
        class:selected={i === selectedTab} 
        on:click={() => selectedTab = i}
      >
        {tab.name}
      </div>
    {/each}
  </div>
  <div class='content'>
    <svelte:component this={tabs[selectedTab].content} />
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: flex-start;
  }

  .tabs {
    background: var(--background);
    flex: 0 0 auto;
  }

  .tab {
    padding: 1rem;
    user-select: none;
    cursor: pointer;
  }

  .tab:hover {
    background: var(--hover);
  }

  .tab:active {
    background: var(--active);
  }

  .selected {
    background: hsl(var(--primaryHue), var(--primarySat), 45%) !important;
  }

  .content {
    padding: 1rem;
    flex: 1 1 auto;
  }
</style>