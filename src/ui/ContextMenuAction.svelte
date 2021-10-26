<script lang="ts">  
  import { getContextMenuContext } from "./ContextMenu.svelte"
  import ContextMenuItem from "./ContextMenuItem.svelte"

  export let action: (() => void) | null = null

  const contextMenuContext = getContextMenuContext()

  function click() {
    action!()
    contextMenuContext?.hide()
  }

</script>

<ContextMenuItem on:click={action ? click : () => {}}>
  <slot />
</ContextMenuItem>