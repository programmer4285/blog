<script lang="ts">
  import icon from "../assets/search.svg";
  import Fuse from "fuse.js";

  interface Props {
    index: {
      title: string;
      description: string;
      tags: string[];
      body: string | undefined;
    }[];
  }
  let { index }: Props = $props();

  const fuse = $derived(
    new Fuse(index, {
      keys: ["title", "description", "tags", "body"],
    }),
  );

  let query = $state("");
</script>

<div>
  <button popovertarget="search-bar">
    <img src={icon.src} alt="Search..." width="20" height="20" />
  </button>

  <div id="search-bar" popover="auto">
    <input
      type="text"
      placeholder="Type to search..."
      bind:value={query}
      ontoggle={(e) => {
        if (e.newState === "closed") query = "";
      }}
    />
  </div>
</div>

<style>
  button {
    padding: 0.25rem;
  }

  img {
    display: block;
  }

  #search-bar {
    margin-top: 0.5rem;
    inset: auto;
    position-area: bottom span-left;
    width: 20rem;
    max-width: 75vw;
  }

  [popover] {
    border: none;
    background: var(--pico-background-color);
    overflow: visible;
  }
</style>
