<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'app-global-loader',
    data () {
      return {
        showLoading: true
      }
    },
    computed: {
      ...mapGetters(['isLoading', 'loadingMessage']),
      loading: function () {
        return this.isLoading
      }
    },
    watch: {
      loading: function (newValue, oldValue) {
        this.showLoading = oldValue === false && newValue === true
      }
    }
  }
</script>

<template>
    <div class="lds-loader" v-bind:class="{'-hidden': !showLoading}">
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <span class="lds-text">{{loadingMessage}}...</span>
    </div>
</template>

<style lang="scss" scoped>
    .lds-loader {
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.85);
        opacity: 1;
        transition: all .3s ease-in-out;

        &.-hidden {
            z-index: 0;
            opacity: 0;
        }

        .lds-ring {
            display: inline-block;
            position: relative;
            width: 64px;
            height: 64px;

            div {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 51px;
                height: 51px;
                margin: 6px;
                border: 6px solid #fff;
                border-radius: 50%;
                animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: #fff transparent transparent transparent;

                &:nth-child(1) {
                    animation-delay: -0.45s;
                }

                &:nth-child(2) {
                    animation-delay: -0.3s;
                }

                &:nth-child(3) {
                    animation-delay: -0.15s;
                }
            }
        }

        .lds-text {
            color: #FFF;
            font-weight: 500;
            font-size: 14px;
            padding-top: 15px;
        }
    }

    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
