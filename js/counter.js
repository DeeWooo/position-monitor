var counter = 0; // 初始值为 0
setInterval(function () {
  counter++; // 每秒钟加 1
  document.getElementById("counter").innerHTML = counter; // 更新显示的值
}, 1000);
