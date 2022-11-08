// 所有DOM和相关资源加载完毕执行的事件函数
window.onload = function () {
    // 缩略图的下标，初始位置为0
    let thumbnailIdx = 0;
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
            let smallUrl = goodData.imagessrc[thumbnailIdx]["s"];
            console.log(smallUrl);
            let idx = smallUrl.lastIndexOf("/");
            let bigUrl = goodData.imagessrc[thumbnailIdx]["b"];
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
    // 渲染缩略图
    thumbnailRender();
    function thumbnailRender() {
        let ul = document.querySelector("#picList > ul");
        let imgs = goodData.imagessrc;
        for (let i of imgs) {
            let li = document.createElement("li");
            let img = document.createElement("img");
            img.src = i["s"];
            li.appendChild(img);
            ul.appendChild(li);
        }
    }
    // 点击切换缩略图
    thumbnailClick();
    function thumbnailClick() {
        let lis = document.querySelectorAll("#picList > ul > li");
        // 确定点击图片的下标位置
        for (let i = 0; i < lis.length; i++) {
            let li = lis[i];
            // 回调函数，异步执行，在同步之后，此时i已==lis.length，因此不能直接将i作为下标
            li.setAttribute("idx", i);
            li.onclick = () => {
                thumbnailIdx = li.getAttribute("idx");
                console.log(thumbnailIdx);
                // 切换小图
                loadSmallPic();
            };
        }

    }
    loadSmallPic();
    function loadSmallPic() {
        let img = document.querySelector("#smallPic > img");
        img.src = goodData.imagessrc[thumbnailIdx]["s"];
    }
    // 点击左右按钮滚动图片
    thumbnailButtonClick();
    function thumbnailButtonClick() {
        let lengthUnit = "px";
        let leftBtn = document.querySelector("#leftBottom > a:first-child");
        let rightBtn = document.querySelector("#leftBottom > a:last-child");
        let li = document.querySelector("#picList > ul > li"), ul = document.querySelector("#picList > ul");
        let liStyle = window.getComputedStyle(li);
        let elementLength = (parseInt(liStyle.marginLeft) + parseInt(li.offsetWidth) + parseInt(liStyle.marginRight));
        let viewLength = ul.offsetWidth;
        let totalLength = elementLength * (document.querySelectorAll("#picList > ul > li").length);
        // 每次点击，移动的步长为一个element的length，即左/右移一张图片
        ul.style.position = "relative";
        ul.style.left = "0px";
        // left == 0 时，位于最左边
        // left == viewLength - totalLenth时，位于最右边
        // left的范围是 [Math.min(0, viewLength - totalLength), 0]
        let minLeft = Math.min(0, viewLength - totalLength);
        let maxLeft = 0;
        let stepLength = elementLength;
        // left 加，图片向右偏移，即向左滚动
        leftBtn.onclick = () => {
            scrollClick(ul, elementLength, lengthUnit, minLeft, maxLeft);
        };
        rightBtn.onclick = () => {
            scrollClick(ul, -elementLength, lengthUnit, minLeft, maxLeft);
        };
    }

    
    function scrollClick(scrollObj, step, unit, min, max) {
        let res = parseInt(scrollObj.style.left) + step;
        if (res < min) {
            res = min;
            
        } else if (res > max) {
            res = max;
        }
        console.log(res)
        scrollObj.style.left = res + unit;
    }
}