<template>
  <view class="home-container">
    <!-- 使用自定义的搜索组件 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true"
    :autoplay="true" :interval="3000" 
    :duration="1000" :circular="true">
      <!-- 循环渲染轮播图的 item 项 -->
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 导航区域 -->
    <view class="nav-list">
       <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
         <image :src="item.image_src" class="nav-img"></image>
       </view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层 item 项 -->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
         <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
              <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    // 数据
    data() {
      return {
        // 轮播图列表
        swiperList: [],
        // 导航列表
        navList:[],
        // 楼层列表
        floorList:[]
      };
    },
    // 方法
    methods: {
      // 获取轮播图列表
      async getSwiperList() {
        // 发起请求
        const {data: res} = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 请求失败
        if (res.meta.status !== 200) return uni.showToast({
          title: '数据请求失败',
          icon:'error'
        })
        // 请求成功
        this.swiperList = res.message
      },
      // 获取导航列表
      async getNavList(){
        // 发起请求
        const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
        // 请求失败
        if (res.meta.status !== 200) return uni.showToast({
          title: '数据请求失败',
          icon:'error'
        })
        // 请求成功
        this.navList = res.message
      },
      // 点击导航的处理函数
      navClickHandler(item){
        // 判断点击的是哪个nav
        if (item.name === '分类') {
          // 点击的是分类，跳转到分类的tabbar页
          uni.switchTab({
            url: '/pages/cate/cate' 
          })
        }
      },
      // 获取楼层列表
      async getFloorList(){
        // 发起请求
        const {data: res} = await uni.$http.get('/api/public/v1/home/floordata')
        // 请求失败
        if (res.meta.status !== 200) return uni.showToast({
          title: '数据请求失败',
          icon:'error'
        })
        // 请求成功
        // 通过双层 forEach 循环，处理 URL 地址
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      // 跳转到分包中的搜索页面
         gotoSearch() {
           uni.navigateTo({
             url: '/subpkg/search/search'
           })
         }
    },
    // 生命周期钩子：页面刚加载时触发
    onLoad() {
      // 调用获取轮播图列表
      this.getSwiperList()
      // 调用获取导航列表
      this.getNavList()
      // 调用获取楼层列表
      this.getFloorList()
    }
  }
</script>

<style lang="scss">
  // 自定义的搜索组件
  .search-box {
    // 设置定位效果为“吸顶”
    position: sticky;
    // 吸顶的“位置”
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;
  }
  // 轮播图
  swiper{
    height: 330rpx;
    .swiper-item,image{
      width: 100%;
      height: 100%;
    }
  }
  // 导航
  .nav-list{
    display: flex;
    justify-content: space-around;
    margin: 15px 0;
    .nav-item{
      width: 128rpx;
      height: 140rpx;
      image{
        width: 100%;
        height: 100%;
      }
    }
  }
  //楼层
  .floor-list{
    // 标题
    .floor-title {
      height: 60rpx;
      width: 100%;
      display: flex;
    }
    // 图片
    .floor-img-box {
      display: flex;
      padding-left: 10rpx;
      .right-img-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    }
  }
</style>
