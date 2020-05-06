<template>
    <div>
        <div>
            <div>
                <el-input
                        size="small"
                        class="addPosInput"
                        placeholder="添加职位..."
                        prefix-icon="el-icon-plus"
                        @keydown.enter.native="addPosition"
                        v-model="pos.name">
                </el-input>
                <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
                <el-upload
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="onSuccess"
                        :on-error="onError"
                        :disabled="importBtnDisabled"
                        style="display: inline-flex; margin-left: 80px"
                        action="/system/basic/pos/import">
                    <el-button :disabled="importBtnDisabled" type="success" :icon="importBtnIcon" size="small">
                        {{importBtnText}}
                    </el-button>
                </el-upload>
                <el-button type="success" icon="el-icon-download" size="small" @click="exportData" style="display: inline-flex; margin-left: 10px">
                    导出数据
                </el-button>
            </div>
            <div class="posManaMain">
                <el-table
                        :data="position"
                        border
                        stripe
                        @selection-change="handleSelectionChange"
                        size="small"
                        style="width: 70%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="id"
                            label="编号"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="职位名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="createDate"
                            width="150"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            label="是否启用">
                        <template slot-scope="scope">
                            <el-tag size="small" type="success" v-if="scope.row.enabled">已启用</el-tag>
                            <el-tag size="small" type="danger" v-else>未启用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="showEditView(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[5, 10, 20, 30]"
                            :page-size="5"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageInfo.total">
                    </el-pagination>
                </div>
                <el-button @click="deleteMany" type="danger" size="small" style="margin-top: 8px"
                           :disabled="multipleSelection.length===0">批量删除
                </el-button>

            </div>

            <el-dialog
                    title="修改职位"
                    :visible.sync="dialogVisible"
                    width="30%">
                <div>
                    <div>
                        <el-tag>职位名称</el-tag>
                        <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
                    </div>
                    <div>
                        <el-tag>是否启用</el-tag>
                        <el-switch
                                v-model="updatePos.enabled"
                                active-text="启用"
                                inactive-text="禁用">
                        </el-switch>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
                  </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import {deleteRequest, postRequest, putRequest, getRequest} from "../../../utils/api";

    export default {
        name: "PosMana",
        data() {
            return {
                pageInfo: {
                    total: 0,
                    page: 1,
                    size: 5
                },
                pos: {
                    name: ''
                },
                position: [],
                multipleSelection: [],
                updatePos: {
                    name: '',
                    enabled: false
                },
                dialogVisible: false,
                importBtnText: '导入数据',
                importBtnIcon: 'el-icon-upload2',
                importBtnDisabled: false
            }
        },
        mounted() {
            this.initPositions();
        },
        methods: {
            onSuccess(response, file, fileList) {
                this.importBtnText = '导入数据'
                this.importBtnIcon = 'el-icon-upload2'
                this.importBtnDisabled = false
                this.initPositions()
            },
            onError(err, file, fileList) {
                this.importBtnText = '导入数据'
                this.importBtnIcon = 'el-icon-upload2'
                this.importBtnDisabled = false
            },
            beforeUpload () {
                this.importBtnText = '正在导入'
                this.importBtnIcon = 'el-icon-loading'
                this.importBtnDisabled = true
            },
            exportData () {
                window.open('/system/basic/pos/export', '_parent')
            },
            handleSelectionChange(val) {
                // console.log(val)
                this.multipleSelection = val;
            },
            async initPositions() {
                const resp = await getRequest('/system/basic/pos/?page=' + this.pageInfo.page + '&size=' + this.pageInfo.size);
                // console.log(resp)
                if (resp) {
                    // this.position = resp.obj;
                    this.position = resp.obj.list;
                    this.pageInfo.total = resp.obj.total;
                }
            },
            handleSizeChange(currentSize) {
                this.pageInfo.size = currentSize;
                this.initPositions();
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.page = currentPage;
                this.initPositions();
            },
            async addPosition() {
                if (this.pos.name) {
                    const resp = await postRequest('/system/basic/pos/', this.pos);
                    if (resp) {
                        this.initPositions();
                        this.pos.name = '';
                    }
                } else {
                    this.$message.warning("职位名称不能为空")
                }
            },
            showEditView(index, data) {
                Object.assign(this.updatePos, data);
                this.dialogVisible = true;
            },
            handleDelete(index, data) {
                this.$confirm('此操作将永久删除' + data.name + '职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/pos/' + data.id).then(resp => {
                        this.initPositions()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            deleteMany() {
                this.$confirm('此操作将永久删除' + this.multipleSelection.length + '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = "?";
                    this.multipleSelection.forEach(item => {
                        ids += "ids=" + item.id + '&'
                    })
                    deleteRequest('/system/basic/pos/' + ids).then(resp => {
                        this.initPositions();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            async doUpdate() {
                const resp = await putRequest('/system/basic/pos/', this.updatePos)
                if (resp) {
                    this.initPositions()
                    this.updatePos.name = ''
                    this.dialogVisible = false
                }
            }
        }
    }
</script>

<style scoped>
    .addPosInput {
        width: 300px;
        margin-right: 8px
    }

    .updatePosInput {
        width: 200px;
        margin-left: 8px;
    }

    .posManaMain {
        margin-top: 10px;
    }
</style>
