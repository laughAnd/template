<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
    <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="item.path">
      <i v-if="index == 0" class="el-icon-date"></i>&nbsp;{{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    methods: {

    },
    mounted() {

    }
  };
</script>

<style scoped lang="scss">
  .breadcrumb {
    padding: 10px;
    border-color: rgba(38, 86, 114, 0.2);

  }
</style>