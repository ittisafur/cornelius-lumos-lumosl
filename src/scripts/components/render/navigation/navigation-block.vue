<template>
  <ul
    ref="nav"
    :class="{
      'navigationBlock': true,
      [`navigationBlock--${ expanded ? 'open' : 'closed' }`]: true,
      'flex': !megamenu,
      'justify-evenly': !megamenu,
    }"
  >
    <li
      v-for="(link, index) in linkList"
      :key="link.index"
      ref="navigationLevel"
      class="w-full md:w-auto"
      :class="[
        `navigationBlock__single`,
        `navigationBlock__tier--${link.tier}`,
        `navigationBlock__single--${link.title.replace(' ', '-').toLowerCase()}`,
        `navigationBlock__single--${link.has_children ? 'has_children' : 'no_children'}`,
        `navigationBlock__single--${ link.is_card ? 'card' : 'notCard' }`,
        `${ link.title == 'Break Line' ? 'navigationBlock__single--spacer' : ''}`
      ]"
      :style="{ flex: windowWidth <= BREAKPOINTS.lg && windowWidth >= BREAKPOINTS.md ? `calc(100%/${ linkList.length } - 8%)` : undefined }"
    >
      <div
        v-if="link.title != 'Break Line'"
        :class="[
          `navigationBlock__link navigationBlock__link--${ index }`
        ]"
        @click="toggleSubnavigation(index)"
      >
        <navigation-link
          :link="link"
          :files-url="filesUrl"
          :num-links="linkList.length"
        />

        <button
          v-if="link.levels"
          :class="[
            'navigationBlock__toggle',
            `navigationBlock__toggle--${ levelExpanded[index] ? 'open' : 'close'}`
          ]"
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1L7 7L1 1"
              stroke="#343436"
              stroke-width="1.25"
            />
          </svg>
        </button>
      </div>
      <navigation-block
        v-if="link.levels && link.megamenu == false"
        :key="link.index"
        :link-list="link.links"
        :expanded="levelExpanded[index]"
        :files-url="filesUrl"
      />
      <div
        v-if="link.levels && link.megamenu == true"
        class="navigationBlock__megamenu"
      >
        <div class="navigationBlock__megamenuWrapper">
          <navigation-block
            v-if="link.levels"
            :link-list="link.links"
            :expanded="levelExpanded[index]"
            :files-url="filesUrl"
          />
        </div>
      </div>
    </li>
  </ul>
</template>
<script>

import { mapGetters } from "vuex";
import navigationLink from './navigation-link.vue';

export default {
  name: "NavigationBlock",
  components: { navigationLink },
  props:{
    linkList: {
      type: Array,
      required: true
    },
    megamenu: {
      type: Boolean, 
      required: false,
      default: false
    },
    expanded: {
      type: Boolean, 
      required: false,
      default: true
    }
  },
  data: function () {
    return {
      levelExpanded: [],
      top: 95
    }
  },
  computed: {
    ...mapGetters({
      windowWidth: "window-width/WindowWidth",
    })
  },
  beforeMount () {
    this.top = document.getElementById('header') ? document.getElementById('header').offsetHeight : 95;
  },
  mounted () {
    if (this.$refs.nav.closest('#mobileNavigation')) this.$refs.nav.closest('#mobileNavigation').style.top = `${this.top}px`;
    for(let linkIndex = 0; linkIndex < this.linkList.length; linkIndex++ ){
      this.$set(this.levelExpanded, linkIndex, false);
    }
  },
  methods: {
    toggleSubnavigation(_index){
      if(this.levelExpanded[_index] == true ){
        this.$set(this.levelExpanded, _index, false);
      }else{
        this.$set(this.levelExpanded, _index, true);
      }      
    }
  }
}
</script>
