<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告信息区 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
        <!-- tab 页签区域 -->
        <el-col>
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!-- 添加动态参数的面板 -->
            <el-tab-pane label="动态参数" name="many">
              <!-- 添加参数按钮 -->
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="addDialogVisible = true"
              >添加参数</el-button>
              <!-- 动态参数表格 -->
              <el-table :data="manyTableData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 循环渲染tag标签 -->
                    <el-tag
                      v-for="(item,i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="handleClose(i,scope.row)"
                    >{{item}}</el-tag>
                    <!-- 输入文本库 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    ></el-input>
                    <!-- 添加按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                    >+ New Tag</el-button>
                  </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="showEditDialog(scope.row.attr_id)"
                    >修改</el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeParams(scope.row.attr_id)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 添加静态属性的面板 -->
            <el-tab-pane label="静态属性" name="only">
              <!-- 添加属性按钮 -->
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="addDialogVisible = true"
              >添加属性</el-button>

              <!-- 静态参数表格 -->
              <el-table :data="onlyTableData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 循环渲染tag标签 -->
                    <el-tag
                      v-for="(item,i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="handleClose(i,scope.row)"
                    >{{item}}</el-tag>
                    <!-- 输入文本库 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    ></el-input>
                    <!-- 添加按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                    >+ New Tag</el-button>
                  </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="showEditDialog(scope.row.attr_id)"
                    >修改</el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeParams(scope.row.attr_id)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 验证表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 验证表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Params",
  data() {
    return {
      // 商品列表数据
      cateList: [],
      // 级联选择框双向绑定到到数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      // 控制添加对话框的显示隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {},
      // 添加表单的验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      // 控制修改对话框的显示隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      // 添加修改表单的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }

      this.cateList = res.data;
    },
    // 级联选择框改变监听
    handleChange() {
      this.getParamsData();
    },

    // tab 页签点击事件到处理函数
    handleTabClick() {
      console.log(this.activeName);

      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 判断是否选中为三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        (this.manyTableData = []), (this.onlyTableData = []);
        return;
      }
      // 证明选中到是三级分类
      console.log(this.selectedCateKeys);

      // 根据所选分类的id ，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示隐藏 自定义属性
        item.inputVisible = false;
        // 文本框输入的值
        item.inputValue = "";
      });

      console.log(res.data);

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 监听对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 确定按钮添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );

        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败！");
        }

        this.$message.success("添加参数成功！");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    // 点击按钮 展示修改的对话框
    async showEditDialog(attr_id) {
      // 当寻当前的id信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("查询参数信息失败！");
      }

      this.editForm = res.data;

      this.editDialogVisible = true;
    },
    // 重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击按钮修改参数发出请求
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败！");
        }

        this.$message.success("修改参数成功！");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 根据id删除对应的参数
    async removeParams(attr_id) {
      const configResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 用户取消
      if (configResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }

      // 确定选择删除参数
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );

      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败！");
      }

      this.$message.success("删除参数成功！");
      this.getParamsData();
    },
    // 文本框失去焦点 或者 enter 触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }

      // 若无return 则添加
      row.attr_vals.push(row.inputValue.trim());

      row.inputValue = "";
      row.inputVisible = false;

      // 发起请求保存修改数据
      this.saveAttrVals(row);
    },
    // 点击按钮 显示文本输入框
    showInput(row) {
      row.inputVisible = true;

      // 文本框自动获得焦点
      // nextTick 作用 当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);

      this.saveAttrVals(row);
    },
    async saveAttrVals(row) {
      // 发起请求保存修改数据
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败！");
      }

      this.$message.success("修改参数项成功！");
    }
  },
  computed: {
    // 计算当前选中的商品等级 非三级按钮需要被禁用， 符合返回true 反之false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态计算标题显示的文本
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>