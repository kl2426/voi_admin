'use strict';


/**
 * 用户管理
 */
app.controller('userCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal', function($scope, $timeout, globalFn, httpService, $modal) {
	console.log('用户管理')
}]);


/**
 * 用户管理 - 用户总览
 */
app.controller('userListCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal', function($scope, $timeout, globalFn, httpService, $modal) {

	/**
	 * 表格1
	 */
	$scope.table_data = {
		//   用户组
		user_items: [{
				title: '全部',
				val: ""
			},
			{
				title: '是',
				val: 1
			},
			{
				title: '不是',
				val: 0
			},
		],
		user_item: {
			title: '全部',
			val: ""
		},
		form: {
			key: "",
			page: 1,
			pageSize: 10,
			//sortname: "a.FUCECREATETIME",
			//sortorder: "desc"
		},
		//   表格数据
		table_res: {
			retCode: 0,
			//message: "ok",
			row: [],
			total: 2,
			//
			maxSize: 5
		},
		//   翻页
		pageChanged: function() {
			//  查询
			findFunctionList($scope.table_data.form);
		},
		//   每页显示多少条
		selectChanged: function() {
			findFunctionList($scope.table_data.form);
		}
	}
	
	
	/**
	 * 查询列表
	 */
	var findFunctionList = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/showUsers',form)
			.then(function(res) {
				console.log(res);
				if(res.status == 200 && res.data.retCode == 0) {
					angular.extend($scope.table_data.table_res, res.data);
					$scope.table_data.table_res.row = res.data.users;
					console.log($scope.table_data)
				} else {
					$scope.table_data.table_res.row = [];
				}
			});
	}
	
	

	/**
	 * 操作
	 */
	$scope.table_operate = function(str, item) {
		if(str == 'edit') {
			openAdd('edit',item);
		} else if(str == 'reset_pwd') {
			openAlert1(item);
		} else if(str == 'del') {
			openDel(item);
		}
	}

	/**
	 * 打开添加修改
	 */
	var openAdd = function(str, item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/user/list/modal_add.html',
			controller: 'modalUserListAddCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item
					};
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			//$scope.selected = selectedItem;
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}

	/**
	 * 打开添加修改
	 */
	var openRole = function(str, item, select_item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/xtgl/yhgl/cdgl/modal_role.html',
			controller: 'modalRoleXtglYhglCdglCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
						'select_item': select_item
					};
				},
				deps: ['uiLoad',
					function(uiLoad) {
						return uiLoad.load(['vendor/jquery/ztree/css/zTreeStyle.css', 'vendor/jquery/ztree/js/jquery.ztree.core.js', 'vendor/jquery/ztree/js/jquery.ztree.excheck.js', 'js/directives/ztree.js']);
					}
				]
			}
		});

		modalInstance.result.then(function(selectedItem) {
			//$scope.selected = selectedItem;
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}

	/**
	 * 打开子权限弹窗
	 */
	var openSon = function(item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/xtgl/yhgl/cdgl/modal.html',
			controller: 'modalXtglYhglCdglCtrl',
			//size: size,
			resolve: {
				items: function() {
					return item;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			//$scope.selected = selectedItem;
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}

	/**
	 * 搜索
	 */
	$scope.table_search = function() {
		//
		findFunctionList($scope.table_data.form);
	}

	


	/**
	 * run
	 */
	var run = function() {
		//   取菜单
		//$scope.getMenu();
		
		$scope.table_search();
	}
	run();

}]);




/**
 * 用户管理 - 用户组总览
 */
app.controller('userTypeCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal', function($scope, $timeout, globalFn, httpService, $modal) {

	/**
	 * 表格1
	 */
	$scope.table_data = {
		//   用户组
		user_items: [{
				title: '全部',
				val: ""
			},
			{
				title: '是',
				val: 1
			},
			{
				title: '不是',
				val: 0
			},
		],
		user_item: {
			title: '全部',
			val: ""
		},
		form: {
			key: "",
			page: 1,
			pageSize: 10,
			//sortname: "a.FUCECREATETIME",
			//sortorder: "desc"
		},
		//   表格数据
		table_res: {
			code: "0001",
			message: "ok",
			rows: [],
			total: 2,
			//
			maxSize: 5
		},
		//   翻页
		pageChanged: function() {
			//  查询
			findFunctionList($scope.table_data.form);
		},
		//   每页显示多少条
		selectChanged: function() {
			findFunctionList($scope.table_data.form);
		}
	}

	/**
	 * 操作
	 */
	$scope.table_operate = function(str, item) {
		console.log(str);
		if(str == 'son') {
			openSon(item);
		} else if(str == 'del') {
			menuDel(item);
		} else if(str == 'add') {
			openAdd('add', item, $scope.select_tree);
		} else if(str == 'edit') {
			openAdd('edit', item, $scope.select_tree);
		} else if(str == 'role') {
			openRole('role', item, $scope.select_tree);
		}
	}

	/**
	 * 打开添加修改
	 */
	var openAdd = function(str, item, select_item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/xtgl/yhgl/cdgl/modal_add.html',
			controller: 'modalAddXtglYhglCdglCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
						'select_item': select_item
					};
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			//$scope.selected = selectedItem;
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}

	/**
	 * 打开添加修改
	 */
	var openRole = function(str, item, select_item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/xtgl/yhgl/cdgl/modal_role.html',
			controller: 'modalRoleXtglYhglCdglCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
						'select_item': select_item
					};
				},
				deps: ['uiLoad',
					function(uiLoad) {
						return uiLoad.load(['vendor/jquery/ztree/css/zTreeStyle.css', 'vendor/jquery/ztree/js/jquery.ztree.core.js', 'vendor/jquery/ztree/js/jquery.ztree.excheck.js', 'js/directives/ztree.js']);
					}
				]
			}
		});

		modalInstance.result.then(function(selectedItem) {
			//$scope.selected = selectedItem;
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}

	/**
	 * 打开子权限弹窗
	 */
	var openSon = function(item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/xtgl/yhgl/cdgl/modal.html',
			controller: 'modalXtglYhglCdglCtrl',
			//size: size,
			resolve: {
				items: function() {
					return item;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			//$scope.selected = selectedItem;
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}

	/**
	 * 搜索
	 */
	$scope.table_search = function() {
		//
		findFunctionList($scope.table_data.form);
	}

	/**
	 * 查询列表
	 */
	var findFunctionList = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/login',form)
			.then(function(res) {
				console.log(res);
				debugger
				$scope.table_data.table_res.rows = res;
//				if(res.status == 200 && res.data) {
//					angular.extend($scope.table_data.table_res, res.data);
//					console.log($scope.table_data)
//				} else {
//					$scope.table_data.table_res.rows = [];
//				}
			});
	}


	/**
	 * run
	 */
	var run = function() {
		//   取菜单
		//$scope.getMenu();
		
		$scope.table_search();
	}
	run();

}]);