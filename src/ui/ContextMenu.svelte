<script context="module" lang="ts">
  import useContext from "./useContext"

  const behavior = useContext<{
    hide: () => void,
    onLoseFocus: (elem: HTMLElement, callback: () => void) => void
    removeOnLoseFocus: () => void
  }>()
  
  export const getContextMenuBehavior = behavior.get
</script>

<script lang="ts">
  import { afterUpdate, beforeUpdate } from "svelte"
  import useClickOutside from "./useClickOutside"

  let elem: HTMLElement

  let visible = false
  let x: number
  let y: number
  let parent: {width: number, height: number}
  
  let activeTarget: HTMLElement | null = null
  let loseFocusCallback: () => void = null

  export function show(_x = 0, _y = 0, _parent?: {width: number, height:number}) {
    x = _x + (_parent ? _parent.width : 0)
    y = _y
    parent = _parent

    visible = true
  }

  export function hide(delay = 0) {
    if (visible) {
      visible = false
    }
  }

  export function isVisible() {
    return visible
  }

  behavior.set({
    hide,
    onLoseFocus(elem, fn) {
      activeTarget = elem
      loseFocusCallback = fn
    },
    removeOnLoseFocus() {
      activeTarget = null
      loseFocusCallback = null
    }
  })

  $: {
    if (elem) {
      document.body.appendChild(elem)
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
        y - elem.offsetHeight - parent.height :
        y - elem.offsetHeight
    }
  }

  beforeUpdate(fitElement)
  afterUpdate(fitElement)

  const { clickInside, clickOutside } = useClickOutside(hide)

  function keypress(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      hide()
    }
  }

  let lastTarget: EventTarget
  function move(e: PointerEvent) {
    if (e.target !== lastTarget) {
      if (activeTarget && !activeTarget.contains(e.target as Node)) {
        loseFocusCallback?.()
      }
      lastTarget = e.target
    }
  }
</script>

<svelte:window on:click={clickOutside} on:keydown={keypress} />

{#if visible}
  <div class='menu'
    bind:this={elem}
    style='transform: translate({x}px, {y}px)'
    on:click={clickInside}
    on:pointermove={move}
  >
    <slot />
  </div>
{/if}

<style>
  .menu {
    position: fixed;
    top: 0;
    left: 0;
  }
</style>