<script lang="ts">
  import ContextMenu, { getContextMenuContext } from "./ContextMenu.svelte"
  import ContextMenuItem from "./ContextMenuItem.svelte"
  import useSingleTimeout from "./useSingleTimeout"

  let active = false

  const contextMenuContext = getContextMenuContext()

  let elem: HTMLElement
  let subMenu: ContextMenu

  let timeout = useSingleTimeout()
  let delay = 300

  function enter() {
    active = true

    if (subMenu.isVisible()) {
      timeout(null)
    } else {
      timeout(() => {
        const { top, left, width, height } = elem.getBoundingClientRect()
        subMenu.show(left, top, {width, height})
      }, delay)
    }
  }

  function leave() {
    if (active && !subMenu.isVisible()) {
      active = false
      timeout(null)
    }
  }

  contextMenuContext.onPointerEnter((menuElem) => {
    if (active && !elem.contains(menuElem)) {
      active = false

      if (subMenu.isVisible()) {
        timeout(subMenu.hide, delay)
      }
    }
  })

</script>

<div 
  class:active
  on:pointerenter={enter}
  on:pointerleave={leave}
  bind:this={elem}
>
  <ContextMenuItem>
    <slot />
  </ContextMenuItem>
</div>


<ContextMenu bind:this={subMenu}>
  <div on:pointerenter={enter}>
    <slot name='submenu' />
  </div>
</ContextMenu>
  
<style>
  .active {
    background: var(--hover);
  }
</style>