<template>
  <div
    ref="htmlBlock"
    :class="`html-block h-full w-full flex ${horizontalAlignment} ${verticalAlignment}`"
  >
    <slot :name="`html-${index}`" />
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
export default {
  name: "AtomHtml",
  props: {
    html: {
      type: String,
      required: false,
      default: ""
    },
    horizontalAlignment: {
      type: String,
      default: "justify-center"
    },
    verticalAlignment: {
      type: String,
      default: "items-center"
    },
    index: {
      type: Number,
      default: 0
    },
    sliderEnabled: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapGetters({
      windowWidth: 'window-width/WindowWidth',
    }),
  },
  mounted: function () {
    if (this.$refs.htmlBlock.querySelector('#tooth-layers-section')) this.initToothLayerSection();
  },
  methods: {
    initToothLayerSection: function () {
      const section = this.$refs.htmlBlock.querySelector('#tooth-layers-section');
      if (this.windowWidth < 1024) {
        Array.from(section.querySelectorAll('li')).forEach(t => t.addEventListener('click', e => {
          Array.from(section.querySelectorAll('li')).forEach(li => li.classList.remove('is-active'));
          const target = e.target.closest('li');
          target.classList.add('is-active');

          this.setUlHeight(target);
          this.setPulse(section, target.dataset?.layer);
        }));
      } else {
        Array.from(section.querySelectorAll('li')).forEach(t => t.addEventListener('mouseover', e => {
          Array.from(section.querySelectorAll('li')).forEach(li => li.classList.remove('is-active'));
          const target = e.target.closest('li');
          target.classList.add('is-active');

          this.setPulse(section, target.dataset?.layer);
        }));
      }

      // set initial tab as active:
      section.querySelectorAll('li')[0].classList.add('is-active');
      this.setPulse(section, 'enamel');
      if (this.windowWidth < 1024) {
        this.setUlHeight(section.querySelectorAll('li')[0]);
      }
    },
    setUlHeight: function (target) {
      const ul = target.closest('ul');
      const div = target.querySelector('div');
      const height = `calc(${div.offsetHeight}px + 1rem)`;
      ul.style.marginBottom = height;
    },
    setPulse: function (section, layer) {
      // remove pulse:
      if (section.querySelector('#pulse')) section.querySelector('#pulse').remove();

      // create pulse:
      const pulse = document.createElement("div");
      pulse.setAttribute('id', 'pulse');
      pulse.classList.add('pulse');
      pulse.classList.add('absolute');

      switch (layer) {
        case 'enamel' :
          pulse.style.top = '16%';
          pulse.style.left = '60%';
          break;
        case 'dentin' :
          pulse.style.top = '30%';
          pulse.style.left = '63.5%';
          break;
        case 'nerve' :
          pulse.style.top = '44.5%';
          pulse.style.left = '55%';
          break;
      }
      section.querySelector('#layers').append(pulse);
    }
  }
}
</script>

<style lang="scss">
  $color-primary: #BFFAEA;
  $color-secondary: #F0F8F6;
  $mint: #BFFAEA;
  $pale-mint: #F0F8F6;
  $sage: #7DADA0;
  $dark-green: #21493E;
  $blue: #3991F2;
  $black: #29302E;
  $white: #FFFFFF;
  $color-success: #189D3D;
  $color-error: #CE0000;
  $mobile: 767px;
  $desktop: 1023px;

  #tooth-layers-section {
    ul {
      @media screen and (max-width: $desktop) {
        li {
          div { display: none; }

          &.is-active {
            color: $dark-green;
            border-bottom: 2px solid $dark-green;
            margin-bottom: -2px;

            div {
              display: block;
            }
          }
        } 
      }
    }
  }
</style>