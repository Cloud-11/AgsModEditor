const mergeLineHandle = (data: any[], array: mergerItem[]) => {
  //循环数据处理
  for (let n = 0; n < array.length; n++) {
    array[n].spanArr = []; //数据清空(重新调此方法的时候需要清空上一次的数据)
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        array[n].spanArr.push(1);
        array[n].pos = 0;
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i][array[n].prop] === data[i - 1][array[n].prop]) {
          array[n].spanArr[array[n].pos] += 1;
          array[n].spanArr.push(0);
        } else {
          array[n].spanArr.push(1);
          array[n].pos = i;
        }
      }
    }
  }
};
type mergerItem = {
  columnIndex: number;
  spanArr: number[];
  pos: number;
  prop: string;
};

export const useMergeMethod = (data: any[], mergerItems: mergerItem[]) => {
  mergeLineHandle(data, mergerItems);
  return ({
    rowIndex,
    columnIndex,
  }: {
    rowIndex: number;
    columnIndex: number;
  }) => {
    //合并表格
    if (columnIndex === 1 || columnIndex === 2) {
      let item = mergerItems.find((item) => item.columnIndex === columnIndex);
      if (item) {
        const _row = item.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    }
  };
};
