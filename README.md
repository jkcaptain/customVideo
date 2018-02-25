# customVideo
简易的自定义video

某天想买手机，走进魅族官网，发现他们的video挺好看的，就琢磨着写一个。

html结构和css大都是我直接扒下来的，花了一下午的时间写了个粗糙的播放器。

只在chrome里面测试，没管其他的浏览器，主要是想看下怎么实现，没处理兼容性。

大致思路

1.创建好video以及video相关控件的html

2.给各个控件监听事件，具体有哪些事件，可以参考mdn文档。

用法：

	var video = window.myVideo(elem || id, videoUrl);   //第一个参数可以是dom元素或id， 第二个参数表示video的url

写的比较仓促，代码没怎么整理。轻喷。

希望能给大家带来帮助。如有错误之处，还望指出。
