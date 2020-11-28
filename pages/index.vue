<template>
  <div class="sanstream-grid-layout-full-viewport">
    <header
        class="sanstream-fluid-layout"
    >
      <h1 class="sanstream-heading">That LGBTQIA+ Identity Explainer
        <br/>
        <OwnershipTag
          :yearOfCreation="2020"
        />
      </h1>
    </header>
    <main class="sanstream-grid-layout">
      <summary class="grid-left-aside-area">
        <StandardParagraph>
          There are lots ways how the members of the 
          LGBTQIA+ community identify themselves.
          This tool tries to give some insight into their meaning.
        </StandardParagraph>
        <StandardParagraph>
          It is also a way, as a LGBTQIA+ community member,
          to share your identity without having to explain
          it every single time.
        </StandardParagraph>
      </summary>
      <section class="grid-main-area">
        <SpectrumPositionsGraph
          :ordering="ordering"
          :dataMappers="dataMappers"
          :spectraData="spectraData"
        />
      </section>
    </main>
  </div>
</template>

<script>
import { DataMapper } from 'sanstream-design-system'
const ordering = [
  'genderIdentity',
  'bioSex',
  'transition',
  'sexualAttraction',
  'romanticAttraction',
]
const dataMappers = {
  'genderIdentity': new DataMapper({
    label: 'Gender identity',
    mapper: d => d.ratings.genderIdentity,
    dataRange: [-2, -1, 0, 1, 2],
    dataRangeLabels: ['man', null, null, null, 'woman'],
  }),
  'bioSex': new DataMapper({
    label: 'Biological sex',
    mapper: d => d.ratings.biologicalSex,
    dataRange: [-2, -1, 0, 1, 2],
    dataRangeLabels: ['man', null, null, null, 'woman'],
  }),
  'transition': new DataMapper({
    label: 'Gender transition',
    mapper: d => d.ratings.genderTransition,
    dataRange: [0, 1, 2, 4, 5],
    dataRangeLabels: ['fully (trans)', null, null, null, 'none (cis)'],
  }),
  'sexualAttraction': new DataMapper({
    label: 'Sexually attracted to',
    mapper: d => d.ratings.sexuallyAttractedTo,
    dataRange: [-2, -1, 0, 1, 2],
    dataRangeLabels: ['men', null, null, null, 'women'],
  }),
  'romanticAttraction': new DataMapper({
    label: 'Romantically attracted to',
    mapper: d => d.ratings.romanticallyAttractedTo,
    dataRange: [-2, -1, 0, 1, 2],
    dataRangeLabels: ['men', null, null, null, 'women'],
  }),
  'description': new DataMapper({
    mapper: d => d.description,
  }),
}

const spectraData = {
  "ratings": {
    "genderIdentity": [2],
    "biologicalSex": [-2],
    "genderTransition": [0],
    "sexuallyAttractedTo": false,
    "romanticallyAttractedTo": [0,1,2]
  },
  "description": "A transgender woman who is not sexually attracted, but can be romantically attracted to women."
}
export default {
   data () {
    return {
      ordering,
      dataMappers,
      spectraData,
    }
  },
}
</script>

<style>
.grid-left-aside-area {
  grid-column-start: 1;
  grid-column-end: 3;
}
.grid-main-area {
  grid-column-start: 3;
  grid-column-end: 9;
}
</style>
