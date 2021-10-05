<script lang="ts">
	import ScaleEditor from './ScaleEditor.svelte'
	import Sequencer from './Sequencer.svelte'
	import Navigation from './Navigation.svelte'
	import InstrumentEditor from './InstrumentEditor.svelte'
</script>

<main>
	<Navigation tabs={[
		{name: 'Sequencer', content: Sequencer},
		{name: 'Scales', content: ScaleEditor},
		{name: 'Instruments', content: InstrumentEditor}
	]} />
</main>