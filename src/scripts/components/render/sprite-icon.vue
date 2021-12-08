<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :aria-labelledby="iconName"
    :x="x"
    :y="y"
    :class="className"
    :fill="iconColor"
    role="presentation"
  >
    <title
      lang="en"
    >{{ iconName }} icon</title>
    <use :href="`#icon--${glyph}`" />
  </svg>
</template>

<script>
  export default {
    name: 'SpriteIcon',
    props: {
      className: {
          type: String,
          default: 'icon'
      },
      glyph: {
          type: String,
          default: null
      },
      iconName: {
        type: String,
        default: "Interface Icon"
      },
      width: {
        type: [Number, String],
        default: "48px"
      },
      height: {
        type: [Number, String],
        default: "48px"
      },
      viewBox: {
        type: [Number, String],
        default: null
      },
      iconColor: {
        type: String,
        default: 'currentColor'
      },
      x: {
        type: String,
        default: null
      },
      y: {
        type: String,
        default: null
      }
    }
  }
</script>
