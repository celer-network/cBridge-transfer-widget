/* eslint-disable */
(function (win) {
  var doc = win.document;
  var docEl = doc.documentElement;
  var metaEl = doc.querySelector('meta[name="viewport"]');
  var dpr = 0;
  var scale = 0;
  var tid;
  var flexible = {};
  if (metaEl) {
    console.warn("将根据已有的meta标签来设置缩放比例");
    var match = metaEl.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
    if (match) {
      scale = parseFloat(match[1]);
      dpr = parseInt(1 / scale);
    }
  }
  if (!dpr && !scale) {
    var isAndroid = win.navigator.appVersion.match(/android/gi);
    var isIPhone = win.navigator.appVersion.match(/iphone/gi);
    var devicePixelRatio = win.devicePixelRatio;
    // if (isIPhone) {
    //     // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
    //     if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
    //         dpr = 3;
    //     } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
    //         dpr = 2;
    //     } else {
    //         dpr = 1;
    //     }
    // } else {
    //     // 其他设备下，仍旧使用1倍的方案
    //     dpr = 1;
    // }
    dpr = 1;
    scale = 1 / dpr;
  }
  docEl.setAttribute("data-dpr", dpr);
  if (!metaEl) {
    metaEl = doc.createElement("meta");
    metaEl.setAttribute("name", "viewport");
    metaEl.setAttribute(
      "content",
      "initial-scale=" +
        scale +
        ", maximum-scale=" +
        scale +
        ", minimum-scale=" +
        scale +
        ", user-scalable=no,viewport-fit=cover",
    );
    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(metaEl);
    } else {
      var wrap = doc.createElement("div");
      wrap.appendChild(metaEl);
      doc.write(wrap.innerHTML);
    }
  }

  function refreshRem() {
    var width = (docEl && docEl.clientWidth) || doc.body.clientWidth || win.innerWidth;
    var rem = width / 10;
    docEl.style.fontSize = rem + "px";
    flexible.rem = win.rem = rem;
  }

  win.addEventListener(
    "resize",
    function () {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    },
    false,
  );
  win.addEventListener(
    "pageshow",
    function (e) {
      if (e.persisted) {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
      }
    },
    false,
  );

  // if (doc.readyState === 'complete') {
  //     doc.body.style.fontSize = 12 * dpr + 'px';
  // } else {
  //     doc.addEventListener('DOMContentLoaded', function(e) {
  //         doc.body.style.fontSize = 12 * dpr + 'px';
  //     }, false);
  // }

  refreshRem();

  flexible.rem2px = function (d) {
    var val = parseFloat(d) * this.rem;
    if (typeof d === "string" && d.match(/rem$/)) {
      val += "px";
    }
    return val;
  };
  flexible.px2rem = function (d) {
    var val = parseFloat(d) / this.rem;
    if (typeof d === "string" && d.match(/px$/)) {
      val += "rem";
    }
    return val;
  };
  win.flexible = flexible;
})(window);
