<script lang="ts">
  import type Block from '../composition/Block'
  import Section from '../composition/Section'
  import Pitch from '../Pitch'
  import { blockHeight } from './props'

  export let block: Block
  export let selected: boolean
</script>

<div 
  class='block' 
  class:selected 
  style='height: {blockHeight * block.computedDuration}rem' 
  on:click
>
  {#if block.element instanceof Pitch}
    {block.element.octave} . {block.element.interval.toString()}
  {:else if block.element instanceof Section}
    {block.element.name}
  {/if}
  <div>{block.duration.toString()}</div>
</div>

<style>
  .block {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    white-space: nowrap;
    font-weight: bold;
    user-select: none;
    cursor: pointer;
    border-bottom: var(--border);
  }

  .block:last-child {
    border-bottom: none;
  }

  .block:hover {
    background: var(--hover);
  }

  .block:active {
    background: var(--active);
  }

  .selected {
    background: var(--selected) !important;
  }
</style>