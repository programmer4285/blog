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

  let isOpen = $state(false);

  let container: HTMLElement;

  $effect(() => {
    if (!isOpen) return;

    function handleClick(event: MouseEvent) {
      if (!container.contains(event.target as Node)) {
        isOpen = false;
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  });
</script>

<div class="search-container" bind:this={container}>
  <button onclick={() => (isOpen = !isOpen)}>
    <img src={icon.src} alt="Search..." width="20" height="20" />
  </button>

  {#if isOpen}
    <input type="text" placeholder="Type to search..." />
  {/if}
</div>

<style>
  button {
    padding: 0.25rem;
  }

  img {
    display: block;
  }

  .search-container {
    position: relative;
  }

  .search-container > input {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    width: 16rem;
  }
</style>
