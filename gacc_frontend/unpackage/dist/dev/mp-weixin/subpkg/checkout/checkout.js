(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["subpkg/checkout/checkout"],{

/***/ 101:
/*!******************************************************************************************!*\
  !*** D:/miniprogramdevelop/program/gacc/main.js?{"page":"subpkg%2Fcheckout%2Fcheckout"} ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _checkout = _interopRequireDefault(__webpack_require__(/*! ./subpkg/checkout/checkout.vue */ 102));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_checkout.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 102:
/*!***********************************************************************!*\
  !*** D:/miniprogramdevelop/program/gacc/subpkg/checkout/checkout.vue ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _checkout_vue_vue_type_template_id_77a7cfba_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./checkout.vue?vue&type=template&id=77a7cfba&scoped=true& */ 103);
/* harmony import */ var _checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./checkout.vue?vue&type=script&lang=js& */ 105);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _checkout_vue_vue_type_style_index_0_id_77a7cfba_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkout.vue?vue&type=style&index=0&id=77a7cfba&scoped=true&lang=css& */ 107);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _checkout_vue_vue_type_template_id_77a7cfba_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _checkout_vue_vue_type_template_id_77a7cfba_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "77a7cfba",
  null,
  false,
  _checkout_vue_vue_type_template_id_77a7cfba_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "subpkg/checkout/checkout.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 103:
/*!******************************************************************************************************************!*\
  !*** D:/miniprogramdevelop/program/gacc/subpkg/checkout/checkout.vue?vue&type=template&id=77a7cfba&scoped=true& ***!
  \******************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_template_id_77a7cfba_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./checkout.vue?vue&type=template&id=77a7cfba&scoped=true& */ 104);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_template_id_77a7cfba_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_template_id_77a7cfba_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_template_id_77a7cfba_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_template_id_77a7cfba_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 104:
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/miniprogramdevelop/program/gacc/subpkg/checkout/checkout.vue?vue&type=template&id=77a7cfba&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 105:
/*!************************************************************************************************!*\
  !*** D:/miniprogramdevelop/program/gacc/subpkg/checkout/checkout.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./checkout.vue?vue&type=script&lang=js& */ 106);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 106:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/miniprogramdevelop/program/gacc/subpkg/checkout/checkout.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 48));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 50));
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  data: function data() {
    return {
      items: [],
      // 从购物车传递过来的商品
      paymentMethods: [{
        name: '微信支付',
        value: 'wechat',
        icon: '/static/payment/wechat.png'
      }, {
        name: '支付宝',
        value: 'alipay',
        icon: '/static/payment/alipay.png'
      }, {
        name: '余额支付',
        value: 'balance',
        icon: '/static/payment/balance.png'
      }],
      selectedMethod: '',
      // 当前选中的支付方式
      orderData: [],
      // 存储生成的订单数据
      transactionData: [] // 存储生成的交易数据
    };
  },

  computed: {
    // 计算订单总金额
    totalAmount: function totalAmount() {
      return this.items.reduce(function (total, item) {
        return total + item.Price * item.Quantity;
      }, 0).toFixed(2);
    },
    // 获取选中的支付方式名称
    selectedMethodName: function selectedMethodName() {
      var _this = this;
      var method = this.paymentMethods.find(function (m) {
        return m.value === _this.selectedMethod;
      });
      return method ? method.name : '';
    }
  },
  onLoad: function onLoad(options) {
    // 从购物车页面接收传递的商品数据
    if (options.items) {
      this.items = JSON.parse(decodeURIComponent(options.items));
    }
  },
  methods: {
    // 生成订单和交易数据
    generateOrderData: function generateOrderData() {
      var _this2 = this;
      var timestamp = Date.now().toString(36) /* .slice(-6) */; // 时间戳取6位
      var randomStr = Math.random().toString(36).substr(2, 4); // 随机数取4位

      this.orderData = this.items.map(function (item) {
        // 截取ItemID后8位（如果长度>8），否则保留原ID
        var shortItemID = item.ItemID.length > 8 ? item.ItemID.slice(-8) : item.ItemID;
        return {
          OrderID: "ORD_".concat(timestamp, "_").concat(randomStr, "_").concat(shortItemID),
          ItemID: item.ItemID,
          // 原始ID保持不变
          Quantity: item.Quantity,
          OrderAmount: (item.Price * item.Quantity).toFixed(2),
          OrderTime: new Date().toISOString()
        };
      });
      this.transactionData = this.items.map(function (item) {
        var shortItemID = item.ItemID.length > 8 ? item.ItemID.slice(-8) : item.ItemID;
        return {
          TransactionID: "TRX_".concat(timestamp, "_").concat(randomStr, "_").concat(shortItemID),
          OrderID: "ORD_".concat(timestamp, "_").concat(randomStr, "_").concat(shortItemID),
          PaymentMethod: _this2.selectedMethod,
          TransactionTime: new Date().toISOString()
        };
      });
    },
    // 支付方式选择变化
    paymentMethodChange: function paymentMethodChange(e) {
      this.selectedMethod = e.detail.value;
    },
    // 确认支付按钮点击
    confirmPayment: function confirmPayment() {
      var _this3 = this;
      uni.showModal({
        title: '确认支付',
        content: "\u786E\u8BA4\u4F7F\u7528".concat(this.selectedMethodName, "\u652F\u4ED8 \xA5").concat(this.totalAmount, " \u5417\uFF1F"),
        success: function success(res) {
          if (res.confirm) {
            _this3.processPayment();
          } else if (res.cancel) {
            _this3.cancelPayment();
          }
        }
      });
    },
    // 处理支付逻辑
    processPayment: function processPayment() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var orderRes, transactionRes;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                uni.showLoading({
                  title: '支付处理中...'
                });
                _context.prev = 1;
                // 1. 生成订单数据
                _this4.generateOrderData();
                // 2. 批量创建订单
                _context.next = 5;
                return _this4.createOrders();
              case 5:
                orderRes = _context.sent;
                if (orderRes.success) {
                  _context.next = 8;
                  break;
                }
                throw new Error(orderRes.message || '创建订单失败');
              case 8:
                _context.next = 10;
                return _this4.createTransactions('成功');
              case 10:
                transactionRes = _context.sent;
                if (transactionRes.success) {
                  _context.next = 13;
                  break;
                }
                throw new Error(transactionRes.message || '创建交易记录失败');
              case 13:
                _context.next = 15;
                return _this4.clearPurchasedItems();
              case 15:
                uni.hideLoading();
                // 支付成功跳转到购物车列表页
                uni.switchTab({
                  url: '/pages/cart/cart'
                });
                uni.showToast({
                  title: '支付成功',
                  icon: 'success'
                });
                _context.next = 28;
                break;
              case 20:
                _context.prev = 20;
                _context.t0 = _context["catch"](1);
                uni.hideLoading();
                console.error('支付出错:', _context.t0);
                // 如果订单创建成功但交易失败，需要更新订单状态
                if (!(_this4.orderData.length > 0)) {
                  _context.next = 27;
                  break;
                }
                _context.next = 27;
                return _this4.updateOrdersStatus('支付失败');
              case 27:
                uni.showToast({
                  title: _context.t0.message || '支付失败',
                  icon: 'none'
                });
              case 28:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 20]]);
      }))();
    },
    // 批量创建订单
    createOrders: function createOrders() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var res, response;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return uni.request({
                  url: 'http://localhost:3000/orders/batch',
                  method: 'POST',
                  data: {
                    BuyerID: _this5.$globalData.userID,
                    Orders: _this5.orderData,
                    PaymentMethod: _this5.selectedMethod
                  }
                });
              case 3:
                res = _context2.sent;
                response = Array.isArray(res) ? res[1].data : res.data;
                return _context2.abrupt("return", response);
              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](0);
                console.error('创建订单出错:', _context2.t0);
                return _context2.abrupt("return", {
                  success: false,
                  message: '创建订单失败'
                });
              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 8]]);
      }))();
    },
    // 批量创建交易记录
    createTransactions: function createTransactions(status) {
      var _arguments = arguments,
        _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var reason, transactionStatus, res;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                reason = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : '';
                _context3.prev = 1;
                transactionStatus = status === '成功' ? '成功' : "\u5931\u8D25: ".concat(reason).substring(0, 50);
                _context3.next = 5;
                return uni.request({
                  url: 'http://localhost:3000/transactions/batch',
                  method: 'POST',
                  data: {
                    Transactions: _this6.transactionData.map(function (trx) {
                      return {
                        TransactionID: String(trx.TransactionID).substring(0, 50),
                        OrderID: String(trx.OrderID).substring(0, 50),
                        PaymentMethod: String(trx.PaymentMethod).substring(0, 20),
                        TransactionTime: new Date(trx.TransactionTime || new Date()).toISOString(),
                        TransactionStatus: transactionStatus
                      };
                    })
                  }
                });
              case 5:
                res = _context3.sent;
                if (res.data.success) {
                  _context3.next = 8;
                  break;
                }
                throw new Error(res.data.message || '创建交易记录失败');
              case 8:
                return _context3.abrupt("return", res.data);
              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](1);
                console.error('创建交易记录出错:', _context3.t0);
                throw _context3.t0;
              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 11]]);
      }))();
    },
    // 批量更新订单状态
    updateOrdersStatus: function updateOrdersStatus(status) {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return uni.request({
                  url: 'http://localhost:3000/orders/batch/status',
                  method: 'PUT',
                  data: {
                    OrderIDs: _this7.orderData.map(function (order) {
                      return order.OrderID;
                    }),
                    OrderStatus: status
                  }
                });
              case 3:
                _context4.next = 8;
                break;
              case 5:
                _context4.prev = 5;
                _context4.t0 = _context4["catch"](0);
                console.error('更新订单状态出错:', _context4.t0);
              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 5]]);
      }))();
    },
    // 清空购物车中已购买的商品
    clearPurchasedItems: function clearPurchasedItems() {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var itemIDs;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                itemIDs = _this8.items.map(function (item) {
                  return item.ItemID;
                });
                _context5.next = 4;
                return uni.request({
                  url: "http://localhost:3000/cart/clear-purchased/".concat(_this8.$globalData.userID),
                  method: 'POST',
                  data: {
                    itemIDs: itemIDs
                  }
                });
              case 4:
                _context5.next = 9;
                break;
              case 6:
                _context5.prev = 6;
                _context5.t0 = _context5["catch"](0);
                console.error('清空购物车商品出错:', _context5.t0);
              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 6]]);
      }))();
    },
    // 取消支付
    cancelPayment: function cancelPayment() {
      var _this9 = this;
      uni.showModal({
        title: '取消支付',
        content: '请输入取消支付的原因',
        editable: true,
        placeholderText: '请输入取消原因',
        success: function success(res) {
          if (res.confirm && res.content) {
            _this9.submitCancelReason(res.content);
          }
        }
      });
    },
    // 提交取消支付原因
    submitCancelReason: function submitCancelReason(reason) {
      var _this10 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var orderRes, transactionRes;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (reason) {
                  _context6.next = 3;
                  break;
                }
                uni.showToast({
                  title: '请填写取消原因',
                  icon: 'none'
                });
                return _context6.abrupt("return");
              case 3:
                uni.showLoading({
                  title: '处理中...'
                });
                _context6.prev = 4;
                // 1. 生成订单数据
                _this10.generateOrderData();
                // 2. 批量创建订单
                _context6.next = 8;
                return _this10.createOrders();
              case 8:
                orderRes = _context6.sent;
                if (orderRes.success) {
                  _context6.next = 11;
                  break;
                }
                throw new Error(orderRes.message || '创建订单失败');
              case 11:
                _context6.next = 13;
                return _this10.createTransactions('失败', reason);
              case 13:
                transactionRes = _context6.sent;
                if (transactionRes.success) {
                  _context6.next = 16;
                  break;
                }
                throw new Error(transactionRes.message || '创建交易记录失败');
              case 16:
                _context6.next = 18;
                return _this10.updateOrdersStatus('已取消');
              case 18:
                uni.hideLoading();
                // 返回购物车页面
                uni.navigateBack({
                  delta: 1
                });
                uni.showToast({
                  title: '已取消支付',
                  icon: 'none'
                });
                _context6.next = 28;
                break;
              case 23:
                _context6.prev = 23;
                _context6.t0 = _context6["catch"](4);
                uni.hideLoading();
                console.error('取消支付出错:', _context6.t0);
                uni.showToast({
                  title: _context6.t0.message || '取消支付失败',
                  icon: 'none'
                });
              case 28:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[4, 23]]);
      }))();
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 107:
/*!********************************************************************************************************************************!*\
  !*** D:/miniprogramdevelop/program/gacc/subpkg/checkout/checkout.vue?vue&type=style&index=0&id=77a7cfba&scoped=true&lang=css& ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_style_index_0_id_77a7cfba_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./checkout.vue?vue&type=style&index=0&id=77a7cfba&scoped=true&lang=css& */ 108);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_style_index_0_id_77a7cfba_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_style_index_0_id_77a7cfba_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_style_index_0_id_77a7cfba_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_style_index_0_id_77a7cfba_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_checkout_vue_vue_type_style_index_0_id_77a7cfba_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 108:
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/miniprogramdevelop/program/gacc/subpkg/checkout/checkout.vue?vue&type=style&index=0&id=77a7cfba&scoped=true&lang=css& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[101,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpkg/checkout/checkout.js.map