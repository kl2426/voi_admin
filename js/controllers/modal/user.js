'use strict';


/**
 * 添加用户
 */
app.controller('modalUserListAddCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance', function($scope,  globalFn, httpService,items,$modalInstance) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {}
	
	//   用户组
	$scope.groups = {}
	$scope.groups.items = [];
	$scope.groups.item = {};
	
	//   终端组
	$scope.terminals = {}
	$scope.terminals.items = [];
	$scope.terminals.item = {};
	
	
	//    取用户组
	var getUserGroups = function() {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getUserGroups')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.groups.items = res.data.groups;
					//  输入用户组
					for(var i in $scope.groups.items){
						if($scope.groups.items[i].id == $scope.form.gid){
							$scope.groups.item = $scope.groups.items[i];
						}
					}
				} else {
					$scope.groups.items = [];
				}
			});
	}
	
	
	
	
	
	
	
	
	
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		$modalInstance.close('ok');
	}
	
	
	//   run
	var run = function(){
		//
		angular.extend($scope.form, $scope.items.item);
		//  取用户组
		getUserGroups()
	}
	run();
}]);