export default {
  data: function () {
    return {
      timerExpired: {},
      timerPolling: {},
      timerStartDateTime: {},
      timerEndDateTime: {},
      currentTimerPolling: {},
      currentTimerTime: {}
    }
  },
  computed: {},
  beforeDestroy () {
    Object.keys( this.timerPolling ).forEach( timer => clearInterval( this.timerPolling[ timer ] ) );
    Object.keys( this.currentTimerPolling ).forEach( timer => clearInterval( this.currentTimerPolling[ timer ] ) );
  },
  created () {},
  mounted: function () {},
  methods: {
    setTimer: function ( label, startTime, endTime ) {
      this.$set( this.timerExpired, label, false );
      this.currentTimerTime[ label ] = Date.now() - ( new Date().getTimezoneOffset() * 60 * 1000 );
      this.timerEndDateTime[ label ] = new Date( endTime ).getTime() - ( new Date().getTimezoneOffset() * 60 * 1000 );
      this.currentTimerPolling[ label ] = setInterval( () => this.currentTimerTime[ label ] = Date.now() - ( new Date().getTimezoneOffset() * 60 * 1000), 1000 );
    },
    pollTimer: function ( label ) {
      if ( this.timerEndDateTime[ label ] && this.timerEndDateTime[ label ] - this.currentTimerTime > 0 ) {
        // Update the timer every second
        this.timerPolling[ label ] = setInterval(() => {
          // Find the distance between current timer time and target end time
          if ( ( this.timerEndDateTime[ label ] - this.currentTimerTime ) < 0 ) {
            clearInterval( this.timerPolling[ label ] );
            clearInterval( this.currentTimerPolling[ label ] );
            this.$set( this.timerExpired, label, true );
          }
        }, 1000);
      } else {
        clearInterval( this.timerPolling[ label ] );
        clearInterval( this.currentTimerPolling[ label ] );
        this.$set( this.timerExpired, label, true );
      }
    }
  }
}