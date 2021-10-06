<script lang="ts">
  import Block from './Block.svelte'
  import { blockHeight } from './props'
  import sequencerKeyBinds from './sequencerKeyBinds'
  import { activeSection,initialState,modulationsBetween,SequencerState,setSelected,usePlayPitch } from './SequencerState'
  import { composition } from './stores'
  import useClickOutside from './useClickOutside'

  let state = initialState($composition)
  $: section = activeSection(state)
  
  const playPitch = usePlayPitch()

  function setState(newState: SequencerState) {
    if (newState === state) {
      return false
    }
    playPitch(newState)
    state = newState
    return true
  }

  function keydown(e: KeyboardEvent) {
    const newState = sequencerKeyBinds(e, state)
    if (setState(newState)) {
      e.preventDefault()
    }
  }

  const { clickInside, clickOutside } = useClickOutside(() => {
    setState(setSelected(state, null))
  })

</script>

<svelte:window on:keydown={keydown} on:click={clickOutside} />

<input class='sectionName' bind:value={section.name}/>

<div class='section'>
  <div class='tracks'>
    {#each section.tracks as track}
      <div class='track'>
        {#each track.chains as chain}
          <div class='chain' style='top: {chain.beginning * blockHeight}rem' on:click={clickInside}>
            {#each chain.blocks as block}
              <Block
                {block}
                selected={state.selectedLocation?.block === block}
                on:click={() => setState(setSelected(state, section.findBlock(block)))}
              />
            {/each}
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div class='modulations'>
    {#each modulationsBetween(state) as {modulation, position}}
      <div class='modulation' style='top: {blockHeight * position}rem'>
        {modulation.interval.numerator} / {modulation.interval.denominator}
      </div>
    {/each}
  </div>
</div>

<style>
  .sectionName {
    width: 100%;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .section {
    position: relative;
  }

  .tracks {
    display: flex;
    gap: 0.25rem;
    margin-left: 5rem;
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

  .modulations {
    display: absolute;
    top: 0;
    width: 100%;
  }

  .modulation {
    position: absolute;
    border-top: 2px solid var(--primary);
    width: 100%;
  }
</style>