// 1.注册路由钩子 注册路由
// 2. 开始init 开始对路由与load的监听
// 3. load执行,获取url,在注册的路由里面匹配是否存在
// 4. 一旦寻找到就会开始refresh(),存在路由钩子就执行路由钩子的callback,并传入next()跳转方法
// 5. 在页面端的的路由前置钩子里面调用next() 页面的信息被替换

(function() {
  var utils = {
    getCurrentUrl() {
      let url = location.hash.split('#')[1];
      let [path, query] = url.split('?');
      return {
        path,
        query
      };
    }
  };
  function Router() {
    this.routers = {}; // 全部路由
    this.beforeRouter = null; // 跳转前的路由
    this.afterRouter = null; // 跳转后的路由
    this.$router = null; // 当前路由数据
  }
  // 初始化方法
  Router.prototype = {
    init: function() {
      window.SPA_PAGE = null;
      // 监听页面加载
      window.addEventListener('load', () => {
        this.changeRouter();
      });
      // 监听路由的切换
      window.addEventListener('hashchange', () => {
        this.changeRouter();
      });
    },
    // 路由改变的回调
    changeRouter() {
      const { path, query } = utils.getCurrentUrl();
      if (this.routers[path]) {
        this.refresh(path);
      } else {
        alert('失败,当前路由不存在');
      }
    },
    // 开始进行跳转
    refresh(path) {
      // 保存当前路由数据,暴露出去
      this.$router = path;
      if (this.beforeRouter) {
        // 用户使用了路由钩子
        this.beforeRouter({
          next: () => {
            this.routers[path].callback(path);
          }
        });
      } else {
        // 直接跳转
        this.routers[path].callback(path);
      }
    },
    // 前置路由钩子
    beforeEach(callback) {
      // 存储回调函数
      if (typeof callback == 'function') {
        this.beforeRouter = callback;
      }
    },
    // 后置路由钩子
    afterEach(callback) {
      if (typeof callback == 'function') {
        this.afterRouter = callback;
      }
    },
    // 配置跳转的页面(注册)
    set(path, callback) {
      this.routers[path] = {
        callback,
        fn: null
      };
    },
    // 同步
    sync(callback) {
      if (typeof callback == 'function') {
        this.afterRouter();
        callback();
      }
    },
    async(callback) {
      return new Promise((resolve, reject) => {
        try {
          var _body = document.getElementsByTagName('body')[0];
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = callback;
          script.async = true;
          script.onload = () => {
            console.log('异步加载' + callback + '完成');
            this.afterRouter();
            this.routers[this.$router].fn = SPA_PAGE;
            this.routers[this.$router].fn(this.$router);
            resolve();
          };
          _body.appendChild(script);
        } catch (error) {
          reject(error);
        }
      });
    }
  };

  window.Router = new Router();
})();
