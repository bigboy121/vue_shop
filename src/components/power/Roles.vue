<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleBtn">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过foe循环 嵌套二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
            >删除</el-button>
            <!-- 分配权限按钮 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addRoleClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addFormRole" :rules="addFormRules" ref="addRoleRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFormRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addFormRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editRoleClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addFormRole" :rules="addFormRules" ref="editRoleRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFormRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addFormRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 是否显示添加角色对话框
      addDialogVisible: false,
      // 是否显示编辑角色对话框
      editDialogVisible: false,
      // 控制分配权限对话框
      setRightDialogVisible: false,
      // 添加角色数据
      addFormRole: {
        roleName: "",
        roleDesc: ""
      },
      // 所有权限的数据
      rightList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      // 默认选中的节点ID值数组
      defKeys: [],
      // 当前即将分配权限的角色的id
      roleId: "",
      // 验证规则
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 获取所有角色的列表
    this.getRolesList();
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }

      this.roleList = res.data;
      console.log(this.roleList);
    },
    // 监听添加角色按钮点击事件
    addRoleBtn() {
      this.addDialogVisible = true;
    },
    // 监听对话框关闭
    addRoleClosed() {
      this.$refs.addRoleRef.resetFields();
      this.addDialogVisible = false;
    },
    // 监听确定添加角色按钮点击
    addRoleInfo() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) {
          return;
        }
        // 发起添加角色的网络请求
        const { data: res } = await this.$http.post("roles", this.addFormRole);
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败！");
        }

        this.$message.success("添加角色成功！");
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    // 监听编辑按钮点击
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色信息失败!");
      }
      this.addFormRole = res.data;
    },
    // 监听 编辑对话框 确定按钮
    editRoleInfo() {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.addFormRole.roleId,
          {
            roleName: this.addFormRole.roleName,
            roleDesc: this.addFormRole.roleDesc
          }
        );
        console.log(res);

        if (res.meta.status !== 200) {
          return this.$message.error("更新角色信息失败！");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getRolesList();
        // 提示修改成功
        this.$message.success("更新用户信息成功！");
      });
    },
    // 监听对话框关闭
    editRoleClosed() {
      this.$refs.editRoleRef.resetFields();
      this.editDialogVisible = false;
    },
    // 监听删除按钮的点击
    async removeRolesById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果用户确认删除 返回文本字符串 confirm
      // 如果用户取消删除 返回文本字符串 cancel

      if (confirmResult !== "confirm") {
        return this.$message.info("取消用户删除！");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.erroe("删除用户失败！");
      }
      this.$message.success("完成用户删除！");
      this.getRolesList();
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除！");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.erroe("删除权限失败！");
      }
      // this.$message.success("完成权限删除！");
      // 防止列表刷新 赋值数据 不调用网络请求
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;

      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");

      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！");
      }
      // 获取到的权限数据保存到data中
      this.rightList = res.data;
      console.log(this.rightList);

      // 递归当前三级权限的id
      this.getLeafKty(role, this.defKeys);

      this.setRightDialogVisible = true;
    },
    // 通过递归的形式， 获取角色下所有的三级权限的id 保存到defKets
    getLeafKty(node, arr) {
      // 如果当前node 节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKty(item, arr));
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];

      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("分配角色权限失败！");
      }

      this.$message.success("分配角色权限成功！");

      this.getRolesList();

      this.setRightDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>