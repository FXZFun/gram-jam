<script lang="ts">
import ActionButton from "./ActionButton.svelte";
import Dictionary from "./icons/Dictionary.svelte";
import Modal from "./Modal.svelte";
import { accordion } from './accordion';

export let word = '';
let open = false;
let result: any;

const handleOpen = async () => {
  open = true;
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
  result = await response.json();
  console.log(result);
}

const handleClose = () => {
  result = undefined;
  open = false;
}
</script>

<ActionButton onClick={handleOpen}>
  <Dictionary />
</ActionButton>
<Modal open={open} onClose={handleClose}>
  <div slot=title>
    <h1>{word}</h1>
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
      Close
    </ActionButton>
  </div>
</Modal>

<style>
  p {
    border-left: 4px solid grey;
    padding-left: 8px;
    text-align: left;
    font-weight: 500;
    opacity: 90%;
  }
</style>