/*global console document window*/
console.log("start");


const wrapper_wrapper = document.getElementById("wrapper_wrapper");

function monitor(node, method) {
    // @ts-ignore
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;//浏览器兼容
    const config = { childList: true };//配置对象
    const observer = new MutationObserver(function (mutations) {//构造函数回调
        mutations.forEach(function (record) {
            method(record);
        });
    });
    if (observer && node) {
        observer.observe(node, config);
    }
}
function closeNode(addNode) {
    // addNode.hidden = true;
    // addNode.style.display = 'none !important';
    // addNode.style.width = '0px !important';
    // addNode.style.height = '0px !important';
    //display:block !important;visibility:visible !important;
    addNode.innerHTML = '可能含xx-不显示';
}

function checkNewsNode1(addNode) {
    if (addNode.attributes) {
        let tpl = addNode.attributes.tpl;
        if (tpl && tpl.nodeValue) {
            if (tpl.nodeValue.indexOf("ad") != -1) {
                addNode.innerHTML = '含xx';
            }
            else if (tpl.nodeValue.indexOf("video") != -1) {
                addNode.innerHTML = '可能含v-不显示';
            }
        }
    }
}
function checkNewsNode(addNode) {
    addNode.childNodes.forEach(x => {
        checkNewsNode1(x);
    });
}
function checkNode(addNode) {
    if (addNode && addNode.parentElement) {
        if (addNode.parentElement.id === "content_left") {
            const innerText = addNode.innerText;
            if (innerText) {
                if (innerText.indexOf("广告") != -1) {
                    closeNode(addNode);
                } else if (innerText.indexOf("CSDN") != -1) {
                    addNode.innerHTML = '含c';
                } else if (innerText.indexOf("知乎") != -1) {
                    addNode.innerHTML = '含z';
                }
            }
            const attributes = addNode.attributes;
            if (attributes && attributes.mu) {
                if (attributes.mu.value && attributes.mu.value.indexOf("csdn") != -1) {
                    addNode.innerHTML = '含c1';
                }
            }
        } else {
            checkNode(addNode.parentElement);
        }
    }
}

var lastCheck = 0;
function checkC(addNode) {
    lastCheck = new Date().getTime()
    const content_left = document.getElementById("content_left");
    if (content_left) {
        content_left.childNodes.forEach(x => {
            checkNode(x);
        });
    }

    var news = document.getElementById("s_xmancard_news_new");
    if (news) {
        //.entries().find(x=>x.className=="water-container")
        let v = undefined;
        news.childNodes[0].childNodes.forEach((x) => {
            if (x.className == "water-container") {
                v = x;
            }
        })
        if (v) {
            v.childNodes.forEach(x => {
                checkNewsNode(x);
            });
        }
        //class="water-container"
    }
}
setInterval(() => {
    checkC();
}, 1000);
checkC(null);
var lastCheckTimeout;
function tryCheckC() {
    if (new Date().getTime() - lastCheck >= 2000) {
        checkC(null);
    } else {
        if (lastCheckTimeout) {
            clearTimeout(lastCheckTimeout);
            lastCheckTimeout = undefined;
        }
        lastCheckTimeout = setTimeout(() => {
            tryCheckC();
        }, 1000);
    }
}
monitor(wrapper_wrapper, (record) => {
    if (record && record.addedNodes && record.addedNodes.length) {

        tryCheckC();

        record.addedNodes.forEach((addNode) => {
            if (addNode.id == "container") {
                checkC(addNode);
                monitor(addNode, (record1) => {
                    checkNode(record1);
                });
            }
        });
    }
});

