<template>
  <div 
    class="image-block relative h-full flex flex-col"
    :class="{ '-mx-8': imageMobileFullWidth, 'cta-enabled': ctaEnabled }"
  >
    <div
      v-if="contentSettings.heading"
      class="image-block__heading"
    >
      <div
        class="tracking-wider"
        :class="[
          contentSettings['text-alignment-mobile'],
          `lg:${contentSettings['text-alignment']}`,
          contentSettings['heading-font-size-mobile'],
          `lg:${contentSettings['heading-font-size']}`,
          contentSettings['heading-fontweight']
        ]"
        :style="{ color: windowWidth > 768 ? contentSettings['heading-color'] : contentSettings['heading-color-mobile'] }"
      >
        {{ contentSettings.heading }}
      </div>
    </div>
    <wrapped-component
      :wrap="imageLink.length > 0"
      :data-obj="addClasses"
    >
      <template #wrapper>
        <a
          :href="imageLink"
          class="image-block__image image-block__link block h-full flex items-center"
          :class="`${imagePositionMobile} lg:${imagePosition}`"
        />
      </template>
      <div :class="{'w-full': imageFitMobile === 'stretch', 'w-auto': imageFitMobile === 'natural', 'lg:w-full': imageFit === 'stretch', 'lg:w-auto': imageFit === 'natural'}">
        <template v-if="lazyLoad">
          <v-lazy-image
            :src="imageUrl"
            :src-placeholder="createPlaceholderImage()"
            class="hidden lg:block object-cover"
            :class="{'w-full': imageFitMobile === 'stretch', 'w-auto': imageFitMobile === 'natural', 'lg:w-full': imageFit === 'stretch', 'lg:w-auto': imageFit === 'natural'}"
            :alt="`${imageAlt ? imageAlt : 'Image'}`"
            :intersection-options="intersectionOptions"
          />
          <v-lazy-image
            :src="imageUrlMobile"
            :src-placeholder="createPlaceholderImage()"
            class="block lg:hidden object-cover"
            :class="{'w-full': imageFitMobile === 'stretch', 'w-auto': imageFitMobile === 'natural', 'lg:w-full': imageFit === 'stretch', 'lg:w-auto': imageFit === 'natural'}"
            :alt="`${imageAlt ? imageAlt : 'Image Mobile'}`"
          />
        </template>
        <template v-else>
          <img
            :src="imageUrl"
            class="hidden lg:block object-cover"
            :class="{'w-full': imageFitMobile === 'stretch', 'w-auto': imageFitMobile === 'natural', 'lg:w-full': imageFit === 'stretch', 'lg:w-auto': imageFit === 'natural'}"
            :alt="`${imageAlt ? imageAlt : 'Image'}`"
          >
          <img
            :src="imageUrlMobile"
            class="block lg:hidden object-cover"
            :class="{'w-full': imageFitMobile === 'stretch', 'w-auto': imageFitMobile === 'natural', 'lg:w-full': imageFit === 'stretch', 'lg:w-auto': imageFit === 'natural'}"
            :alt="`${imageAlt ? imageAlt : 'Image Mobile'}`"
          >
        </template>
        <small
          v-if="imageCaption"
          class="medium-gray-stroke text-sm leading-9"
        >
          {{ imageCaption }}
        </small>
      </div>
    </wrapped-component>
    <div
      v-if="contentSettings.subheading"
      class="image-block__subheading py-2"
    >
      <div
        class="tracking-wider"
        :class="[
          contentSettings['text-alignment-mobile'],
          `lg:${contentSettings['text-alignment']}`,
          contentSettings['subheading-font-size-mobile'],
          `lg:${contentSettings['subheading-font-size']}`,
          contentSettings['subheading-fontweight']
        ]"
        :style="{ color: windowWidth > 768 ? contentSettings['subheading-color'] : contentSettings['subheading-color-mobile'] }"
      >
        {{ contentSettings.subheading }}
      </div>
    </div>
    <div
      v-if="contentSettings.content"
      class="image-block__text py-2"
    >
      <div
        class="tracking-wider"
        :class="[
          contentSettings['text-alignment-mobile'],
          `lg:${contentSettings['text-alignment']}`,
          contentSettings['content-font-size-mobile'],
          `lg:${contentSettings['content-font-size']}`,
          contentSettings['content-fontweight']
        ]"
        :style="{ color: windowWidth > 768 ? contentSettings['content-color'] : contentSettings['content-color-mobile'] }"
        v-html="contentSettings.content"
      />
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import WrappedComponent from '../../utilities/wrapped-component';

export default {
  name: "AtomImage",
  components: { WrappedComponent },
  props: {
    imageUrl: {
      type: String,
      required: false,
      default: ""
    },
    imageUrlMobile: {
      type: String,
      required: false,
      default: ""
    },
    imageLink: {
      type: String,
      required: false,
      default: ""
    },
    imageAlt: {
      type: String,
      required: false,
      default: "Image"
    },
    imageFit: {
      type: String,
      default: "stretch"
    },
    imageFitMobile: {
      type: String,
      default: "stretch"
    },
    imageMobileFullWidth: {
      type: Boolean,
      default: false
    },
    imagePosition: {
      type: String,
      default: "justify-center"
    },
    imagePositionMobile: {
      type: String,
      default: "justify-center"
    },
    imageCaption: {
      type: String,
      default: ""
    },
    sliderEnabled: {
      type: Boolean,
      default: false
    },
    sliderLoaded: {
      type: Boolean,
      default: false
    },
    contentSettings: {
      type: Object,
      default: () => {}
    },
    intersectionOptions: {
      type: Object,
      default: () => {
        return {
          "root": null,
          "rootMargin": "0px",
          "threshold": 0
        }
      }
    },
    lazyLoad: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      windowWidth: 'window-width/WindowWidth',
    }),
    addClasses: function () {
      return { class: { 'image-block__image': true, flex: true, [this.imagePositionMobile]: true, [`lg:${this.imagePosition}`]: true, 'items-center': true } };
    },
    ctaEnabled: function () {
      return Object.keys(this.contentSettings).length;
    }
  },
  methods: {
    createPlaceholderImage: function() {
      if(this.imageUrl) {
        let spilttedImage = this.imageUrl.split(".");
            spilttedImage[spilttedImage.length-2] = spilttedImage[spilttedImage.length-2] + "_100x";
        return spilttedImage.join('.');
      }
    },
    log: function (e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss" scoped>
  .cta-enabled {
    .image-block {
      &__heading { flex: 1 1 10% }
      &__image { flex: 1 1 60% }
      &__subheading { flex: 0 0 10% }
      &__text { flex: 0 0 20% }
    }
  }
</style>