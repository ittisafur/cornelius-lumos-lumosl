<template>
  <section
    id="notification"
    :class="{show: visability, [type]: type}"
  >
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="notification-content text-center">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'Notification',
    computed: {
      ...mapState({
        message: state => state['notifications'].notification.message,
        timeout: state => state['notifications'].notification.timeout,
        type: state => state['notifications'].notification.type,
        visability: state => state['notifications'].notification.visability
      }),
    },
    watch: {
      visability: function ( after, before ) {
        if( after !== before && this.visability === true ) {
          setTimeout(() => {
            this.showNotification({
              visability: false
            })
            setTimeout(() => {
              this.setNotification({
                message: "",
                type: ""
              })
            }, 300)  // <= css transition duration
          }, this.timeout)
        }
      }
    },
    methods: {
      ...mapMutations({
        showNotification: 'notifications/showNotification',
        setNotification: 'notifications/setNotification'
      }),
    }
  }
</script>

<style lang="scss" scoped>
  #notification {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    right: 0;
    background: #28a745;
    color: #0A233C;
    text-align: center;
    line-height: 2.5;
    overflow: hidden;
    -webkit-box-shadow: 0 0 5px black;
    -moz-box-shadow: 0 0 5px black;
    box-shadow: 0 0 5px black;
    transform: translateY(-100%);
    transition: transform .3s ease-in-out;

    &:before {
      content: ' ';
      visibility: hidden;
    }

    &.success {
      background: #28a745;
      color: #0A233C;
    }

    &.error {
      background: #dc3545;
      color: #FFF;
    }

    &.warn {
      background: #ffc107;
      color: #FFF;
    }

    &.show {
      transform: translateY(0%);
    }
  }
</style>