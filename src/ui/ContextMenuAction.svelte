<script lang="ts">
  
  import { getContextMenuContext } from "./ContextMenu.svelte"
  import ContextMenuItem from "./ContextMenuItem.svelte"


  const contextMenuContext = getContextMenuContext()
  export let action: (() => void) | null = null

  function click() {
    action?.()
    contextMenuContext?.hide()
  }

</script>

<ContextMenuItem on:click={action ? click : undefined}>
  <slot />
</ContextMenuItem>


