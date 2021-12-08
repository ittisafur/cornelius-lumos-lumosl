import YouTubePlayer from 'youtube-player';
import Vimeo from '@vimeo/player';

export default {
  data: function () {
    return {
      playIcon: '<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 14.5L10.75 20.9952L10.75 8.00481L22 14.5Z" fill="#29302E"/><circle cx="14.5" cy="14.5" r="14" stroke="#29302E"/></svg>',
      pauseIcon: `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(7 7) scale(.03, .03)" fill="#29302E"><g><path d="M181.333,0H74.667c-17.643,0-32,14.357-32,32v448c0,17.643,14.357,32,32,32h106.667c17.643,0,32-14.357,32-32V32 C213.333,14.357,198.976,0,181.333,0z"/></g><g><path d="M437.333,0H330.667c-17.643,0-32,14.357-32,32v448c0,17.643,14.357,32,32,32h106.667c17.643,0,32-14.357,32-32V32 C469.333,14.357,454.976,0,437.333,0z"/></g></g><circle cx="14.5" cy="14.5" r="14" stroke="#29302E"/></svg>`,
      videoType: null,
      videoId: null,
      player: null,
      rewindTo: null,
      remains: null,
      currentState: 'no state',
      // playerSelector: null
    }
  },
  computed: {
    getIcon: function () {
      return this.currentState === 'playing' ? this.pauseIcon : this.currentState === 'paused' ? this.playIcon : null;
    },
    currentYTState: function () {
      let state = "no state";
      try {
        switch(this.player?.getPlayerState()) {
          case -1:
            state = "unstarted";
            break;
          case 0:
            state = "ended";
            break;
          case 1:
            state = "playing";
            break;
          case 2:
            state = "paused";
            break;
          case 3:
            state = "buffering";
            break;
          case 5:
            state = "video cued";
            break;
          default:
            state = "no state"
            break;
        }
      } catch (e) {
        return state;
      }
      return state;
    }
  },
  mounted: function () {
    // this.initPlayer();
  },
  watch: {
    currentYTState: function (after, before) {
      if (after !== before) {
        this.currentState = after;
      }
    },
  },
  methods: {
    initPlayer(settings={}) {
      if (this.videoType === 'youtube') {
        this.player = YouTubePlayer(this.playerSelector, {
          videoId: this.videoId,
          playerVars: {
            ...{ end: 0, playsinline: 1, autoplay: 1, mute: 1, loop: 1, controls: 0, showinfo: 0, modestbranding: 1, fs: 0, cc_load_policty: 0, iv_load_policy: 3, autohide: 0, playlist: this.videoId },
            ...settings
          }
        });
        this.player.on('ready', (e) => {
          this.player = e.target;
          if (settings?.autoplay === true) {
            this.player.mute();
            this.player.playVideo();
            this.seamlesslyLoop();
          }
        });
        this.player.on('stateChange', (e) => {
          this.player = e.target;
          // console.log('YT State Change!', e);
          //NOTE: to seamlessly loop the video:
          if(settings?.autoplay === true && e.data === 1) {
            this.seamlesslyLoop();
          }
        });
      } else if (this.videoType === 'vimeo') {
        this.player = new Vimeo(this.playerSelector, {
            ...{ id: this.videoId, loop: true, autoplay: true, controls: false, byline: false, muted: true, autopause: false },
            ...settings
          }
        );
        this.player.on('loaded', async () => {
          try {
            if (settings?.autoplay === true) this.player.play();
          } catch (e) {
            console.err(e);
          }
          await this.setCurrentState();
        });

        this.player.on('play', async () => {
          await this.setCurrentState();
        });

        this.player.on('playing', async () => {
          await this.setCurrentState();
        });

        this.player.on('pause', async () => {
          await this.setCurrentState();
        });
      }
    },
    seamlesslyLoop() {
      try {
        this.remains = this.player.getDuration() - this.player.getCurrentTime();
        if(this.rewindTo) clearTimeout(this.rewindTo);
        this.rewindTo = setTimeout(() => {
          this.player.seekTo(0);
        }, (this.remains - 0.1) * 1000);
      } catch (e) {
        console.log(e);
      }
    },
    async setCurrentState() {
      if (this.videoType === 'youtube') {
        this.currentState = this.currentYTState;
      } else if (this.videoType === 'vimeo') {
        this.currentState = await this.getCurrentVimeoState();
      }
    },
    async getCurrentVimeoState() {
      return await this.player.getPaused().catch(function(error) { console.error(error); }) ? 'paused' : 'playing';
    },
    async togglePlay() {
      switch(await this.currentState) {
        case "playing" :
          if (this.videoType === 'youtube') this.player.pauseVideo();
          if (this.videoType === 'vimeo') this.player.pause();
          break;
        case "paused" :
          if (this.videoType === 'youtube') this.player.playVideo();
          if (this.videoType === 'vimeo') this.player.play();
          break;
        default :
          break;
      }
    },
  }
}