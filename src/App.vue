<template>
  <div class="sanstream-grid-layout-full-viewport">
    <header
      class="sanstream-fluid-layout"
    >
      <h1 class="sanstream-heading">A LGBTQIA+ Identity Explainer
        <br/>
        <OwnershipTag
          :yearOfCreation="2020"
        />
      </h1>
    </header>
    <main
      class="sanstream-fluid-layout horizontal-section-spacing"
    >
      <header
        class="search"
      >
        <SearchBox
          buttonLabel="Explain"
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
      <aside>
        <h2 class="sanstream-heading">Motivation</h2>
        <StandardParagraph>
          Even as a member of the LGBTQIA+ community I sometimes
          struggle with a sheer amount and complexity surrounding
          the terminology of identities. In order to understand them better
          I dove into this subject deeper.
          Through this I discovered it was far more complicated than I thought.
          This also explained to me why this subject can be so hard
          to explain to someone completely unfamiliar with.
        </StandardParagraph>
        <StandardParagraph>
          Being an data-visualisation nerd (another identity 😉),
          I thought it be worthwhile to create something that helped explaining easier.
          This app is an attempt at that.
        </StandardParagraph>

        <h2 class="sanstream-heading">Noticed a mistake?</h2>

        <StandardParagraph>
          Do you see something that is worded strangely? Do you think the results make no sense?
          Great! The good news is that
          <StandardLink href="https://github.com/sanstream/that-lgbtiqa-plus-explainer">
            this app is open source
          </StandardLink>,
          and you can
          <StandardLink
            href="https://github.com/sanstream/that-lgbtiqa-plus-explainer/issues/new"
          >
            open a ticket
          </StandardLink>
          for it. If you are feeling really
          pro-active you can even improve it yourself and provide
          it back to me as a pull request. This will however require you to
          do a little bit of coding and understand how pull requests work. Github wrote
          <StandardLink
            href="https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests"
          >
            a very good article
          </StandardLink>
          about that.
        </StandardParagraph>
      </aside>
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
  genderIdentity: new DataKraai({
    label: 'Gender identity',
    labelExplanation: 'Gender identity is a person mental experience of their gender.',
    mapper: d => d.ratings.genderIdentity,
    dataRange: [ -2, -1, 0, 1, 2 ],
    dataRangeLabels: [ 'man', null, null, null, 'woman' ],
  }),
  bioSex: new DataKraai({
    label: 'Biological sex',
    labelExplanation: `
The biological sex is the sex person is born with.
This is a spectrum, because a person sex can lie between male
and female. This is commonly refered to as being intersex.
Please note that a person's sex can change too. This is
called being transgender.`,
    mapper: d => d.ratings.biologicalSex,
    dataRange: [ -2, -1, 0, 1, 2 ],
    dataRangeLabels: [ 'man', null, null, null, 'woman' ],
  }),
  transition: new DataKraai({
    label: 'Gender transition',
    labelExplanation: `
Gender transition is the proces of changing of one side of
the biological sex spectrum to the other.`,
    mapper: d => d.ratings.genderTransition,
    dataRange: [ 4, 3, 2, 1, 0 ],
    dataRangeLabels: [ 'fully (trans)', null, null, null, 'none (cis)' ],
  }),
  sexualAttraction: new DataKraai({
    label: 'Sexually attracted to',
    labelExplanation: `
Sexual attraction refers purely to what a person can be sexually attracted to.
This can be different from what type of person someone is romantically attracted to.`,
    mapper: d => d.ratings.sexuallyAttractedTo,
    dataRange: [ -2, -1, 0, 1, 2 ],
    dataRangeLabels: [ 'men', null, null, null, 'women' ],
  }),
  romanticAttraction: new DataKraai({
    label: 'Romantically attracted to',
    labelExplanation: `
Romantic attraction refers purely to what a person can be romantic attracted to.
This can be different from what type of person someone is sexually attracted to.`,
    mapper: d => d.ratings.romanticallyAttractedTo,
    dataRange: [ -2, -1, 0, 1, 2 ],
    dataRangeLabels: [ 'men', null, null, null, 'women' ],
  }),
  description: new DataKraai({
    mapper: d => d.description,
  }),
}

class Spectra {
  constructor ({ ratings, description }) {
    this.ratings = {
      genderIdentity: [],
      biologicalSex: [],
      genderTransition: [],
      sexuallyAttractedTo: [],
      romanticallyAttractedTo: [],
    }
    if (ratings) {
      const { genderTransition, genderIdentity, sexuallyAttractedTo, romanticallyAttractedTo, biologicalSex } = ratings
      this.ratings = {
        genderIdentity: Array.isArray(genderIdentity) ? [ ...genderIdentity ] : [],
        biologicalSex: Array.isArray(biologicalSex) ? [ ...biologicalSex ] : [],
        genderTransition: Array.isArray(genderTransition) ? [ ...genderTransition ] : [],
        sexuallyAttractedTo: Array.isArray(sexuallyAttractedTo) ? [ ...sexuallyAttractedTo ] : [],
        romanticallyAttractedTo: Array.isArray(romanticallyAttractedTo) ? [ ...romanticallyAttractedTo ] : [],
      }
    }

    this.description = description || ''
  }
}

const emptySpectraData = new Spectra({
  description: 'No identity applied...',
})

const suggestions = Object.keys(lgbtTerms).map(term => {
  return new Suggestion({
    label: term,
    value: term,
  })
})

const mappedLgbtTerms = new Map()

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
    onRouteUpdate (route) {
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
        },
      })
    },

    getTermsData () {
      if (this.appliedSearchTerms.length) {
        const explanations = this.appliedSearchTerms.map((term) => {
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
                ratings[identity] = [ ...previousExpl.ratings[identity], ...currentExpl.ratings[identity] ]
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
      } else return emptySpectraData
    },
  },
}
</script>

<style>
.horizontal-section-spacing > * {
  margin-bottom: 4rem;
}
</style>
