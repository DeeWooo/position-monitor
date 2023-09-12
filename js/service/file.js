import { addPosition, clearPositionData, getAllPositions } from "./db.js";

let fileHandle = null; // 保存文件句柄的变量

// 打开持仓记录文件
export async function openFile() {
  try {
    const [handle] = await window.showOpenFilePicker();
    fileHandle = handle;
    // alert(fileHandle);
    const file = await fileHandle.getFile();
    const contents = await file.text();

    const objArr = JSON.parse(contents);
    console.log(objArr);
    console.log(objArr.length);

    await clearPositionData();
    for (let position of objArr) {
      await addPosition(position);
    }

    console.log("成功打开持仓记录文件");
  } catch (error) {
    console.error("用户取消了文件选择或者发生了其他错误:", error);
  }
}

// getAllPositions

// 保存持仓记录文件
export async function saveFile() {
  try {
    if (!fileHandle) {
      // 如果没有已知的文件句柄，那么创建一个新的文件
      fileHandle = await window.showSaveFilePicker();
    }
    const writable = await fileHandle.createWritable();
    // 清空文件内容
    await writable.truncate(0);

    // 写入你的持仓记录
    const positionData = await getAllPositions(); // 获取position表中的所有数据
    const jsonStr = JSON.stringify(positionData); // 将数据转换为JSON字符串

    await writable.write(jsonStr);
    await writable.close();
  } catch (err) {
    // 用户取消了文件选择或者发生了其他错误
    console.error("用户取消了文件选择或者发生了其他错误:", err);
  }
}

export async function importPosition() {
  const handle = await window.showSaveFilePicker();

  const writable = await handle.createWritable();

  await writable.write("Hello, World!");
  await writable.close();
  console.log("文件保存成功！");
}

export async function savePosition() {
  const handle = await window.showSaveFilePicker();

  const writable = await handle.createWritable();

  await writable.write("Hello, World!");
  await writable.close();
  console.log("文件保存成功！");
}
