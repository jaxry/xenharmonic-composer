<script context="module">
  export const blockHeight = 2.5
</script>

<script lang="ts">
  import { composition } from './stores'
  import { initialState, setSelected, activeSection } from './SequencerState'
  import sequencerKeyBinds from './sequencerKeyBinds'
  import Block from './Block.svelte'

  let state = initialState($composition)
  $: section = activeSection(state)

  function keypress(e: KeyboardEvent) {
    const newState = sequencerKeyBinds(e, state)
    if (newState !== state) {
      e.preventDefault()
      state = newState
    }
  }
</script>

<svelte:window on:keydown={keypress} />

<div class='section'>
  <div class='tracks'>
    {#each section.tracks as track}
      <div class='track'>
        {#each track.chains as chain}
          <div class='chain' style='top: {chain.beginning * blockHeight}rem'>
            {#each chain.blocks as block}
              <Block
                {block}
                selected={state.selectedLocation?.block === block}
                on:click={() => state = setSelected(state, section.findBlock(block))}
              />
            {/each}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .tracks {
    display: flex;
    gap: 0.25rem;
  }

  .track {
    position: relative;
    width: 8rem;
  }

  .chain {
    width: 100%;
    position: absolute;
    border: var(--border);
  }
</style>