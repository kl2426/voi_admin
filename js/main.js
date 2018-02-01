'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window','opCookie','httpService','globalFn','$rootScope','$state','toaster','$modal','$location',
    function(              $scope,   $translate,   $localStorage,   $window,opCookie,httpService, globalFn ,$rootScope,$state,toaster,$modal,$location) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: '透明计算管理系统',
        version: 'X 1.0.0',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        },
        //   nav
        nav:[],
        //   userInfo  用户登录数据
        user_info:{},
        //   系统是否注册 0 未注册   1  已注册 
        registerd:0,
        //   是否进入部署模式  0  1已进入
        deployOn:0
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }
      
      //   取nav
      $scope.getNav = function(){
      	//if(opCookie.getCookie('access_token')){
      	if(1){
	      	//
					httpService.ajaxGet('json/menu.json')
					.then(function(data) {
						console.log(data)
						//if(data.status == 200){
						if(1){
							var temp_nav = data.data;
							//   组合code
							if(temp_nav.length > 0){
								globalFn.dg_tree(temp_nav,function(item){
									item.fucecode_router = item.fucecode.split('-').join('.').toLowerCase();
								})
								$scope.app.nav = temp_nav;
								console.log(temp_nav)
							}else{
								$scope.app.nav = [];
							}
						}else{
							//$scope.authError = 'Email or Password not right';
						}
					}, function(x) {
						console.log(x)
						$scope.authError = 'Server Error';
					});
	      }
      }
      
      
      
      
      //   取用户信息
      $scope.getUserInfo = function(){
      	if(opCookie.getCookie('access_token')){
	      	//
					httpService.ajaxGet('json/user_info.json')
					.then(function(data) {
						console.log(data)
						//if(data.status == 200){
						if(1){
							$scope.app.user_info = data;
							opCookie.setCookie('user_info',escape(JSON.stringify($scope.app.user_info)),24*60*60);
						}else{
							//$scope.authError = 'Email or Password not right';
						}
					});
	      }
      }
      
      
      
      
      /**
       * 退出
       */
      $scope.outlogin = function(){
				var modalInstance = $modal.open({
					templateUrl: 'tpl/modal/server/modal_alert.html',
					controller: 'modalAlertCtrl',
					windowClass: 'm-modal-alert',
					size: 'sm',
					resolve: {
						items: function() {
							return {'title':'确定要退出吗？'};
						},
						deps: ['$ocLazyLoad',
	            function( $ocLazyLoad ){
             		return $ocLazyLoad.load(['js/controllers/modal/server.js']);
	            }
	          ]
					}
				});
		
				modalInstance.result.then(function(bol) {
					if(bol){
						$state.go('access.signin');
					}
				}, function() {
					//console.log('Modal dismissed at: ' + new Date());
				});
			}
      
      
      
      
      
      /**
			 * 查询系统状态
			 */
			var sysStatus = function(cb) {
				httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/sysStatus')
					.then(function(res) {
						if(res.status == 200 && res.data.retCode == 0) {
							//   系统是否注册
							$scope.app.registerd = res.data.registerd;
							//   部署模式
							$scope.app.deployOn = res.data.deployOn ? res.data.deployOn : 0;
							typeof cb == "function" && cb(res.data);
						} else {
							// $scope.table_data.grp_items = [];
						}
					});
			}
      
      
      /**
       * alerts
       */
      $scope.alerts = [
	//	      { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
	//	      {type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.'},
	//	      { type: 'info', msg: 'Heads up! This alert needs your attention, but it is not super important.' },
	//	      { type: 'warning', msg: 'Warning! Best check yo self, you are not looking too good...' }
	    ];
	    $scope.addAlert = function(type,msg) {
	      $scope.alerts.push({type: type ? type : 'danger', msg: msg ? msg : ''});
	    };
	
	    $scope.closeAlert = function(index) {
	      $scope.alerts.splice(index, 1);
	    };
      
      
      //  ========================= 定时器 =============================
			$scope.setglobaldata = {
				timedatalist: [], //定时器数组
				timer: { //定时器模板对象
					interval: null,
					Key: "", //定义的名称
					keyctrl: "", //定义所属的控制器
					fnStopAutoRefresh: function() {}, //定义开关的关闭
					fnAutoRefresh: function() {}, //定义开关的打开
					fnStopAutoRefreshfn: function(tm, fn) {
						tm.fnStopAutoRefresh();
					}, //定义开关的关闭方法
					fnAutoRefreshfn: function(tm) {
						if(tm.keyctrl != $state.current.name) {
							tm.fnStopAutoRefresh();
						} else {
							if(tm.interval == null) {
								tm.fnAutoRefresh();
							}
						}
					}
				},
				addtimer: function(t) { //将数据加入到定时器数组
					var isadd = true;
					for(var i = 0; i < $scope.setglobaldata.timedatalist.length; i++) {
						if($scope.setglobaldata.timedatalist[i].Key == t.key) {
							$scope.setglobaldata.timedatalist[i].fnStopAutoRefresh(); //先关闭定时器
							$scope.setglobaldata.timedatalist.splice(i, 1); //移除对象
						}
					}
					if(isadd) {
						$scope.setglobaldata.timedatalist.push(t);
					}
				},
				gettimer: function(key) { //获取对象
					var temp_timer = null;
					for(var i = 0; i < $scope.setglobaldata.timedatalist.length; i++) {
						if($scope.setglobaldata.timedatalist[i].Key == key) {
							//temp_timer = $scope.setglobaldata.timedatalist[i];
							$scope.setglobaldata.timedatalist[i].fnStopAutoRefresh(); //先关闭定时器
							$scope.setglobaldata.timedatalist.splice(i, 1); //移除对象
							break;
						}
					}
					//return temp_timer ? temp_timer : angular.copy($scope.setglobaldata.timer);
					return angular.copy($scope.setglobaldata.timer);
				}
			};
			//console.log($state.current.name);
			//   监听离开页面取消定时器
			$rootScope.$on('$stateChangeSuccess',
				function(event, toState, toParams, fromState, fromParams) {
					for(var indextm = 0; indextm < $scope.setglobaldata.timedatalist.length; indextm++) {
						if($scope.setglobaldata.timedatalist[indextm].keyctrl == toState.name) {
							$scope.setglobaldata.timedatalist[indextm].fnAutoRefresh();
						} else {
							$scope.setglobaldata.timedatalist[indextm].fnStopAutoRefresh();
						}
					}
					
					// 未注册 时只能打开server页
					console.log(toState.name);
					//   取系统状态
					sysStatus(function(data){
						//
					});
					
					
				}
			);
			//  ========================= /定时器 =============================
			
			
			
			/**
			 * 路由拦截
			 */
			$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
				if(toState.name.includes('app.') && $scope.app.registerd == 0 && toState.name != 'app.server'){
					//event.preventDefault();// 取消默认跳转行为
					//$state.go('app.server',{},{reload:true});
				}
			});
			
			
      
      //   run
      var run = function(){
      	//   取nav菜单
      	$scope.getNav();
      	//   取用户信息
      	//$scope.getUserInfo();
      	
      	//   用户信息
      	if(opCookie.getCookie('user_info')){
					$scope.app.user_info = JSON.parse(globalFn.tohanzi(opCookie.getCookie('user_info')));
				}else{
					$scope.app.user_info = {};
				}
				
				//   系统状态
				// sysStatus();
      }
      run();
      
      

  }]);