
<template>
  <div class="social-share flex items-center justify-center">
    <h3 class="title sage-stroke">
      {{ title }}
    </h3>
    <ul
      class="flex flex-1 justify-evenly"
      aria-label="Social Share Links"
    >
      <li
        v-for="(icon, index) in icons"
        :key="index"
      >
        <a
          :href="icon.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <sprite-icon
            :icon-name="icon.name"
            :glyph="icon.glyph"
            class="social-icon sage-stroke"
            :width="icon.width"
            :height="icon.height"
          />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import SpriteIcon from './sprite-icon.vue';

export default {
    components: {
      'sprite-icon': SpriteIcon
    },
    props: { shareTitle: { type: String, default: "" }, shopUrl: { type: String, default: "" }, sharePermalink: { type: String , default: "" }, shareImage: { type: String, default: "" }, shareDescription: { type: String, default: "" } },
    data: function () {
      return {
        title: 'Share',
        icons: [
          {
            glyph:'social-facebook',
            url: this.getFacebook(),
            width: '20px',
            height: '20px',
            name: 'Facebook'
          },
          {
            glyph:'social-instagram',
            url: this.getInstagram(),
            width: '20px',
            height: '20px',
            name: 'Instagram'
          },
          // {
          //   glyph:'social-twitter',
          //   url: this.getTwitter(),
          //   width: '25px',
          //   height: '20px',
          //   name: 'Twitter'
          // },
          // {
          //   glyph:'social-pinterest',
          //   url: this.getPinterest(),
          //   width: '16px',
          //   height: '20px',
          //   name: 'Pinterest'
          // }
        ]
      }
    },
    methods: {
      getFacebook() {
        return `//www.facebook.com/sharer.php?u=${this.shopUrl}${this.sharePermalink}`;
      },
      getTwitter() {
        return `//twitter.com/share?text=${this.shareTitle}&url=${this.shopUrl}${this.sharePermalink}`;
      },
      getPinterest() {
        return `//pinterest.com/pin/create/button/?url=${this.shopUrl}${this.sharePermalink}&media=${this.shareImage}&description=${this.shareDescription}`;
      },
      getInstagram() {
        return `//www.instagram.com/hellolumossmile/?src=${this.shopUrl}${this.sharePermalink}`;
      },
    },
}
</script>

<style lang="scss" scoped>
// @import "../../../scss/base/colors";
// @import "../../../scss/base/variables";
// $color: $color-cameo;

// .social-share {
//   display: flex;
//   align-items: center;
//   padding: 26px 0;
// }

// .title {
//   color: $color;
//   font-size: 16px;
//   font-weight: 600;
//   text-transform: uppercase;
//   flex: calc(30% - 1em);
// }

// ul {
//   display: flex;
//   justify-content: flex-start;
//   justify-items: center;
//   list-style: none;
//   margin: 0 0 0 16px;
//   padding: 0;
//   flex: 70%;

//   li {
//     color: $color;
//     height: 20px;

//     & + li {
//       margin-left: 20%;
//     }

//     a {
//       display: inline-block;
//       line-height: 0;
//     }
//   }

//   @media (max-width: $mobile) {
//     justify-content: space-around;

//     li {
//       & + li {
//         margin-left: unset;
//       }
//     }
//   }
// }
</style>
