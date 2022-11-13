<template>
  <button
    :title="`click to remove '${term}'`"
    class="queer-applied-search-term"
    @click="$emit('click', term)"
  >
    {{term}}
  </button>
</template>

<script>
export default {
  name: 'AppliedSearchTerm',

  props: {
    term: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
  .queer-applied-search-term {
    color: var(--colour-sanstream-orange-on-white);
    font-style: italic;
    display: inline-block;
    background-color: var(--colour-light-grey-fill);
    border-radius: 3px;
    margin-right: 0.75em;
    padding: 0.1em 0.5em;
    border: 0;
    line-height: 1.5em;
    cursor:pointer;

    /* border: 1px solid var(--colour-sanstream-orange-on-white); */
  }

  .queer-applied-search-term::after {
    color: var(--colour-sanstream-orange-on-white);
    content: '⨯';
    position: relative;
    /* right: 0.15em; */
    /* top: 0.05em; */
    padding: 0 0 0 0.25em;
    margin: 0 0 0 0.1em;
    border-left: 1px solid var(--colour-sanstream-yellow);
 }
</style>
