<template>
  <div class="showparams">
    页面获取的参数 {{params.eatId}} {{params.eatFlag}} {{params.title}}
  </div>
</template>

<script>
import {
  decodeUrlParam
} from '@/utils/urlTool'
import card from '@/components/card'
export default {
  components: {
    card
  },

  data () {
    return {
      params: {}
    }
  },

  created () {
  },
  mounted () {
    this.params = decodeUrlParam(this.$root.$mp.query) // 页面的参数
  }
}
</script>

<style scoped>
.showparams {
  text-align: center;
}
</style>
