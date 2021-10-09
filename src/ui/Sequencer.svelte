<script lang="ts">
  import type Block from '../composition/Block'
  import { shiftPitch } from '../composition/operations'
  import BlockComponent from './BlockComponent.svelte'
  import Modulations from './Modulations.svelte'
  import sequencerKeyBinds from './sequencerKeyBinds'
  import type { SequencerState } from './SequencerState'
  import * as stateHelp from './SequencerState'
  import { composition } from './stores'
  import useClickOutside from './useClickOutside'
  import useWheel from './useWheel'

  let state = stateHelp.initialState($composition)
  $: section = stateHelp.activeSection(state)
  $: blockHeight = 2.5 / section.minBlockDuration
  
  const playPitch = stateHelp.usePlayPitch()

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

  const wheel = useWheel((e, delta) => {
    if (!state.selectedLocation) {
      return
    }
    if (delta !== 0) {
      shiftPitch(state.selectedLocation.block, state.composition.intervals, delta)
      setState({...state})
    }

    e.preventDefault()
  })

  const { clickInside, clickOutside } = useClickOutside(() => {
    setState(stateHelp.setSelected(state, null))
  })

  function click(block: Block) {
    return () => {
      setState(stateHelp.setSelected(state, section.findBlock(block)))
    }
  }

  function contextMenu(block: Block) {
    return (e: MouseEvent) => {
      setState(stateHelp.setSelected(state, section.findBlock(block)))
      e.preventDefault()
    }
  }
</script>

<svelte:window on:keydown={keydown} on:wheel|nonpassive={wheel} on:click={clickOutside} />

<input class='sectionName' bind:value={section.name} />

<div class='section'>
  <div class='tracks'>
    {#each section.tracks as track (track)}
      <div class='track'>
        {#each track.chains as chain (chain)}
          <div class='chain' style='top: {chain.beginning * blockHeight}rem' on:click={clickInside}>
            {#each chain.blocks as block (block)}
              <BlockComponent
                {block}
                {blockHeight}
                selected={state.selectedLocation?.block === block}
                on:click={click(block)}
                on:contextmenu={contextMenu(block)}
              />
            {/each}
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <Modulations {state} {blockHeight} />
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
</style>