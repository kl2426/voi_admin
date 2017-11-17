'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
      // Try to create
      $http.post('api/signup', {name: $scope.user.name, email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.authError = response;
        }else{
          $state.go('app.dashboard-v1');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
 ;


/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', 'httpService', '$state','opCookie','Md5','globalFn', function($scope, httpService, $state,opCookie,Md5,globalFn) {
	//   清空cookie
	opCookie.clearCookie('token');
	opCookie.clearCookie('user_info');
	
	//   登录有效期时间  默认8小时
	$scope.cookie_time = 8*60*60;
	
	
	$scope.user = {};
	$scope.authError = null;
	$scope.logining = true;
	$scope.login = function() {
		$scope.authError = null;
		$scope.logining = false;
		if($scope.user.checked_time){
			//   7天
			$scope.cookie_time = 7*24*60*60;
		}else{
			//   8小时
			$scope.cookie_time = 8*60*60;
		}
		// Try to login
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/login',{
			'user':$scope.user.user,
			'pwd':$scope.user.pwd
		})
			.then(function(data) {
				$scope.logining = true;
				if(data.status == 200 && data.data.retCode == 0){
					opCookie.setCookie('token',data.data.token,2*60*60 - 300);
					//   保存用户数据
					opCookie.setCookie('user_info',globalFn.tounicode(JSON.stringify($scope.user)),$scope.cookie_time);
					
					$scope.app.user_info = $scope.user;
					//$scope.getNav();
					//$scope.getUserInfo();
					$state.go('app.server');
				}else if(data.status === 0){
					$scope.authError = 'Server Error';
				}else{
					$scope.authError = '用户名或密码错误';
				}
			}, function(x) {
				$scope.logining = true;
				$scope.authError = 'Server Error';
			});
	};
	
	
	
	
}]);