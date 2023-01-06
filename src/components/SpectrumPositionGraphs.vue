<template>
  <section>
    <ol class="sanstream-no-list-styles">
      <li
        v-for="spectrumId in ordering"
        :key="spectrumId"
      >
        <h3
          class="sanstream-heading"
          :title="dataMappers[spectrumId].labelExplanation"
        >
          {{dataMappers[spectrumId].label}}
        </h3>
        <ol class="sanstream-no-list-styles spectrum">
          <li
            v-for="(step, index) in dataMappers[spectrumId].dataRange"
            class="spectrum-item"
            :key="`${spectrumId}-${index}`"
            :data-is-active="String(enhancedData[spectrumId].type === 'array' ? enhancedData[spectrumId].parsedData.includes(step) : false)"
          >
            <small class="sanstream-special-text">
              {{dataMappers[spectrumId].dataRangeLabels[index]}}
            </small>
          </li>
        </ol>
      </li>
    </ol>
  </section>
</template>

<script>
import VueTypes from 'vue-types'
import DataKraai from 'data-kraai'

/**
 * Data visualisation for showing multiple spectrums.
 * A person's LGBTQIA+ identity is mapped onto a data structure (see below)
 * and displayed as a visualisation.
 *
 * Please note that this component uses DataKraai to map data into itself.
 */
export default {
  name: 'SpectrumPositionGraphs',

  props: {
    ordering: VueTypes.arrayOf(VueTypes.string.isRequired).isRequired,
    dataMappers: VueTypes.objectOf(VueTypes.instanceOf(DataKraai).isRequired).isRequired,
    spectraData: VueTypes.object,
  },

  computed: {
    enhancedData () {
      const results = {}
      this.ordering.forEach(spectrumId => {
        const parsedData = this.dataMappers[spectrumId].getData(this.spectraData)
        results[spectrumId] = {
          type: Array.isArray(parsedData) ? 'array' : typeof parsedData,
          parsedData,
        }
      })
      return results
    },
  },
}
</script>

<style scoped>
ol.spectrum {
  display: flex;
  flex-wrap: no-wrap;
  gap: 0.25rem;
  flex-direction: row;
}
ol.spectrum > li.spectrum-item {
  display: block;
  max-width: 6rem;
  flex: 1 0 3rem;
  text-align: center;
}
ol.spectrum > li.spectrum-item:before {
  content: '';
  display: block;
  height: 0.5rem;
  background: var(--colour-light-grey-fill);
}

ol.spectrum > li.spectrum-item[data-is-active="true"]:nth-child(1):before {
  background: var(--colour-range-green);
}
ol.spectrum > li.spectrum-item[data-is-active="true"]:nth-child(2):before {
  background: #5cb518;
}
ol.spectrum > li.spectrum-item[data-is-active="true"]:nth-child(3):before {
  background: #18b548;
}
ol.spectrum > li.spectrum-item[data-is-active="true"]:nth-child(4):before {
  background: #18b59f;
}
ol.spectrum > li.spectrum-item[data-is-active="true"]:nth-child(5):before {
  background: #187cb5;
}

ol.spectrum > li.spectrum-item[data-is-applicable="false"]:before {
  background: var(--colour-range-red);
}
</style>
