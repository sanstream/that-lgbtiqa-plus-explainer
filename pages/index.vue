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
      <aside class="grid-left-aside-area">
        <StandardParagraph>
          There are lots ways of how the members of the
          LGBTQIA+ community identify themselves.
          A lot of those terms can be confusing when not explained.
          This tool's purpose is to help with that.
        </StandardParagraph>
        <StandardParagraph>
          Alternatively, if you are a LGBTQIA+ community member,
          you can share your identity, using a link to the search result (in the address bar),
          without having to explain
          it every single time.<br> <br> Nifty ey?
        </StandardParagraph>
      </aside>
      <section class="grid-main-area">
        <header
          class="search"
        >
          <SearchBox
            buttonLabel="Explain!"
            :onSubmit="applySearchTerm"
            :suggestions="suggestions"
            :defaultValue="searchTerm"
          />
          <StandardParagraph>
            Hint: you can combine several terms like
            <StandardLink href="?searchterm=non-binary%20transgender%20lesbian">
              "non-binary transgender lesbian"
            </StandardLink>. Just click on the link to see how.
          </StandardParagraph>
          <!-- <AppliedSearchTerms
            :searchTerms="appliedSearchTerms"
          /> -->
        </header>
        <SpectrumPositionGraphs
          class="results"
          :ordering="ordering"
          :dataMappers="dataMappers"
          :spectraData="getTermsData()"
        />
      </section>
    </main>
  </div>
</template>

<script>
import { Suggestion, DataKraai } from 'sanstream-design-system'
import lgbtTerms from '../raw-data/lgbtia-glossary.json'

const ordering = [
  'genderIdentity',
  'bioSex',
  'transition',
  'sexualAttraction',
  'romanticAttraction',
]
const dataMappers = {
  'genderIdentity': new DataKraai({
    label: 'Gender identity',
    mapper: d => d.ratings.genderIdentity,
    dataRange: [-2, -1, 0, 1, 2],
    dataRangeLabels: ['man', null, null, null, 'woman'],
  }),
  'bioSex': new DataKraai({
    label: 'Biological sex',
    mapper: d => d.ratings.biologicalSex,
    dataRange: [-2, -1, 0, 1, 2],
    dataRangeLabels: ['man', null, null, null, 'woman'],
  }),
  'transition': new DataKraai({
    label: 'Gender transition',
    mapper: d => d.ratings.genderTransition,
    dataRange: [4, 3, 2, 1, 0],
    dataRangeLabels: ['fully (trans)', null, null, null, 'none (cis)'],
  }),
  'sexualAttraction': new DataKraai({
    label: 'Sexually attracted to',
    mapper: d => d.ratings.sexuallyAttractedTo,
    dataRange: [-2, -1, 0, 1, 2],
    dataRangeLabels: ['men', null, null, null, 'women'],
  }),
  'romanticAttraction': new DataKraai({
    label: 'Romantically attracted to',
    mapper: d => d.ratings.romanticallyAttractedTo,
    dataRange: [-2, -1, 0, 1, 2],
    dataRangeLabels: ['men', null, null, null, 'women'],
  }),
  'description': new DataKraai({
    mapper: d => d.description,
  }),
}

class Spectra {
  constructor ({ratings, description}) {
    this.ratings = {
      genderIdentity: [],
      biologicalSex: [],
      genderTransition: [],
      sexuallyAttractedTo: [],
      romanticallyAttractedTo: [],
    }
    if (ratings) {
      const { genderTransition, genderIdentity, sexuallyAttractedTo, romanticallyAttractedTo, biologicalSex
      } = ratings
      this.ratings = {
        genderIdentity: Array.isArray(genderIdentity) ? [...genderIdentity ] : [],
        biologicalSex: Array.isArray(biologicalSex) ? [...biologicalSex ] : [],
        genderTransition: Array.isArray(genderTransition) ? [...genderTransition ] : [],
        sexuallyAttractedTo: Array.isArray(sexuallyAttractedTo) ? [...sexuallyAttractedTo ] : [],
        romanticallyAttractedTo: Array.isArray(romanticallyAttractedTo) ? [...romanticallyAttractedTo ] : [],
      }
    }

    this.description = description || ''
  }
}

const emptySpectraData = new Spectra({
  description: "No identity applied...",
})


const suggestions = Object.keys(lgbtTerms).map(term => {
  return new Suggestion({
    label: term,
    value: term
  })
})

const mappedLgbtTerms = new Map();

Object.keys(lgbtTerms).forEach(term => {
  mappedLgbtTerms.set(term.toLowerCase(), new Spectra(lgbtTerms[term]))
})

export default {
   data () {
    return {
      ordering,
      dataMappers,
      mappedLgbtTerms,
      suggestions,
      emptySpectraData,
      appliedSearchTerms: [],
      searchTerm: '',
    }
  },

  mounted () {
    this.onRouteUpdate(this.$route)
  },

  watch: {
    $route (to) {
      this.onRouteUpdate(to)
    },
  },

  methods: {
    onRouteUpdate(route) {
      if (route && route.query && route.query.searchterm) {
        this.searchTerm = route.query.searchterm
        this.appliedSearchTerms = route.query.searchterm.split(' ')
      } else {
        this.searchTerm = ''
        this.appliedSearchTerms = []
      }
    },

    applySearchTerm (searchTerm) {
      this.$router.push({
        query: {
          searchTerm,
        }
      })
    },

    getTermsData () {
      if (this.appliedSearchTerms.length) {
        let explanations = this.appliedSearchTerms.map((term) => {
          if (typeof term === 'string' && mappedLgbtTerms.has(term.toLowerCase())) {
            return mappedLgbtTerms.get(term.toLowerCase())
          }
        })
        // clear out missing results (undefined/null):
        .filter((explanation) => !!explanation)

        // could not make sense out of the single word, but perhaps when
        // combined they do make sense:
        if (explanations.length === 0 && this.appliedSearchTerms.length) {
          const alternativeTerm = this.appliedSearchTerms.join(' ').toLowerCase()
          if (mappedLgbtTerms.has(alternativeTerm)) {
            return mappedLgbtTerms.get(alternativeTerm)
          }
        }

        if (explanations.length) {
          // merge explainations:
          return explanations.reduce((previousExpl, currentExpl) => {
            const description = previousExpl.description + '\n\n' + currentExpl.description
            const ratings = {}

            Object.keys(currentExpl.ratings).forEach(identity => {
              if (currentExpl.ratings[identity].length === 0) {
                ratings[identity] = previousExpl.ratings[identity]
              } else {
                ratings[identity] = [ ...previousExpl.ratings[identity], ...currentExpl.ratings[identity]]
                .filter((value, index, self) => self.indexOf(value) === index)
              }
            })

          return new Spectra({
              ratings,
              description,
            })
          })
        } else {
          return emptySpectraData
        }
      }
      else return emptySpectraData
    },
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
  display: grid;
  grid-template-areas:
  'search'
  'results';
  gap: calc(var(--base-size) * 2);
}

.grid-main-area .search {
  grid-area: search;
}

.grid-main-area .results {
  grid-area: results;
}
</style>
