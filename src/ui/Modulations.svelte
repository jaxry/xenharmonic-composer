<script lang="ts">
  import { SequencerState, modulationsBetween } from "./SequencerState"
  export let state: SequencerState
  export let blockHeight: number
</script>

<div class='modulations'>
  {#each modulationsBetween(state) as {modulation, position}}
    <div class='modulation' style='top: {blockHeight * position}rem'>
      {modulation.interval.numerator} / {modulation.interval.denominator}
    </div>
  {/each}
</div>

<style>
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

