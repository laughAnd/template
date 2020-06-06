<template>
  <div>
    <el-tag :key="tag" :tags="tags" v-for="tag in tags" size="size" type="type" :closable="closable" :hit="hit"
      color="color" :disable-transitions="false" @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
      @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
    </el-input>
    <el-button v-if="!inputVisible & closable" class="button-new-tag" size="small" @click="showInput">+ New Tag
    </el-button>

  </div>
</template>

<script>
  export default {
    name: 'JTCTags',
    props: {
      tags: Array, // 数据
      type: { // 
        type: String,
        default: 'success'
      },
      closable: { // 可关闭  可写
        type: Boolean,
        default: true
      },
      hit: { // 
        type: Boolean,
        default: false
      },
      color: {  //
        type: String,
        default: ''
      },
      size: {//
        type: String,
        default: 'mini'
      }
    },
    data() {
      return {
        inputVisible: false,
        inputValue: ''
      };
    },
    methods: {
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          if (this.tags.indexOf(inputValue) === -1) {
            this.tags.push(inputValue);
          }
          else {
            this.$message({ message: '数据重复', type: 'error' })
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  }
</script>

<style scoped>
  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>