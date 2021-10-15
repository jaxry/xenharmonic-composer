<script lang="ts">
  import ContextMenu, { getContextMenuBehavior } from "./ContextMenu.svelte"
  import useSingleTimeout from "./useSingleTimeout"

  export let action: () => void | null = null
  let active = false

  const contextMenuBehavior = getContextMenuBehavior()

  function click() {
    action?.()
    contextMenuBehavior.hide()
  }

  let elem: HTMLElement

  const hasSubmenu = $$slots.submenu
  let subMenu: ContextMenu

  let timeout = useSingleTimeout()
  let delay = 400

  function enter() {
    if (subMenu.isVisible()) {
      timeout(null)
      return
    }

     timeout(() => {
      active = true
      const { top, left, width, height } = elem.getBoundingClientRect()
      subMenu.show(left, top, {width, height})
      contextMenuBehavior.onLoseFocus(elem, () => {
        timeout(() => {
          active = false
          subMenu.hide()
          contextMenuBehavior.removeOnLoseFocus()
        }, delay)
      })
    }, delay)
  }

  function leave() {
    timeout(null)
  }
</script>

{#if hasSubmenu}
  <div 
    class='item' 
    class:active
    on:click={action ? click : undefined} 
    on:pointerenter={enter}
    on:pointerleave={leave}
    bind:this={elem}
  >
    <slot />
  </div>

  <ContextMenu bind:this={subMenu}>
    <slot name='submenu' />
  </ContextMenu>

{:else}
  <div class='item' on:click={action ? click : undefined}>
    <slot />
  </div>
{/if}

<style>
  .item {
    position: relative;
    padding: 0.4rem 1rem;
    background: var(--background);
  }

  .item:hover {
    background: var(--hover);
  }

  .active {
    background: var(--hover);
  }
</style>