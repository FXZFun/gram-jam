<script lang="ts">
import ActionButton from "./ActionButton.svelte";
import Dictionary from "./icons/Dictionary.svelte";
import Modal from "./Modal.svelte";

export let word = '';
let open = false;
let result: any;

const handleToggleDictionary = async () => {
  if (word) {
    open = !open;
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    result = await response.json();
    // console.log(result);
  }
}
</script>

<ActionButton onClick={handleToggleDictionary}>
  <Dictionary />
</ActionButton>
<Modal open={open} onClose={handleToggleDictionary}>
  <div class=container>
    {#key word}
      {#if result}
        <h1>{word}</h1>
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
          <p>
            Provided by <a href={result[0].sourceUrls[0]}>Wiktionary</a>
          </p>
        {:else}
          no definitions found
        {/if}
      {/if}
    {/key}
    <div class=controls>
      <ActionButton onClick={handleToggleDictionary}>
        Close
      </ActionButton>
    </div>
  </div>
</Modal>

<style>
  .container {
    padding: 1em;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  p {
    font-weight: 500;
    opacity: 90%;
  }
  .controls {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0.5em;
  }
</style>