(window.hutor = window.hutor || {}),
  (function () {
    function t_events__initEvent() {
      var myNav = navigator.userAgent.toLowerCase(),
        isIE = -1 !== myNav.indexOf("msie") && parseInt(myNav.split("msie")[1]);
      if (8 === isIE || 9 === isIE) {
        var btns = document.querySelectorAll(".t-btn");
        Array.prototype.forEach.call(btns, function (btn) {
          var url = btn.getAttribute("href");
          btn.querySelector("table") &&
            url &&
            -1 === url.indexOf("#popup:") &&
            -1 === url.indexOf("#price:") &&
            btn.addEventListener("click", function (e) {
              var currentUrl = e.target.getAttribute("href");
              e.preventDefault(), (window.location.href = currentUrl);
            });
        });
      }
      try {
        var allRec = document.getElementById("allrecords"),
          allRecCookie = allRec
            ? allRec.getAttribute("data-hutor-cookie")
            : null;
        (allRec && "no" === allRecCookie) || hutor.saveUTM();
      } catch (e) {}
      var records = document.querySelectorAll(".r");
      function linkClickCreateEvent(e) {
        var targetEl =
          e.target.closest("a.js-click-stat") ||
          e.target.closest(".js-click-zero-stat");
        if (e.target && targetEl) {
          var virtPage = targetEl.getAttribute("data-hutor-event-name"),
            virtTitle = targetEl.textContent,
            url = targetEl.getAttribute("href") || "",
            target = targetEl.getAttribute("target");
          if (!virtPage) {
            var record = targetEl.closest(".r"),
              recordId;
            virtPage =
              "/hutor/click/" +
              (record ? record.getAttribute("id") : "") +
              "/?url=" +
              url;
          }
          if (
            (hutor.sendEventToStatistics(virtPage, virtTitle),
            "http" === url.substring(0, 4) &&
              -1 === url.indexOf(".typeform.com/"))
          )
            return (
              window.setTimeout(
                function () {
                  window.open(url, "_blank" === target ? "_blank" : "_self");
                },
                "_blank" === target ? 0 : 300
              ),
              e.preventDefault(),
              !1
            );
        }
      }
      Array.prototype.forEach.call(records, function (record) {
        record.removeEventListener("click", linkClickCreateEvent),
          record.addEventListener("click", linkClickCreateEvent);
      });
      var inputsAmount = document.querySelectorAll("input.js-amount");
      Array.prototype.forEach.call(inputsAmount, function (inputAmount) {
        var price = inputAmount.value;
        (price = price.replace(/,/g, ".")),
          (price = parseFloat(price.replace(/[^0-9\.]/g, ""))),
          (inputAmount.value = price);
      });
    }
    (hutor.sendEcommerceEvent = function (type, productsArr) {
      if (void 0 === productsArr || 0 === productsArr.length) return !1;
      if (
        void 0 === type ||
        ("add" !== type &&
          "remove" !== type &&
          "purchase" !== type &&
          "detail" !== type)
      )
        return !1;
      for (
        var virtPage,
          virtTitle = "",
          virtPrice = 0,
          virtProducts = [],
          variant_str,
          productObj,
          recid = "",
          uid = "",
          lid = "",
          i = 0;
        i < productsArr.length;
        i++
      ) {
        virtTitle > "" && (virtTitle += ", "),
          (virtTitle += (productObj = productsArr[i]).name),
          (virtPrice += productObj.price),
          (variant_str = ""),
          void 0 !== productObj.options &&
            productObj.options.length > 0 &&
            Array.prototype.forEach.call(productObj.options, function (option) {
              variant_str += option.option + ": " + option.variant + "; ";
            });
        var virtProduct = {
          name: productObj.name,
          price: productObj.price,
          variant: variant_str,
          quantity: 1,
        };
        productObj.id &&
          productObj.id > 0 &&
          ((id = productObj.id), (virtProduct.id = productObj.id)),
          productObj.uid &&
            productObj.uid > 0 &&
            ((uid = productObj.uid), (virtProduct.uid = productObj.uid)),
          productObj.recid &&
            productObj.recid > 0 &&
            ((recid = productObj.recid),
            (virtProduct.recid = productObj.recid)),
          productObj.lid &&
            productObj.lid > 0 &&
            ((lid = productObj.lid), (virtProduct.lid = productObj.lid)),
          productObj.sku &&
            productObj.sku > 0 &&
            (virtProduct.sku = productObj.sku),
          (virtProducts[virtProducts.length] = virtProduct);
      }
      var virtProduct;
      ("add" !== type && "remove" !== type) ||
        ((virtPage = "/hutor/cart/" + type + "/"),
        recid > 0 && (virtPage += "" + recid),
        uid > 0
          ? (virtPage += "-u" + uid)
          : lid > 0 && (virtPage += "-" + lid)),
        "detail" === type &&
          ((virtPage = "/hutor/product/detail/"),
          uid > 0
            ? (virtPage += uid + "/")
            : (recid > 0 && (virtPage += "r" + recid),
              lid > 0 && (virtPage += "-l" + lid))),
        "purchase" === type && (virtPage = "/hutor/rec" + recid + "/payment/"),
        ((virtProduct = { ecommerce: {} }).ecommerce[type] = {
          products: virtProducts,
        }),
        hutor.sendEventToStatistics(
          virtPage,
          virtTitle,
          virtProduct,
          virtPrice
        );
    }),
      (hutor.sendEventToStatistics = function (
        virtPage,
        virtTitle,
        referer,
        price
      ) {
        var isVirtPage = "/" === virtPage.substring(0, 1),
          products = [],
          allRec,
          allRecFbSendEvent;
        (allRec = document.getElementById("allrecords")) &&
          (allRecFbSendEvent =
            null !== allRec.getAttribute("data-fb-event")
              ? allRec.getAttribute("data-fb-event")
              : window.jQuery &&
                void 0 !== jQuery("#allrecords").data("fb-event")
              ? jQuery("#allrecords").data("fb-event")
              : null);
        var noFbSendEvent = !(
            !allRecFbSendEvent || "nosend" !== allRecFbSendEvent
          ),
          allRecVkSendEvent = allRec
            ? allRec.getAttribute("data-vk-event")
            : null;
        allRec &&
          (allRecVkSendEvent =
            null !== allRec.getAttribute("data-vk-event")
              ? allRec.getAttribute("data-vk-event")
              : window.jQuery &&
                void 0 !== jQuery("#allrecords").data("vk-event")
              ? jQuery("#allrecords").data("vk-event")
              : null);
        var noVkSendEvent = !(
            !allRecVkSendEvent || "nosend" !== allRecVkSendEvent
          ),
          currencyCode = "",
          curBlock = document.querySelector(".t706");
        if (
          ((currencyCode = allRec.getAttribute("data-hutor-currency")
            ? allRec.getAttribute("data-hutor-currency")
            : curBlock && curBlock.getAttribute("data-project-currency-code")
            ? curBlock.getAttribute("data-project-currency-code")
            : "RUB"),
          referer || (referer = window.location.href),
          (price = price ? parseFloat(price) : 0) > 0)
        )
          if (
            (window.dataLayer || (window.dataLayer = []),
            -1 !== virtPage.indexOf("/hutor/") &&
              -1 !== virtPage.indexOf("/payment/") &&
              window.hutorForm &&
              window.hutorForm.orderIdForStat > "")
          )
            (referer = {
              ecommerce: {
                purchase: {
                  actionField: {
                    id: window.hutorForm.orderIdForStat,
                    revenue: window.hutorForm.amountForStat,
                  },
                  products: window.hutorForm.arProductsForStat,
                },
              },
            }),
              window.hutorForm.hutorpayment &&
                window.hutorForm.hutorpayment.promocode &&
                (referer.ecommerce.purchase.actionField.coupon =
                  window.hutorForm.hutorpayment.promocode),
              (referer.event = "purchase");
          else if (
            referer &&
            referer.ecommerce &&
            (referer.ecommerce.add && referer.ecommerce.add.products
              ? (products = referer.ecommerce.add.products)
              : referer.ecommerce.remove && referer.ecommerce.remove.products
              ? (products = referer.ecommerce.remove.products)
              : referer.ecommerce.detail &&
                referer.ecommerce.detail.products &&
                (products = referer.ecommerce.detail.products),
            products && products.length > 0)
          ) {
            for (var p = 0; p < products.length; p++)
              products[p].id ||
                (products[p].sku
                  ? (products[p].id = products[p].sku)
                  : products[p].uid
                  ? (products[p].id = products[p].uid)
                  : products[p].recid &&
                    products[p].lid &&
                    (products[p].id =
                      products[p].recid + "_" + products[p].lid));
            referer.ecommerce.add && referer.ecommerce.add.products
              ? ((referer.ecommerce.add.products = products),
                (referer.event = "addToCart"))
              : referer.ecommerce.remove && referer.ecommerce.remove.products
              ? ((referer.ecommerce.remove.products = products),
                (referer.event = "removeFromCart"))
              : referer.ecommerce.detail && referer.ecommerce.detail.products
              ? ((referer.ecommerce.detail.products = products),
                (referer.event = "viewProduct"))
              : (isVirtPage
                  ? ((referer.event = "pageView"),
                    (referer.eventAction = virtPage))
                  : (referer.event = virtPage),
                (referer.title = virtTitle),
                (referer.value = price));
          }
        void 0 !== window.dataLayer &&
          (isVirtPage
            ? price > 0
              ? referer && referer.ecommerce
                ? window.dataLayer.push(referer)
                : window.dataLayer.push({
                    event: "pageView",
                    eventAction: virtPage,
                    title: virtTitle,
                    value: price,
                    product: referer,
                  })
              : window.dataLayer.push({
                  event: "pageView",
                  eventAction: virtPage,
                  title: virtTitle,
                  referer: referer,
                })
            : referer && referer.ecommerce
            ? window.dataLayer.push(referer)
            : window.dataLayer.push({
                event: virtPage,
                eventAction: virtTitle,
                value: price,
                referer: referer,
              }));
        try {
          var isOldCounter;
          if (window.gtagTrackerID && "gtag" === window.mainTracker)
            if (isVirtPage)
              if (referer && referer.event)
                if ("purchase" === referer.event) {
                  for (
                    var products = referer.ecommerce.purchase.products,
                      delivery = 0,
                      i = 0;
                    i < products.length;
                    i++
                  )
                    if ("delivery" === products[i].id) {
                      delivery = products[i];
                      break;
                    }
                  gtag("event", "purchase", {
                    transaction_id: referer.ecommerce.purchase.actionField.id,
                    value: parseFloat(price).toFixed(2),
                    currency: currencyCode,
                    shipping: delivery,
                    items: referer.ecommerce.purchase.products,
                  });
                } else
                  "addToCart" === referer.event && referer.ecommerce.add
                    ? gtag("event", "add_to_cart", {
                        items: referer.ecommerce.add.products,
                      })
                    : "removeFromCart" === referer.event &&
                      referer.ecommerce.remove
                    ? gtag("event", "remove_from_cart", {
                        items: referer.ecommerce.remove.products,
                      })
                    : "viewProduct" === referer.event &&
                      referer.ecommerce.detail &&
                      gtag("event", "view_item", {
                        items: referer.ecommerce.detail.products,
                      });
              else
                !!window.gtagTrackerID &&
                -1 !== window.gtagTrackerID.indexOf("UA-")
                  ? gtag("config", window.gtagTrackerID, {
                      page_title: virtTitle,
                      page_path: virtPage,
                    })
                  : gtag("event", window.gtagTrackerID, {
                      page_title: virtTitle,
                      page_path: virtPage,
                      send_to: window.gtagTrackerID,
                    });
            else
              gtag("event", virtPage, {
                event_category: "hutor",
                event_label: virtTitle,
                value: price,
              });
        } catch (e) {}
        if (
          window.ga &&
          "hutor" !== window.mainTracker &&
          "gtag" !== window.mainTracker
        )
          if (isVirtPage)
            if (referer && referer.event) {
              try {
                if (
                  (window.hutor.isLoadGAEcommerce ||
                    ((window.hutor.isLoadGAEcommerce = !0),
                    ga("require", "ec")),
                  ga("set", "currencyCode", currencyCode),
                  "purchase" === referer.event)
                ) {
                  for (
                    var product,
                      iProduct = referer.ecommerce.purchase.products.length,
                      i = 0;
                    i < iProduct;
                    i++
                  )
                    (product = referer.ecommerce.purchase.products[i]),
                      ga("ec:addProduct", {
                        id: product.id || i,
                        name: product.name,
                        price: parseFloat(product.price).toFixed(2),
                        quantity: product.quantity,
                      });
                  ga("ec:setAction", "purchase", {
                    id: referer.ecommerce.purchase.actionField.id,
                    revenue: parseFloat(price).toFixed(2),
                  });
                } else if (
                  "addToCart" === referer.event &&
                  referer.ecommerce.add
                ) {
                  for (
                    var product,
                      iProduct = referer.ecommerce.add.products.length,
                      i = 0;
                    i < iProduct;
                    i++
                  )
                    (product = referer.ecommerce.add.products[i]),
                      ga("ec:addProduct", {
                        id: product.id || i,
                        name: product.name,
                        price: parseFloat(product.price).toFixed(2),
                        quantity: product.quantity,
                      });
                  ga("ec:setAction", "add");
                } else if (
                  "removeFromCart" === referer.event &&
                  referer.ecommerce.remove
                ) {
                  for (
                    var product,
                      iProduct = referer.ecommerce.remove.products.length,
                      i = 0;
                    i < iProduct;
                    i++
                  )
                    (product = referer.ecommerce.remove.products[i]),
                      ga("ec:addProduct", {
                        id: product.id || i,
                        name: product.name,
                        price: parseFloat(product.price).toFixed(2),
                        quantity: product.quantity,
                      });
                  ga("ec:setAction", "remove");
                } else if (
                  "viewProduct" === referer.event &&
                  referer.ecommerce.detail
                ) {
                  for (
                    var product,
                      iProduct = referer.ecommerce.detail.products.length,
                      i = 0;
                    i < iProduct;
                    i++
                  )
                    (product = referer.ecommerce.detail.products[i]),
                      ga("ec:addProduct", {
                        id: product.id || i,
                        name: product.name,
                        price: parseFloat(product.price).toFixed(2),
                        quantity: product.quantity,
                      });
                  ga("ec:setAction", "detail");
                }
              } catch (e) {}
              ga("send", {
                hitType: "pageview",
                page: virtPage,
                title: virtTitle,
                params: referer,
              });
            } else
              ga("send", {
                hitType: "pageview",
                page: virtPage,
                title: virtTitle,
              });
          else
            ga("send", {
              hitType: "event",
              eventCategory: "hutor",
              eventAction: virtPage,
              eventLabel: virtTitle,
              eventValue: price,
            });
        if (
          window.mainMetrikaId &&
          window.mainMetrikaId > 0 &&
          "function" == typeof ym
        )
          if (isVirtPage) {
            var mOpts = { title: virtTitle };
            price > 0
              ? ((mOpts.params = { order_price: price }),
                currencyCode && (mOpts.params.currency = currencyCode),
                ym(window.mainMetrikaId, "hit", virtPage, mOpts))
              : ym(window.mainMetrikaId, "hit", virtPage, mOpts);
          } else
            price > 0
              ? ((mOpts = { order_price: price }),
                currencyCode && (mOpts.currency = currencyCode),
                ym(window.mainMetrikaId, "reachGoal", virtPage, mOpts))
              : ym(window.mainMetrikaId, "reachGoal", virtPage);
        if (
          (window.mainMetrika > "" &&
            window[window.mainMetrika] &&
            (isVirtPage
              ? price > 0
                ? window[window.mainMetrika].hit(virtPage, {
                    title: virtTitle,
                    order_price: price,
                    params: referer,
                  })
                : window[window.mainMetrika].hit(virtPage, { title: virtTitle })
              : price > 0
              ? window[window.mainMetrika].reachGoal(virtPage, {
                  title: virtTitle,
                  params: referer,
                  order_price: price,
                })
              : window[window.mainMetrika].reachGoal(virtPage, {
                  title: virtTitle,
                  referer: referer,
                })),
          void 0 !== window.fbq && !1 === noFbSendEvent)
        )
          try {
            if (isVirtPage)
              if (
                -1 === virtPage.indexOf("hutor/") ||
                (-1 === virtPage.indexOf("/payment/") &&
                  -1 === virtPage.indexOf("/submitted/"))
              )
                if (referer && referer.event && price > 0)
                  if ("addToCart" === referer.event && referer.ecommerce.add) {
                    for (
                      var product,
                        iProduct = referer.ecommerce.add.products.length,
                        content_ids = [],
                        i = 0;
                      i < iProduct;
                      i++
                    )
                      (product = referer.ecommerce.add.products[i]),
                        content_ids.push(
                          product.id || product.uid || product.name
                        );
                    window.fbq("track", "AddToCart", {
                      content_ids: content_ids,
                      content_type: "product",
                      value: price,
                      currency: currencyCode,
                    });
                  } else if (
                    "viewProduct" === referer.event &&
                    referer.ecommerce.detail
                  ) {
                    for (
                      var product,
                        iProduct = referer.ecommerce.detail.products.length,
                        content_ids = [],
                        i = 0;
                      i < iProduct;
                      i++
                    )
                      (product = referer.ecommerce.detail.products[i]),
                        content_ids.push(
                          product.id || product.uid || product.name
                        );
                    window.fbq("track", "ViewContent", {
                      content_ids: content_ids,
                      content_type: "product",
                      value: price,
                      currency: currencyCode,
                    });
                  } else
                    virtPage.indexOf("hutor/popup"),
                      window.fbq("track", "ViewContent", {
                        content_name: virtTitle,
                        content_category: virtPage,
                      });
                else
                  virtPage.indexOf("hutor/popup"),
                    window.fbq("track", "ViewContent", {
                      content_name: virtTitle,
                      content_category: virtPage,
                    });
              else
                price > 0 && currencyCode
                  ? window.fbq("track", "InitiateCheckout", {
                      content_name: virtTitle,
                      content_category: virtPage,
                      value: price,
                      currency: currencyCode,
                    })
                  : window.fbq("track", "Lead", {
                      content_name: virtTitle,
                      content_category: virtPage,
                    });
            else
              window.fbq("track", virtPage, {
                content_name: virtTitle,
                value: price,
              });
          } catch (e) {}
        if (
          void 0 !== window.VK &&
          void 0 !== window.VK.Retargeting &&
          !1 === noVkSendEvent
        )
          try {
            if (isVirtPage) {
              var allRec,
                vkPriceListId = (allRec = document.getElementById("allrecords"))
                  ? allRec.getAttribute("data-vk-price-list-id")
                  : null,
                priceListID = (vkPriceListId && parseInt(vkPriceListId)) || 0,
                eventName = "",
                eventParams = !1,
                tmp,
                tmp,
                tmp,
                tmp,
                tmp;
              if (referer && referer.event)
                if (
                  ((eventParams = {
                    products: [],
                    currency_code: "",
                    total_price: 0,
                  }),
                  "purchase" === referer.event && referer.ecommerce.purchase)
                )
                  if (price > 0 && priceListID > 0) {
                    var product;
                    eventParams.currency_code = currencyCode;
                    for (
                      var iProduct = referer.ecommerce.purchase.products.length,
                        content_ids = [],
                        i = 0;
                      i < iProduct;
                      i++
                    )
                      (product = referer.ecommerce.purchase.products[i]),
                        eventParams.products.push({
                          id: product.id || product.uid || product.name,
                          price: product.price ? product.price : 0,
                        }),
                        (eventParams.total_price = price);
                    eventName = "init_checkout";
                  } else eventName = "t-purchase";
                else if ("addToCart" === referer.event && referer.ecommerce.add)
                  if (price > 0 && priceListID > 0) {
                    var product;
                    eventParams.currency_code = currencyCode;
                    for (
                      var iProduct = referer.ecommerce.add.products.length,
                        content_ids = [],
                        i = 0;
                      i < iProduct;
                      i++
                    )
                      (product = referer.ecommerce.add.products[i]),
                        eventParams.products.push({
                          id: product.id || product.uid || product.name,
                          price: product.price ? product.price : 0,
                        }),
                        (eventParams.total_price = price);
                    eventName = "add_to_cart";
                  } else
                    (eventName = "t-add-to-cart"),
                      referer.ecommerce.add[0] &&
                        referer.ecommerce.add[0].uid &&
                        (eventName += "-" + referer.ecommerce.add[0].uid);
                else if (
                  "viewProduct" === referer.event &&
                  referer.ecommerce.detail
                )
                  if (price > 0 && priceListID > 0) {
                    var product;
                    eventParams.currency_code = currencyCode;
                    for (
                      var iProduct = referer.ecommerce.detail.products.length,
                        content_ids = [],
                        i = 0;
                      i < iProduct;
                      i++
                    )
                      (product = referer.ecommerce.detail.products[i]),
                        eventParams.products.push({
                          id: product.id || product.uid || product.name,
                          price: product.price ? product.price : 0,
                        }),
                        (eventParams.total_price = price);
                    eventName = "view_product";
                  } else
                    (eventName = "t-view-product"),
                      referer.ecommerce.detail[0] &&
                        referer.ecommerce.detail[0].uid &&
                        (eventName += "-" + referer.ecommerce.detail[0].uid);
                else if (
                  "removeFromCart" === referer.event &&
                  referer.ecommerce.remmove
                )
                  if (price > 0 && priceListID > 0) {
                    var product;
                    eventParams.currency_code = currencyCode;
                    for (
                      var iProduct = referer.ecommerce.remove.products.length,
                        content_ids = [],
                        i = 0;
                      i < iProduct;
                      i++
                    )
                      (product = referer.ecommerce.remove.products[i]),
                        eventParams.products.push({
                          id: product.id || product.uid || product.name,
                          price: product.price ? product.price : 0,
                        }),
                        (eventParams.total_price = price);
                    eventName = "remove_from_cart";
                  } else
                    (eventName = "t-remove-product"),
                      referer.ecommerce.remove[0] &&
                        referer.ecommerce.remove[0].uid &&
                        (eventName += "-" + referer.ecommerce.remove[0].uid);
                else eventName = referer.event;
              else if (
                -1 !== virtPage.indexOf("hutor/") &&
                -1 !== virtPage.indexOf("/payment/")
              )
                eventName =
                  "t-purchase-" +
                  (tmp = (tmp = (tmp = virtPage.replace("/hutor/", "")).replace(
                    "hutor/",
                    ""
                  )).replace("/payment/", ""));
              else if (
                -1 !== virtPage.indexOf("hutor/") &&
                -1 !== virtPage.indexOf("/submitted/")
              )
                eventName =
                  "t-lead-" +
                  (tmp = (tmp = (tmp = virtPage.replace("/hutor/", "")).replace(
                    "hutor/",
                    ""
                  )).replace("/submitted/", ""));
              else if (-1 !== virtPage.indexOf("hutor/popup"))
                eventName =
                  "t-" +
                  (tmp = (tmp = virtPage.replace("/hutor/", "")).replace(
                    "/",
                    "-"
                  ));
              else if (-1 !== virtPage.indexOf("hutor/click"))
                eventName =
                  "t-" +
                  (tmp = (tmp = virtPage.replace("/hutor/", "")).replace(
                    "/",
                    "-"
                  ));
              else eventName = "t-" + (tmp = virtPage.replace("/", "-"));
              priceListID > 0 && eventParams && eventParams.currency_code
                ? (VK.Retargeting.Event("purchase"),
                  VK.Retargeting.ProductEvent(
                    priceListID,
                    eventName,
                    eventParams
                  ))
                : (VK.Retargeting.Event(eventName),
                  "t-purchase" === eventName.substring(0, 10)
                    ? VK.Goal("purchase")
                    : "t-lead" === eventName.substring(0, 6) &&
                      VK.Goal("lead"));
            } else VK.Retargeting.Event(virtPage);
          } catch (e) {}
        if (window.mainMailruId > "0") {
          var _tmr = window._tmr || (window._tmr = []);
          isVirtPage
            ? price > 0
              ? _tmr.push({
                  id: "" + window.mainMailruId,
                  type: "pageView",
                  url: virtPage,
                  value: price,
                  start: new Date().getTime(),
                })
              : _tmr.push({
                  id: "" + window.mainMailruId,
                  type: "pageView",
                  url: virtPage,
                  start: new Date().getTime(),
                })
            : price > 0
            ? _tmr.push({
                id: "" + window.mainMailruId,
                type: "reachGoal",
                goal: virtPage,
                value: price,
              })
            : _tmr.push({
                id: "" + window.mainMailruId,
                type: "reachGoal",
                goal: virtPage,
              });
        }
        "function" == typeof window.hutorstat &&
          (isVirtPage
            ? (virtPage.indexOf("payment") > 0 &&
                virtPage.indexOf("hutor/form") > -1 &&
                (virtPage = virtPage.replace("hutor/form", "hutor/rec")),
              window.hutorstat("pageview", { page: virtPage }))
            : window.hutorstat("pageview", {
                page: "/hutor/event/" + virtPage,
              }));
      }),
      (hutor.saveUTM = function () {
        try {
          var hutorPageURL = window.location.href,
            hutorPageQuery = "",
            hutorPageUTM = "";
          if (
            -1 !== hutorPageURL.toLowerCase().indexOf("utm_") &&
            "string" ==
              typeof (hutorPageQuery = (hutorPageQuery = (hutorPageURL =
                hutorPageURL.toLowerCase()).split("?"))[1])
          ) {
            var arPair,
              arParams = hutorPageQuery.split("&");
            for (var i in arParams)
              "amp;" === (arPair = arParams[i].split("="))[0].substring(0, 4) &&
                (arPair[0] = arPair[0].substring(4)),
                "utm_" === arPair[0].substring(0, 4) &&
                  (hutorPageUTM = hutorPageUTM + arParams[i] + "|||");
            if (hutorPageUTM.length > 0) {
              var date = new Date();
              date.setDate(date.getDate() + 30),
                (document.cookie =
                  "hutorUTM=" +
                  encodeURIComponent(hutorPageUTM) +
                  "; path=/; expires=" +
                  date.toUTCString());
            }
          }
        } catch (err) {}
      }),
      "loading" !== document.readyState
        ? t_events__initEvent()
        : document.addEventListener("DOMContentLoaded", t_events__initEvent);
  })(),
  Element.prototype.matches ||
    (Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.oMatchesSelector),
  Element.prototype.closest ||
    (Element.prototype.closest = function (s) {
      for (var el = this; el && 1 === el.nodeType; ) {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
      }
      return null;
    });
