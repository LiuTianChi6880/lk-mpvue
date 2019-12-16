<template>
  <div @click="clickHandle">
    <div class="gotobtn" @click="gotoFood">普通页面跳转传参</div>
    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <!--<img class="userinfo-avatar" src="/static/images/user.png" background-size="cover" />-->

      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import {
  encodeUrlParam
} from '@/utils/urlTool'
import fetch from '@/service/fetch'
import * as API from '@/service/api'
export default {
  data () {
    return {
      motto: 'Hello miniprograme',
      userInfo: {
        nickName: 'test',
        avatarUrl: '/static/images/user.png'
      }
    }
  },

  components: {
    card
  },

  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.switchTab({ url })
    },
    gotoFood () {
      let params = {
        eatId: '888',
        eatFlag: 1,
        title: 'xxxxx'
      }
      let url = encodeUrlParam('/pages/food/main', params)
      wx.navigateTo({ url })
    },
    clickHandle (ev) {
      console.log('clickHandle:', ev)
    },
    getKeys () {
      console.log('00000', API)
      fetch({
        method: 'POST',
        baseUrl: API.baseUrl,
        api: API.getCookLikeName,
        contentType: 'application/json; charset=UTF-8',
        params: { cookbookName: '土豆' }
      }).then(res => {
        console.log('成功', res)
      }, err => {
        console.log('失败', err)
      })
    }
  },

  created () {
    // let app = getApp()
  },
  mounted () {
    this.getKeys()
  }
}
</script>

<style scoped>
  .gotobtn{
    height: 60px;
    line-height: 60px;
    width: 60%;
    text-align: center;
    margin: 0 auto;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
  }
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}
</style>
