var avalon = require('../../seed/core')
avalon._hydrate = require('../../strategy/hydrateByDom.compact')

var document = avalon.document

var readyList = [], isReady
var fireReady = function (fn) {
    isReady = true

    while (fn = readyList.shift()) {
        fn(avalon)
    }
}
avalon.ready = function (fn) {
    if (!isReady) {
        readyList.push(fn)
    } else {
        fn(avalon)
    }
}

avalon.ready(function () {
    avalon.scan(document.body)
})

new function () {
    if (!avalon.browser)
        return
    var root = avalon.root

    function doScrollCheck() {
        try { //IE下通过doScrollCheck检测DOM树是否建完
            root.doScroll('left')
            fireReady()
        } catch (e) {
            setTimeout(doScrollCheck)
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(fireReady) //如果在domReady之外加载
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fireReady)
    } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState === 'complete') {
                fireReady()
            }
        })
        try {
            var isTop = window.frameElement === null
        } catch (e) {
        }
        if (root.doScroll && isTop && window.external) {//fix IE iframe BUG
            doScrollCheck()
        }
    }

    avalon.bind(window, 'load', fireReady)
}



