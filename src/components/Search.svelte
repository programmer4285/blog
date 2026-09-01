<script lang="ts">
  import icon from "../assets/search.svg";
  import Fuse, { type FuseResult } from "fuse.js";

  interface Post {
    id: string;
    title: string;
    description: string;
    tags: string[];
    body: string | undefined;
  }

  type Snippet =
    | {
        type: "match";
        before: string;
        highlight: string;
        after: string;
      }
    | { type: "more"; count: number };

  interface Props {
    index: Post[];
  }

  function buildSnippets(result: FuseResult<Post>): Snippet[] {
    const MAX_SIZE = 25;

    let snippets: Snippet[] = [];
    for (const match of result.matches ?? []) {
      if (match.key === "title") continue;

      if (!match.value) continue;

      for (const ind of match.indices) {
        const start = Math.max(0, ind[0] - MAX_SIZE);
        const end = Math.min(match.value.length, ind[1] + MAX_SIZE);
        snippets.push({
          type: "match",
          before: match.value.substring(start, ind[0]),
          highlight: match.value.substring(ind[0], ind[1] + 1),
          after: match.value.substring(ind[1] + 1, end),
        });
      }
    }

    if (snippets.length > 4) {
      const count = snippets.length - 4;
      snippets = snippets.slice(0, 4);
      snippets.push({ type: "more", count });
    }

    return snippets;
  }

  let { index }: Props = $props();

  let fuse = $derived(
    new Fuse(index, {
      keys: [
        {
          name: "title",
          weight: 3,
        },
        {
          name: "description",
          weight: 2,
        },
        {
          name: "body",
          weight: 1,
        },
      ],
      ignoreLocation: true,
      includeMatches: true,
      minMatchCharLength: 2,
      threshold: 0.25,
    }),
  );

  let query = $state("");

  let results = $derived(query.trim() ? fuse.search(query, { limit: 5 }) : []);
</script>

<div>
  <button popovertarget="search-bar">
    <img src={icon.src} alt="Search..." width="20" height="20" />
  </button>

  <div
    id="search-bar"
    popover="auto"
    ontoggle={(e) => {
      if (e.newState === "closed") query = "";
    }}
  >
    <input type="text" placeholder="Type to search..." bind:value={query} />

    {#if results.length > 0}
      <ul class="search-results">
        {#each results as result (result.item.id)}
          <li>
            <article>
              <h3>
                <a href={`/posts/${result.item.id}`}>{result.item.title}</a>
              </h3>
              <ul class="snippets">
                {#each buildSnippets(result) as snippet, i (i)}
                  {#if snippet.type === "match"}
                    <li>
                      <small
                        >{snippet.before}<strong>{snippet.highlight}</strong
                        >{snippet.after}</small
                      >
                    </li>
                  {:else}
                    <li class="more-matches">
                      <small
                        ><a href={`/posts/${result.item.id}`}
                          >{snippet.count} more matches →</a
                        ></small
                      >
                    </li>
                  {/if}
                {/each}
              </ul>
            </article>
          </li>
        {/each}
      </ul>
    {/if}
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
    width: 25rem;
    max-width: 75vw;
  }

  [popover] {
    border: none;
    background: var(--pico-background-color);
    overflow: visible;
  }

  .search-results {
    display: flex;
    flex-direction: column;
    padding: 0;
    list-style: none;
    overflow-y: auto;
    margin-top: 0.5rem;
    height: 18rem;
  }

  .search-results > li {
    padding: 0;
    width: 90%;
  }

  .snippets {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .snippets > li {
    list-style: none;
    padding-top: 0;
    padding-bottom: 0;
  }

  .more-matches {
    margin-top: 0.5rem;
    border-top: solid;
  }
</style>
