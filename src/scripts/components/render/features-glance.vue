<template>
  <ul class="features-glance">
    <li
      v-for="(feature, index) in filtered"
      :key="index"
      class="feature"
      :class="{ price__match__badge: feature.tag === 'pp-plus5' }"
      @click="openModal(feature)"
    >
      <rs-sprite-icon
        :glyph="feature.glyph"
        class="features-icon"
        width="20px"
        height="20px"
      />
      <span
        class="label-text"
        v-text="feature.title"
      />
    </li>
    <div
      class="modal__overlay"
      :class="{ show: priceMatchModal }"
      @click="closeModal()"
    />
    <div
      class="price__match__modal shopify-content"
      :class="{ show: priceMatchModal }"
    >
      <div
        class="close__modal"
        @click="closeModal()"
      />
      <h1>J.L. Hufford Price Match Policy</h1>
      <div class="content">
        <h3 class="p1">
          If We Can Match or Beat a Price, We Will
        </h3>
        <p class="p1">
          Our team at J.L. Hufford works hard to bring you the best products at competitive prices. If you find a lower price, please call, chat, or email us, or use the form below to let us know, and we will do our best to match or beat that price.
        </p>
        <h3 class="p1">
          Exclusions
        </h3>
        <p class="p1">
          While the&nbsp;J.L. Hufford Price Match Policy does not apply to auctions and unauthorized sellers, please reach out to us if you find such an offer, so we can give you our best deal.
        </p>
        <p class="p1">
          **Please note: Price Match requests that are granted before purchase are valid for 3 calendar days from the date we respond.
        </p>
        <p>&nbsp;</p>
        <p>
          <a
            href="/pages/lowest-price-guarantee"
            class="button-main-big"
          >Click Here for Price Policy Form</a>
        </p>
      </div>
    </div>
  </ul>
</template>

<script>
    export default {
        name: 'FeaturesGlance',
        props: { tags: { type: Array, default: () => [] } },
        data: function () {
            return {
                features : [
                    {
                        tag: "pp-residential",
                        glyph: "pp-residential",
                        title: "Residential Use"
                    },
                    {
                        tag: "pp-commercial",
                        glyph: "pp-commercial",
                        title: "Commercial Use"
                    },
                    {
                        tag: "pp-1yrwarranty",
                        glyph: "pp-1yrwarranty",
                        title: "1 Year Warranty"
                    },
                    {
                        tag: "pp-2yrwarranty",
                        glyph: "pp-2yrwarranty",
                        title: "2 Year Warranty"
                    },
                    {
                        tag: "pp-3yrwarranty",
                        glyph: "pp-3yrwarranty",
                        title: "3 Year Warranty"
                    },
                    {
                        tag: "pp-5yrwarranty",
                        glyph: "pp-5yrwarranty",
                        title: "5 Year Warranty"
                    },
                    {
                        tag: "pp-7yrwarranty",
                        glyph: "pp-7yrwarranty",
                        title: "7 Year Warranty"
                    },
                    {
                        tag: "pp-8yrwarranty",
                        glyph: "pp-8yrwarranty",
                        title: "8 Year Warranty"
                    },
                    {
                        tag: "pp-10yrwarranty",
                        glyph: "pp-10yrwarranty",
                        title: "10 Year Warranty"
                    },
                    {
                        tag: "pp-lifetimewarranty",
                        glyph: "pp-lifetimewarranty",
                        title: "Lifetime Warranty"
                    },
                    {
                        tag: "pp-free2daydelivery",
                        glyph: "pp-free2daydelivery",
                        title: "Free 2 Day Delivery"
                    },
                    {
                        tag: "pp-plus5",
                        glyph: "pp-plus5",
                        title: "Price Match Policy"
                    },
                    {
                        tag: "pp-usa",
                        glyph: "pp-usa",
                        title: "Made in the USA"
                    },
                    {
                        tag: "pp-solingen",
                        glyph: "pp-solingen",
                        title: "Made in Solingen, Germany"
                    },
                    {
                        tag: "pp-germany",
                        glyph: "pp-germany",
                        title: "Made in Germany"
                    },
                    {
                        tag: "pp-japan",
                        glyph: "pp-japan",
                        title: "Made in Japan"
                    },
                    {
                        tag: "pp-spain",
                        glyph: "pp-spain",
                        title: "Made in Spain"
                    },
                    {
                        tag: "pp-italy",
                        glyph: "pp-italy",
                        title: "Made in Italy"
                    },
                    {
                        tag: "pp-swiss",
                        glyph: "pp-swiss",
                        title: "Made in Switzerland"
                    },
                    {
                        tag: "pp-england",
                        glyph: "pp-england",
                        title: "Made in England"
                    },
                    {
                        tag: "pp-france",
                        glyph: "pp-france",
                        title: "Made in France"
                    },
                    {
                        tag: "pp-southkorea",
                        glyph: "pp-southkorea",
                        title: "Made in South Korea"
                    },
                ],
                priceMatchModal: false
            }
        },
        computed: {
            filtered: function () {
                return this.features.filter( f => this.tags.indexOf(f.tag) > -1 );
            }
        },
        methods: {
            openModal: function ( badge ) {
                if ( badge.tag === "pp-plus5" ) this.priceMatchModal = true;
            },
            closeModal: function () {
                this.priceMatchModal = false;
            }
        }
    }
</script>

<style lang='scss' scoped>
$color-primary: #c08f73;
$color-secondary: #eceaeb;
$mobile: 767px;
$tablet: 1024px;
$desktop: 1230px;

.features-glance {
  position: relative;
  columns: 2;

  .feature {
    display: flex;
    display: inline-flex;

    .label-text {
      margin-left: 1rem;
    }

    &.price__match__badge {
        cursor: pointer;
    }
  }

  .price__match__modal {
      display: none;

      &.show {
        display: block!important;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50vw;
        height: 50vh;
        background: #FFF;
        border: 1px solid $color-secondary;
        box-shadow: 0 0 5px rgba(0,0,0,0.15);
        padding: 2em;
        z-index: 1001;

        @media (max-width:$mobile) {
            width: 90vw;
            height: 90vh;

            .button-main-big {
                padding: 19px 15px!important;
                text-decoration: none!important;
            }
        }

        @media (min-width:$mobile) and (max-width:$tablet) {
            width: 90vw;
            height: 65vh;
        }

        @media (min-width:$tablet) and (max-width:$desktop) {
            width: 80vw;
            height: 50vh;
        }

        .close__modal {
            position: absolute;
            top: 0;
            right: 10px;
            cursor: pointer;

            &:after {
                content: '\00D7';
                font-size: 2em;
                font-weight: bold;
                color: #000;
            }
        }
      }
  }

  .modal__overlay {
      display: none;

      &.show {
        cursor: pointer;
        content: '';
        display: block;
        position: fixed;
        height: 100vh;
        width: 100vw;
        background: rgba( 0, 0, 0, .2 );
        top: 0;
        left: 0;
        z-index: 1000;
      }
  }
}
</style>
