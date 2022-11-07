 // 所有DOM和相关资源加载完毕执行的事件函数
 window.onload = function() {
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