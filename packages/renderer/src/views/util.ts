import { Store } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { DELETE_BY_ID } from "/@/store/actionType";
//多选 删除
const useHandleTableSelectionChange = (state: any) => (val: []) => {
  state.selRows = val;
};

const useHandleDelMenu =
  (store: Store<any>, name: string) => (rows?: defaultDataType[]) => {
    console.log(rows);
    if (rows === undefined || rows.length < 1) {
      ElMessageBox.alert("请先选择要删除的数据!");
    } else {
      let trips = "";
      let ids = [""];
      for (const row of rows) {
        trips += `【${row.id}】${row.displayName} `;
        ids.push(row.id);
      }
      ElMessageBox.confirm(`确定要删除 ${trips}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          store
            .dispatch(DELETE_BY_ID, { id: ids, name })
            .then((res) => {
              ElMessage({
                showClose: true,
                message: res,
                type: "success",
              });
            })
            .catch((rej) => {
              ElMessage({
                showClose: true,
                message: rej,
                type: "error",
              });
            });
        })
        .catch((e) => {
          console.log(e);
          ElMessage({
            type: "error",
            message: "取消删除",
          });
        });
    }
  };
export { useHandleDelMenu, useHandleTableSelectionChange };
