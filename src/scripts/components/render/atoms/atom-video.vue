<template>
  <div 
    :class="`video-block relative ${objectFit} ${sliderEnabled ? 'slider' : ''} flex flex-col`"
  >
    <div
      v-if="contentSettings.heading"
      class="image-block__heading py-2"
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
    <video
      v-if="videoUrl"
      ref="video"
      playsinline
      muted
      :loop="videoLoops"
      class=""
    >
      <source
        :src="videoUrl"
        type="video/mp4"
      >
    </video>
    <div class="video-background flex justify-center items-center">
      <div
        :id="playerSelector"
        ref="player"
        class="block-player"
        :class="{[videoType]: true}"
      />
      <div class="video-overlay">
        <button
          class="p-2 flex justify-between items-center whitespace-nowrap"
          @click="togglePlay()"
        >
          <span v-html="getIcon" />
          <transition>
            <span
              v-if="currentState === 'paused'"
              class="ml-2"
            >
              Play the Film
            </span>
          </transition>
        </button>
      </div>
    </div>
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
import video from '../../../mixins/video';
export default {
  name: "AtomVideo",
  mixins: [ video ],
  props: {
    shopUrl: {
      type: String,
      default: ""
    },
    videoSettings: {
      type: Object,
      required: true,
      default: () => {}
    },
    videoUrl: {
      type: String,
      default: ""
    },
    videoLoops: {
      type: Boolean,
      default: false
    },
    objectFit: {
      type: String,
      default: "contain"
    },
    sliderEnabled: {
      type: Boolean,
      default: false
    },
    sliderLoaded: {
      type: Boolean,
      default: false
    },
    sectionId: {
      type: String,
      default: ""
    },
    blockIndex: {
      type: Number,
      default: 0
    },
    sectionIndex: {
      type: Number,
      default: 0
    },
    contentSettings: {
      type: Object,
      default: () => {}
    }
  },
  data: function () {
    return {}
  },
  computed: {
    ...mapGetters({
      windowWidth: 'window-width/WindowWidth',
    }),
    playerSelector: function () {
      return `block-player-${this.sectionId}-${this.sectionIndex}-${this.blockIndex}`;
    }
  },
  beforeMount: function () {
    this.videoType = this.videoSettings.type;
    this.videoId = this.videoSettings.id;
  },
  mounted: async function () {
    if (!this.sliderEnabled) {
      await this.$nextTick();
      this.initPlayer({ origin: this.shopUrl, host: `https://www.${this.videoType}.com`, autoplay: true });
    } else {
      const pollRef = setInterval(async () => {
        if (this.$refs?.player && this.$refs?.player.closest('.slick-cloned') === null) {
          await this.$nextTick();
          this.initPlayer({ origin: this.shopUrl, host: `https://www.${this.videoType}.com`, autoplay: true });
          clearInterval(pollRef);
        }
      }, 100)
    }
  },
  methods: {}
}
</script>

<style lang="scss">
  .width-enter-active, .width-leave-active {
    transition: opacity .1s ease-in-out, width .3s ease-in-out;
    opacity: 1;
    visibility: visible;
    width: auto;
  }
  .width-enter, .width-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    visibility: hidden;
    width: 0;
  }

  .video-block {
    // padding-top: 4rem;
    // padding-bottom: 4rem;

    &.slider {
      top: 50%;
      transform: translateY(-50%);
    }

    &.cover {
      padding-top: calc(56.25% / 2);
      padding-bottom: calc(56.25% / 2);

      .video-background {
        padding-bottom: calc(56.25% * 2);

        .block-player:not(.vimeo), .block-player.vimeo iframe {
          transform: scale(2);
        }
      }
    }

    .video-background {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;

      .video-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &:after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          // background: rgba(0, 0, 0, .3);
          z-index: -1;
        }


        button {
          background: #BFFAEA;
          color: #000;
          border-radius: 50px;
        }
      }

      .block-player:not(.vimeo), .block-player.vimeo iframe {
        position: absolute;
        top: -50%;
        left: 0;
        width: 100%;
        height: calc(100% * 2);
      }
    }
  }
</style>