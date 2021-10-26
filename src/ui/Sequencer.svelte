<script lang="ts">
  import type Block from '../composition/Block'
  import { shiftPitch } from '../composition/operations'
  import BlockComponent from './BlockComponent.svelte'
  import ContextMenu from './ContextMenu.svelte'
  import ContextMenuAction from './ContextMenuAction.svelte'
  import ContextMenuSubMenu from './ContextMenuSubMenu.svelte'
  import Modulations from './Modulations.svelte'
  import sequencerKeyBinds from './sequencerKeyBinds'
  import * as stateHelper from './SequencerState'
  import { composition } from './stores'
  import useClickOutside from './useClickOutside'
  import useWheel from './useWheel'

  let state = stateHelper.initialState($composition)
  $: section = stateHelper.activeSection(state)
  $: blockHeight = 2.5 / section.minBlockDuration

  const playPitch = stateHelper.usePlayPitch()
  $: {
    playPitch(state)
  }

  let contextMenu: ContextMenu

  function keydown(e: KeyboardEvent) {
    if (contextMenu.isVisible()) {
      return
    }
    const newState = sequencerKeyBinds(e, state)
    if (newState !== state) {
      state = newState
      e.preventDefault()
    }
  }

  const wheel = useWheel((e, delta) => {
    if (!state.selectedLocation || contextMenu.isVisible()) {
      return
    }
    if (delta !== 0) {
      shiftPitch(state.selectedLocation.block, state.composition.intervals, delta)
      state = state
    }

    e.preventDefault()
  })

  const { clickInside, clickOutside } = useClickOutside(() => {
    state = stateHelper.setSelected(state, null)
  })

  function selectBlock(block: Block){
    state = stateHelper.setSelected(state, section.findBlock(block)!)
  }

  function showContextMenu(block: Block) {
    return (e: MouseEvent) => {
      selectBlock(block)
      contextMenu.show(e.clientX, e.clientY)
      e.preventDefault()
    }
  }
</script>

<svelte:window 
  on:keydown={keydown} 
  on:wheel|nonpassive={wheel} 
/>

<ContextMenu bind:this={contextMenu}>
  <ContextMenuAction action={() => console.log('one')}>hi</ContextMenuAction>
  <ContextMenuSubMenu>
    Expand me
    <svelte:fragment slot='submenu'>
      <ContextMenuAction>hey</ContextMenuAction>
      <ContextMenuAction>there</ContextMenuAction>
      <ContextMenuAction>guy</ContextMenuAction>
      <ContextMenuAction>i</ContextMenuAction>
      <ContextMenuAction>am</ContextMenuAction>
    </svelte:fragment>
  </ContextMenuSubMenu>
  <ContextMenuAction action={() => console.log('three')}>Another</ContextMenuAction>
</ContextMenu>

<input class='sectionName' bind:value={section.name} />

<div class='section' on:click={clickOutside} style='height: {section.duration * blockHeight}rem'>
  <div class='tracks'>
    {#each section.tracks as track (track)}
      <div class='track'>
        {#each track.chains as chain (chain)}
          <div class='chain' style='top: {chain.beginning * blockHeight}rem' on:click={clickInside}>
            {#each chain.blocks as block (block)}
              <BlockComponent
                {block}
                {blockHeight}
                isSelected={stateHelper.selectedBlock(state) === block}
                on:click={() => selectBlock(block)}
                on:contextmenu={showContextMenu(block)} 
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