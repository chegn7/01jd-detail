// 所有DOM和相关资源加载完毕执行的事件函数
window.onload = function () {
    // 路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind() {
        let navPath = document.getElementById("navPath");
        navPath = document.querySelector("#navPath");
        let pathData = goodData.path;
        for (let i = 0; i < pathData.length; i++) {
            let path = pathData[i];
            let aNode = document.createElement("a");
            if (i != pathData.length - 1) aNode.href = path.url;
            aNode.innerText = path.title;
            let iNode = document.createElement("i");
            iNode.innerText = "/";
            navPath.appendChild(aNode);
            if (i != pathData.length - 1) navPath.appendChild(iNode);
        }
    }
    // 放大镜的移入移出效果
    magnifierBind();
    function magnifierBind() {
        /*
        1. 获取小图框的元素对象，设置移入事件
        onmouseover (传递给父元素)  和 onmouseenter (不需要传递给父元素)
        2. 动态创建蒙版和大图框大图片
        3. 移出时移除蒙版和大图框大图片
        */
        let smallPic = document.querySelector("#smallPic");
        smallPic.onmouseenter = () => {
            // console.log("test move in");
            // 创建元素
            let maskDiv = document.createElement("div");
            maskDiv.id = "mask";
            let bigPicDiv = document.createElement("div");
            bigPicDiv.id = "bigPic";
            let bigImg = document.createElement("img");
            let smallUrl = smallPic.getElementsByTagName("img")[0].src;
            let idx = smallUrl.lastIndexOf("/");
            let bigUrl = smallUrl.substring(0, idx) + smallUrl.substring(idx).replace("s", "b");
            bigImg.src = bigUrl;
            // 大图框加大图片
            bigPicDiv.appendChild(bigImg);
            smallPic.appendChild(maskDiv);
            smallPic.parentElement.appendChild(bigPicDiv);

            // 移除
            smallPic.onmouseleave = () => {
                smallPic.removeChild(maskDiv);
                smallPic.parentElement.removeChild(bigPicDiv);
            };
            // 鼠标移动事件
            smallPic.onmousemove = (event) => {
                let leftDistance = event.clientX
                    - smallPic.getBoundingClientRect().left
                    - maskDiv.offsetWidth / 2;
                let topDistance = event.clientY
                    - smallPic.getBoundingClientRect().top
                    - maskDiv.offsetHeight / 2;
                if (leftDistance < 0) leftDistance = 0;
                if (topDistance < 0) topDistance = 0;
                if (leftDistance > smallPic.offsetWidth - maskDiv.offsetWidth) leftDistance = smallPic.offsetWidth - maskDiv.offsetWidth;
                if (topDistance > smallPic.offsetHeight - maskDiv.offsetHeight) topDistance = smallPic.offsetHeight - maskDiv.offsetHeight;

                maskDiv.style.left = leftDistance + "px";
                maskDiv.style.top = topDistance + "px";
                let ratio = 2;// 放大两倍
                let bigLeftDist =bigPicDiv.clientWidth / 2 - (leftDistance + maskDiv.offsetWidth / 2) * ratio;
                let bigTopDist =bigPicDiv.clientHeight / 2 - (topDistance + maskDiv.offsetHeight / 2) * ratio;
                bigImg.style.position = "relative";
                bigImg.style.left = bigLeftDist + "px";
                bigImg.style.top = bigTopDist + "px";
            }
        };



    }

}