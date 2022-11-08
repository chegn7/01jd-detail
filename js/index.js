
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
            // 创建元素
            let maskDiv = document.createElement("div");
            maskDiv.id = "mask";
            let bigPicDiv = document.createElement("div");
            bigPicDiv.id = "bigPic";
            let bigImg = document.createElement("img");
            let smallUrl = goodData.imagessrc[thumbnailIdx]["s"];

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
                let bigLeftDist = bigPicDiv.clientWidth / 2 - (leftDistance + maskDiv.offsetWidth / 2) * ratio;
                let bigTopDist = bigPicDiv.clientHeight / 2 - (topDistance + maskDiv.offsetHeight / 2) * ratio;
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
        scrollObj.style.left = res + unit;
    }

    // 商品标题、价格动态渲染
    productDetailTitle();
    function productDetailTitle() {
        let rightTop = document.querySelector("#rightTop");
        let productData = goodData.goodsDetail;
        var s = `<h3>${productData.title}</h3>
                    <p>${productData.recommend}</p>
                    <div class="priceWrap">
                        <div class="priceTop">
                            <span>价格</span>
                            <div class="price">
                                <span>￥</span>
                                <span>${productData.price}</span>
                                <span><a>降价通知</a></span>
                            </div>
                            <div class="commentCount">
                                <span>累计评价&nbsp;</span>
                                <span>${productData.evaluateNum}</span>
                            </div>
                        </div>
                        <div class="priceBottom">
                            <span>促销</span>
                            <span>${productData.promoteSales.type}</span>
                            <span>${productData.promoteSales.content}</span>
                        </div>
                    </div>
                    <div class="support">
                        <span>支持</span>
                        <span>${productData.support}</span>
                    </div>
                    <div class="deliver">
                        <span>配送至</span>
                        <span>${productData.address}</span>
                    </div>`;
        rightTop.innerHTML = s;

    }

    // 商品规格
    productSpecificationsRender();
    function productSpecificationsRender() {
        let productSpecification = goodData.goodsDetail.crumbData;
        let selection = document.querySelector("#rightBottom .selection");
        for (let i = 0; i < productSpecification.length; i++) {
            let spec = productSpecification[i];
            let dl = document.createElement("dl");
            let dt = document.createElement("dt");
            dt.innerText = spec.title;
            dl.appendChild(dt);

            for (let j = 0; j < spec.data.length; j++) {
                let dd = document.createElement("dd");
                dd.innerText = spec.data[j].type;
                dl.appendChild(dd);
            }
            selection.appendChild(dl);
        }

    }
    // 点击商品规格之后切换颜色
    prodectSpecificationColorToggle();
    function prodectSpecificationColorToggle() {
        let dls = document.querySelectorAll("#rightBottom > div.selection > dl");
        // marks 存放点击的规格
        let marks = new Array(dls.length);
        for (let i = 0; i < dls.length; i++) {
            let dds = dls[i].querySelectorAll("dd");
            for (let j = 0; j < dds.length; j++) {
                // 默认会点第一个值
                if (j == 0) {
                    marks[i] = dds[j].innerText;
                }
                dds[j].onclick = function()  {
                    for (let other of dds) {
                        other.style.color = "#666";
                    }
                    dds[j].style.color = "red";
                    marks[i] = dds[j].innerText;
                    createSelectedByMarks(marks, document.querySelector("#rightBottom"));
                };
            }
        }
        createSelectedByMarks(marks, document.querySelector("#rightBottom"));
    }

    // 根据marks数组创建/修改selected标签
    function createSelectedByMarks(marks, rightBottom) {
        let selected = rightBottom.querySelector("#selected");
        if (selected != null) rightBottom.removeChild(selected);
        selected = document.createElement("div");
        selected.id = "selected";
        let idx = 0;
        for (let e of marks) {
            if (e && e.length > 0) {
                let mark = document.createElement("div");
                mark.id = "mark";
                mark.innerText = e;
                let aNode = document.createElement("a");
                aNode.innerText = "X";
                aNode.setAttribute("idx", idx);
                mark.appendChild(aNode);
                selected.appendChild(mark);
            } else {
                marks[idx] = null;
            }
            idx++;
        }
        rightBottom.insertBefore(selected, rightBottom.getElementsByClassName("selection")[0]);
        // 获取a标签，点击X后删除a标签对应的mark
        let aNodes = rightBottom.querySelectorAll("#selected > #mark > a");
        for (let i = 0; i < aNodes.length; i++) {
            let aNode = aNodes[i];
            aNode.onclick = () => {
                let deletedIdx = parseInt(aNode.getAttribute("idx"));
                marks[deletedIdx] = null;
                // 重绘selected
                createSelectedByMarks(marks, rightBottom);
                // 恢复该行标签的颜色
                let dds = document.querySelectorAll("#rightBottom > div.selection > dl:nth-child(" + (deletedIdx + 1) + ")" + " dd");
                dds[0].style.color = "red";
                for (let ddIdx = 1; ddIdx < dds.length; ddIdx++) {
                    dds[ddIdx].style.color = "#666";
                }
            }
        }
    }

}