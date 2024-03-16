# 信号（以数据形式组装的一组对象）
- 信号组成为 触发器（trigger）加工器（mix）迭代器（rep）响应器（subscribe）
- 当触发器发送一段信号出去时，可以经过rep/mix来完成信号发送动作与信号的加工最终发送至响应端进行装载
- examples:
- 触发器A，触发器B，同时连接迭代器（timerInt）并最终连接至某响应器
```tsx

 //A-》t（in-go）-》s
 //B-》t（in-stop）-》s

 /**
  * 需要注意的是 所有迭代器都是对信号本身进行加工
  * 即 t处理信号假设延迟两秒之后循环后续信号
  * 信号本身组织方式为数组而不是链表
  * 即将 t出口的下标记录进ringStack，因为是出口开始循环
  * 当ringStack存在则一直循环
  * t-out=>s-in
  * t-out=>s-in
  * t-out=>s-in
  * t-out=>s-in
  * 
  * 直到B触发（都为惰函数）会手动清理ringStack
  * t-out=>s-in
  * t-out=>s-in
  * B->t（in-stop）
  * end
  */
```