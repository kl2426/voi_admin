// config

var app =
	angular.module('app')
	//
	.config(
		['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
			function($controllerProvider, $compileProvider, $filterProvider, $provide) {

				// lazy controller, directive and service
				app.controller = $controllerProvider.register;
				app.directive = $compileProvider.directive;
				app.filter = $filterProvider.register;
				app.factory = $provide.factory;
				app.service = $provide.service;
				app.constant = $provide.constant;
				app.value = $provide.value;
			}
		])
	.config(['$translateProvider', function($translateProvider) {
		// Register a loader for the static files
		// So, the module will search missing translation tables under the specified urls.
		// Those urls are [prefix][langKey][suffix].
		$translateProvider.useStaticFilesLoader({
			prefix: 'l10n/',
			suffix: '.js'
		});
		// Tell the module what language to use by default
		$translateProvider.preferredLanguage('en');
		// Tell the module to store the language in the local storage
		$translateProvider.useLocalStorage();
	}])

	.config(['$httpProvider', function($httpProvider) {
		//   HTTP拦截器
		$httpProvider.interceptors.push(['$rootScope', '$q', 'opCookie', '$injector', function($rootScope, $q, opCookie, $injector) {
			return {
				request: function(config) {
					// Header - Token
					config.headers = config.headers || {};
					if(opCookie.getCookie('token')) {
						config.headers['Authorization'] = opCookie.getCookie('token');
					} else {
						config.headers['Authorization'] = '';
					};

					return config;
				},

				response: function(response) {
					//console.log(response)
					//   invalid_token
					
					// Session has expired
					if(response.status == 200 && response.data.retCode == -1 && response.config.url.indexOf('#/access/signin') < 0 && response.data.msg == "用户未登录") {
						//    未登录  重新登录 重新发送请求
						//    删除token
						opCookie.clearCookie('token');
						//console.log(opCookie.getCookie('access_token'))
						
						
						//   是否有cookie用户信息   用于验证 超时跳转到登录页
						if(!opCookie.getCookie('user_info')){
							//   没有用户信息跳转到登录
							//debugger
							window.location.href = window.location.origin + window.location.pathname + '#/access/signin';
							return $q.reject(response);
						}else{
							//    重新取token
							var SessionService = $injector.get('SessionService');
							var $http = $injector.get('$http');
							var deferred = $q.defer();
							SessionService.readToken().then(deferred.resolve, deferred.reject);
							
							// When the session recovered, make the same backend call again and chain the request
							return deferred.promise.then(function(res) {
								if(res.data.retCode == 0){
									return $http(response.config);
								}else{
									return $q.reject(response);
								}
							});
						}

						// Create a new session (recover the session)
						// We use login method that logs the user in using the current credentials and
						// returns a promise
						

						
					}
//					//   刷新token失败
//					if(response.config.url.indexOf('/oauth/token?grant_type=refresh_token') >= 0 && response.data.error == 'invalid_token'){
//						window.location.href = '/#/access/signin';
//					}

					return response || $q.when(response);
				},

				responseError: function(response) {
//					// Session has expired
//					if(response.status == 401 && response.data.error == 'invalid_token') {
//
//						opCookie.clearCookie('access_token');
//						//console.log(opCookie.getCookie('access_token'))
//
//						var SessionService = $injector.get('SessionService');
//						var $http = $injector.get('$http');
//						var deferred = $q.defer();
//						
//						//   是否有cookie用户信息
//						if(!opCookie.getCookie('user_info')){
//							//   没有用户信息跳转到登录
//							window.location.href = '/#/access/signin';
//						}
//
//						// Create a new session (recover the session)
//						// We use login method that logs the user in using the current credentials and
//						// returns a promise
//						SessionService.readToken().then(deferred.resolve, deferred.reject);
//
//						// When the session recovered, make the same backend call again and chain the request
//						return deferred.promise.then(function() {
//							return $http(response.config);
//						});
//					}
//					//   刷新token失败
//					if(response.config.url.indexOf('/oauth/token?grant_type=refresh_token') >= 0 && response.data.error == 'invalid_token'){
//						window.location.href = '/#/access/signin';
//					}
					return $q.reject(response);
				}
			}
		}])
	}])



app.factory('SessionService', ['$http', '$q', 'httpService','opCookie','globalFn', function($http, $q, httpService,opCookie,globalFn) {
	var user_info = {};
	if(opCookie.getCookie('user_info')){
		user_info = JSON.parse(globalFn.tohanzi(opCookie.getCookie('user_info')));
	}
	var sessionService = {};
	var differred = $q.defer();
	sessionService.readToken = function() {
		return $http({
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			url: httpService.API.origin + '/rest/ajax.php/login',
			data:$.param(user_info)
		})
		.success(function(res) {
			if(res.retCode == 0){
				//   重新登录成功
				opCookie.setCookie('token',res.token,2*60*60 - 300);
				
				differred.resolve(res);
				
			}else{
				//   重新登录失败
				differred.reject(res);
				window.location.href = window.location.origin + window.location.pathname + '#/access/signin';
			}
			//opCookie.setCookie('refresh_token',res.refresh_token,4*60*60);
			//console.log('Auth Success and token received: ' + JSON.stringify(res.data));

			// Extract the token details from the received JSON object
			//token = res.data;
			
			
			
		}, function(res) {
			console.log('Error occurred : ' + JSON.stringify(res));
			differred.reject(res);
		})
	};

	sessionService.getToken = function() {
		return token;
	};

	sessionService.isAnonymous = function() {
		if(token)
			return true;
		else
			return false;
	};

	return sessionService;
}])