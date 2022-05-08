<script lang="ts">
import Close from 'svelte-material-icons/Close.svelte';
import Flag from 'svelte-material-icons/Flag.svelte';
import IconButton from "../components/IconButton.svelte";
import ActionButton from "../components/ActionButton.svelte";
import Dictionary from "../icons/Dictionary.svelte";
import Modal from "../components/Modal.svelte";
import { accordion } from '../accordion';
import Report from "../modals/Report.svelte";

export let word = '';
let open = false;
let openReport = false;
let result: any;

const handleOpen = async () => {
  open = true;
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
  result = await response.json();
}

const handleClose = () => {
  result = undefined;
  open = false;
}

const handleOpenReport = () => {
  openReport = true;
}

const handleCloseReport = () => {
  openReport = false;
}
</script>

<IconButton onClick={handleOpen}>
  <Dictionary />
</IconButton>
<Modal open={open} onClose={handleClose}>
  <div class=title slot=title>
    <h1>{word}</h1>
    <div class=report>
      <IconButton onClick={handleOpenReport}>
        <Flag />
      </IconButton>
    </div>
  </div>
  <div slot=content>
    {#if result}
      {#if result[0]}
        {#if result[0].phonetic}
          <h2>{result[0].phonetic}</h2>
        {/if}
        {#each result[0].meanings as meaning}
          <h3>{meaning.partOfSpeech}</h3>
          <div>
            {#each meaning.definitions as definition}
              <p>
                {definition.definition}
              </p>
            {/each}
          </div>
        {/each}
        <div>
          Provided by <a href={result[0].sourceUrls[0]}>Wiktionary</a>
        </div>
      {:else}
        no definitions found
      {/if}
    {/if}
  </div>
  <div slot=controls>
    <ActionButton onClick={handleClose}>
      <Close />
      Close
    </ActionButton>
  </div>
</Modal>
<Report
  {word}
  open={openReport}
  onClose={handleCloseReport}
/>

<style>
  .title {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  p {
    border-left: 4px solid grey;
    padding-left: 8px;
    text-align: left;
    font-weight: 500;
    opacity: 90%;
  }
  .report {
    position: absolute;
    right: 1em;
  }
</style>