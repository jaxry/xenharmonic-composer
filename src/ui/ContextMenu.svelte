<script context="module" lang="ts">
  import useContext from "./useContext"
  import type { Unsubscriber } from "svelte/store"

  const context = useContext<{
    onPointerEnter: (callback: (elem: HTMLElement) => void) => Unsubscriber
    hide: () => void
  }>()
  
  export const getContextMenuContext = context.get
</script>

<script lang="ts">
  import { afterUpdate, tick } from "svelte"
  import useClickOutside from "./useClickOutside"
  import useEvent from "./useEvent";

  let elem: HTMLElement

  let visible = false
  let x: number
  let y: number
  let parent: {width: number, height: number}

  export function hide(delay = 0) {
    if (visible) {
      visible = false
    }
  }

  export async function show(_x = 0, _y = 0, _parent?: { width: number, height:number }) {
    hide()
    await tick()
    x = _x + (_parent ? _parent.width : 0)
    y = _y
    parent = _parent
    visible = true
  }

  export function isVisible() {
    return visible
  }

  const { subscribe: onPointerEnter, emit: emitPointerEnter } = useEvent<HTMLElement>(null)

  context.set({
    onPointerEnter,
    hide
  })

  let lastElem: HTMLElement
  function pointerMove(e: PointerEvent) {
    if (lastElem !== e.target) {
      lastElem = e.target as HTMLElement
      emitPointerEnter(lastElem)
    }
  }

  function fitElement() {
    if (!elem) {
      return
    }

    if (x + elem.offsetWidth > document.documentElement.clientWidth) {
      x = parent ? 
        x - parent.width - elem.offsetWidth :
        document.documentElement.clientWidth - elem.offsetWidth
    }
    if (y + elem.offsetHeight > document.documentElement.clientHeight) {
      y = parent ?
        y - elem.offsetHeight + parent.height :
        y - elem.offsetHeight
    }
  }

  afterUpdate(fitElement)

  const { clickInside, clickOutside } = useClickOutside(hide)

  function keypress(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      hide()
    }
  }

  $: {
    if (elem) {
      document.body.appendChild(elem)
    }
  }
</script>

<svelte:window on:click={clickOutside} on:keydown={keypress} />

{#if visible}
  <div class='menu'
    bind:this={elem}
    style='transform: translate({x}px, {y}px)'
    on:click={clickInside}
    on:pointermove={pointerMove}
  >
    <slot />
  </div>
{/if}

<style>
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    background: var(--background);
  }
</style>