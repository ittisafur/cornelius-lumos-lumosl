<template>
  <div
    class="navigationPlaceholder"
    :style="{ 'height': `${placeholderHeight}px` }"
  />
</template>
<script>
export default {
  name: "NavigationPlaceholder",
  data: function () {
    return {
      placeholderHeight: 0
    }
  },
  mounted() {
    this.matchHeaderHeight();
  },
  created () {
    window.addEventListener('scroll', this.stickHeader);
    window.addEventListener('resize', this.matchHeaderHeight);
  },
  destroyed () {
    window.removeEventListener('scroll', this.stickHeader);
    window.removeEventListener('resize', this.matchHeaderHeight);
  },  
  methods: {
    matchHeaderHeight: function(){
      let height = document.getElementById('header').clientHeight;
      this.placeholderHeight = height;
    },
    stickHeader: function(){
      let header = window.document.getElementById('header');
      if(window.pageYOffset > 0 || document.body.style.overflow === 'hidden'){
        header.classList.add('header--sticky');
      }else{
        header.classList.remove('header--sticky');        
      }
    }
  }
}
</script>


