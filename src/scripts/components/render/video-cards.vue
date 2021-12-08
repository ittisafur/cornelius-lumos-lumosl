<template>
  <div class="video-vue-cards-container">
    <div class="video-background">
      <div
        id="player"
      />
      <div class="video-overlay w-full h-full">
        <div class="container w-full h-full lg:w-10/12 px-0 flex flex-col justify-evenly relative">
          <div
            class="text-4xl sm:text-7xl p-4 lg:p-8 text-center"
            :style="`color: ${ fontColor }`"
          >
            {{ heading }}
          </div>
          <div :class="`grid grid-cols-2 lg:grid-cols-${ cards.length } items-start justify-items-center cards`">
            <div
              v-for="(card, i) in cards"
              :key="i"
              class="p-4 md:p-8 lg:p-16 flex flex-col card items-center justify-items-center"
            >
              <div class="card-content lg:w-full">
                <v-lazy-image
                  :src="card.image"
                  class="object-cover w-5/12 mx-auto lg:w-3/4"
                />
                <div
                  class="text-2xl lg:text-4xl p-2 lg:p-4 text-center"
                  :style="`color: ${ fontColor }`"
                >
                  {{ card.label }}
                </div>
                <div
                  class="text-2xl lg:text-4xl p-2 lg:p-4 text-center"
                  :style="`color: ${ fontColor }`"
                >
                  <a
                    v-if="card.linkUrl"
                    :href="card.linkUrl"
                  >{{ card.linkTitle }}</a>
                  <a
                    v-else
                    class="cursor-pointer"
                    @click.prevent="setModalIdx(i); triggerModal({ component: false, data: {} });"
                  >
                    {{ card.linkTitle }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      v-if="showModal"
      @close="hide"
    >
      <h3 slot="header">
        Header
      </h3>
      <div
        slot="body"
        class="block text-4xl font-medium text-gray-700"
        v-html="cards[currentModalIdx].modalContent"
      />
    </modal>
  </div>
</template>

<script>
import YouTubePlayer from 'youtube-player';
import Vimeo from '@vimeo/player';
import modal from './modal';
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "VideoCards",
  components: { modal },
  props: {
    fontColor: { type: String, default: "" },
    videoType: { type: String, default: "" },
    videoId: { type: String, default: "" },
    cards: { type: Array, default: () => [] },
    heading: { type: String, default: "" }
  },
  data: function () {
    return {
      player: null,
      rewindTo: null,
      remains: null,
      currentModalIdx: 0
    }
  },
  computed: {
    ...mapGetters({
      showModal: 'modal/showModal'
    }),
  },
  mounted: function () {
    this.initPlayer();
  },
  methods: {
    ...mapActions({
      hide: 'modal/hide',
      triggerModal: 'modal/trigger'
    }),
    setModalIdx(i) {
      this.currentModalIdx = i;
    },
    initPlayer() {
      if (this.videoType === 'youtube') {
        this.player = YouTubePlayer('player', {
          videoId: this.videoId,
          playerVars: {
            end: 0, playsinline: 1, autoplay: 1, mute: 1, loop: 1, controls: 0, showinfo: 0, modestbranding: 1, fs: 0, cc_load_policty: 0, iv_load_policy: 3, autohide: 0, playlist: this.videoId
          }
        });
        this.player.on('ready', (e) => {
          this.player = e.target;
          this.player.mute();
          this.player.playVideo();
          this.seamlesslyLoop();
        });
        this.player.on('stateChange', (e) => {
          this.player = e.target;
          // console.log('YT State Change!', e);
          //NOTE: to seamlessly loop the video:
          if(e.data === 1) {
            this.seamlesslyLoop();
          }
        });
      } else if (this.videoType === 'vimeo') {
        this.player = new Vimeo.Player('player', {
          id: this.videoId, loop: true, autoplay: true, controls: false, byline: false, muted: true
        });
        this.player.on('loaded', () => {
          this.player.play();
        });
      }
    },
    seamlesslyLoop() {
      this.remains = this.player.getDuration() - this.player.getCurrentTime();
      if(this.rewindTo) clearTimeout(this.rewindTo);
      this.rewindTo = setTimeout(() => {
        this.player.seekTo(0);
      }, (this.remains - 0.1) * 1000);
    }
  }
}
</script>

<style lang="scss">
  .video-vue-cards-container {
    padding-top: 4rem;
    padding-bottom: 4rem;

    @media screen and (max-width: 1023px) {
      padding-top: calc(56.25% / 2);
      padding-bottom: calc(56.25% / 2);
    }

    .video-background {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;

      @media screen and (max-width: 1023px) {
        padding-bottom: calc(56.25% * 2 - 3px);
      }

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
          background: rgba(0, 0, 0, .3);
          z-index: -1;
        }

        .container {
          .cards {
            margin: 0;
            .card {
              transform: none;
              opacity: 1;
              float: none;
            }
          }
        }
      }

      iframe {
        position: absolute;
        top: -50%;
        left: 0;
        width: 100%;
        height: calc(100% * 2);

        @media screen and (max-width: 1023px) {
          transform: scale(2);
        }
      }
    } 
  }
</style>