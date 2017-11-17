'use strict';


/**
 * 服务输入许可证弹窗
 */
app.controller('modalServerNOCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance', function($scope,  globalFn, httpService,items,$modalInstance) {
	
	//   items
	$scope.items = items;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		$modalInstance.close('ok');
	}
	
	
	//   run
	var run = function(){
	}
	run();
	
	
}]);


/**
 * 开启部署模式 弹窗
 */
app.controller('modalServerAdminPwdCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance', function($scope,  globalFn, httpService,items,$modalInstance) {
	
	//   items
	$scope.items = items;
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		$modalInstance.close('ok');
	}
	
	
	//   run
	var run = function(){
	}
	run();
	
	
}]);



/**
 * 确认弹窗 弹窗
 */
app.controller('modalAlertCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance', function($scope,  globalFn, httpService,items,$modalInstance) {
	
	//   items
	$scope.items = items;
	
	//  
	$scope.title = "重启服务器？";
	
	$scope.title = $scope.items.title;
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		$modalInstance.close('ok');
	}
	
	
	//   run
	var run = function(){
	}
	run();
	
	
}]);



/**
 * 网络配置 弹窗
 */
app.controller('modalServerIpCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance', function($scope,  globalFn, httpService,items,$modalInstance) {
	
	//   items
	$scope.items = items;
	
	//  
	$scope.title = "重启服务器？";
	
	$scope.title = $scope.items.title;
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		$modalInstance.close('ok');
	}
	
	$scope.bindKeyUp = function(e){
		var that = $(e.target);
		//
		if(that.val().substr(-1) == '.' || that.val().length > 3){
			that.val(that.val().substr(0,that.val().length - 1));
			that.parent().next().find('input')[0].focus();
		}
		if(!(/^[0-9]*$/.test(that.val()))){
			that.val(that.val().substr(0,that.val().length - 1));
			return false;
		}
		
	}
	
	
	//   run
	var run = function(){
	}
	run();
	
	
}]);