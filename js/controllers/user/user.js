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
app.controller('userListCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster', function($scope, $timeout, globalFn, httpService, $modal,toaster) {

	/**
	 * 表格1
	 */
	$scope.table_data = {
		//   用户组
		user_items: [],
		user_item: "",
		form: {
			key: "",
			page: 1,
			pageSize: 10,
			gid: null,
			//sortname: "a.FUCECREATETIME",
			//sortorder: "desc"
		},
		//   表格数据
		table_res: {
			retCode: 0,
			//message: "ok",
			row: [],
			total: 1,
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
		},
		checkbox: {
			//   是否全选
			'allCheckbox':false,
			//   选中
			'checkboxArr':[],
			//   点击单选
			checkboxClick:function(item){
				var temp_row = $scope.table_data.table_res.row;
				$scope.table_data.checkbox.checkboxArr = [];
				//  是否全选 true全选
				var temp_bol = true;
				for(var i in temp_row){
					if(temp_row[i].checked === true){
						$scope.table_data.checkbox.checkboxArr.push(temp_row[i]);
					}else{
						temp_bol = false;
					}
				}
				$scope.table_data.checkbox.allCheckbox = temp_bol;
			},
			//   全选
			checkboxAll:function(){
				var temp_row = $scope.table_data.table_res.row;
				$scope.table_data.checkbox.checkboxArr = [];
				for(var i in temp_row){
					if($scope.table_data.checkbox.allCheckbox){
						//   全选
						$scope.table_data.table_res.row[i].checked = true;
						$scope.table_data.checkbox.checkboxArr.push(temp_row[i]);
					}else{
						//   全不选
						$scope.table_data.table_res.row[i].checked = false;
					}
				}
			}
		}
	}
	
	
	//   用户组change
	$scope.userChange = function(item){
		$scope.table_data.form.gid = item.id;
		// = item;
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
	
	
	//    取用户组
	var getUserGroups = function() {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getUserGroups')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_data.user_items = res.data.groups;
					//   加入空
					$scope.table_data.user_items.splice(0,0,{'id':'','name':'选择用户组'});
				} else {
					$scope.table_data.user_items = [{'id':'','name':'选择用户组'}];
				}
			});
	}
	
	//    删除用户
	var delUser = function(idarr) {
		if(idarr instanceof Array && idarr.length > 0){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/delUser',{'ids':idarr})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_search();
					toaster.pop('success','成功', '删除成功。');
				} else {
					toaster.pop('warning','失败', '删除失败。');
				}
			});
		}
	}
	
	//   移动到用户组
	var chgGrp = function(idarr,gid){
		if(idarr instanceof Array && idarr.length > 0 && gid){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/chgGrp',{'ids':idarr,'gid':gid})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_search();
					toaster.pop('success','成功', '移动成功。');
				} else {
					toaster.pop('warning','失败', '移动失败。');
				}
			});
		}
	}
	
	//   重置密码
	var resetPwd = function(idarr){
		if(idarr instanceof Array && idarr.length > 0){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/userRest',{'ids':idarr})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_search();
					toaster.pop('success','成功', '重置密码成功。');
				} else {
					toaster.pop('warning','失败', '重置密码失败。');
				}
			});
		}else{
			
		}
	}
	
	
	/**
	 * 导出
	 */
	$scope.outfile = function(){
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/exportUser',{})
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0 && res.data.msg && res.data.msg.length > 0) {
				window.open(httpService.API.origin + res.data.msg);
				toaster.pop('success','成功', '导出成功。');
			} else {
				toaster.pop('warning','失败', '导出失败。');
			}
		});
	}
	
	

	/**
	 * 操作
	 */
	$scope.table_operate = function(str, item) {
		if(str == 'add'){
			openAdd(str,item);
		}else if(str == 'edit') {
			openAdd('edit',item);
		} else if(str == 'reset_pwd') {
			//   重置密码
			openResetPwd(function(){
				resetPwd([item.id]);
			});
		} else if(str == 'del') {
			openDel(function(){
				delUser([item.id]);
			});
		}else if (str == 'move'){
			openMove(str,item,function(gid){
				chgGrp([item.id],gid);
			});
		}
	}
	
	
	/**
	 * 批量删除
	 */
	$scope.batchDel = function(){
		var temp_ck = $scope.table_data.checkbox.checkboxArr;
		var temp_arr = [];
		for(var i in temp_ck){
			temp_arr.push(temp_ck[i].id);
		}
		//
		if(temp_arr.length < 1){
			$scope.addAlert('danger','未选中条目');
			return false;
		}
		// 
		openDel(function(){
			delUser(temp_arr);
		});
	}
	
	/**
	 * 批量重置密码
	 */
	$scope.batchResetPwd = function(){
		var temp_ck = $scope.table_data.checkbox.checkboxArr;
		var temp_arr = [];
		for(var i in temp_ck){
			temp_arr.push(temp_ck[i].id);
		}
		//
		if(temp_arr.length < 1){
			$scope.addAlert('danger','未选中条目');
			return false;
		}
		//
		openResetPwd(function(){
			resetPwd(temp_arr);
		});
	}
	
	
	/**
	 * 批量移动到用户组
	 * 
	 */
	$scope.moveChgGrp = function(){
		var temp_ck = $scope.table_data.checkbox.checkboxArr;
		var temp_arr = [];
		for(var i in temp_ck){
			temp_arr.push(temp_ck[i].id);
		}
		//
		if(temp_arr.length < 1){
			$scope.addAlert('danger','未选中条目');
			return false;
		}
		// 
		openMove('move',{},function(gid){
			chgGrp(temp_arr,gid);
		});
		
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
						'item': item,
						'alert':$scope.addAlert,
						'scope':$scope
					};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				$scope.table_search();
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	/**
	 * 打开移动到用户组
	 */
	var openMove = function(str,item,cb) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/user/list/modal_move.html',
			controller: 'modalUserListMoveCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
						'alert':$scope.addAlert
					};
				}
			}
		});

		modalInstance.result.then(function(gid) {
			if(gid){
				typeof cb == "function" && cb(gid);
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	/**
	 * 删除
	 */
	var openDel = function(cb) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定删除吗？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				typeof cb == "function" && cb(bol);
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	/**
	 * 打开重置密码弹窗
	 */
	var openResetPwd = function(cb) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定要重置密码吗？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				typeof cb == "function" && cb(bol);
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	
	/**
	 * 打开导入用户
	 */
	$scope.openInFile = function() {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/user/list/modal_infile.html',
			controller: 'modalUserListInfileCtrl',
			backdrop:false,
			windowClass:'m-none-back',
			//size: size,
			resolve: {
				items: function() {
					return {
						'alert':$scope.addAlert,
						'scope':$scope
					};
				},
				deps: ['$ocLazyLoad',
	                function( $ocLazyLoad){
	                  return $ocLazyLoad.load('angularFileUpload');
	            }]
			}
			
			
			
		});

		modalInstance.result.then(function(bol) {
			//
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
		//  用户组
		getUserGroups();
	}
	run();

}]);




/**
 * 用户管理 - 用户组总览
 */
app.controller('userTypeCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster', function($scope, $timeout, globalFn, httpService, $modal,toaster) {

	/**
	 * 表格1
	 */
	$scope.table_data = {
		//   用户组
		user_items: [],
		user_item: "",
		form: {
			key: "",
			page: 1,
			pageSize: 10,
			gid: null,
			//sortname: "a.FUCECREATETIME",
			//sortorder: "desc"
		},
		//   表格数据
		table_res: {
			retCode: 0,
			//message: "ok",
			row: [],
			total: 1,
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
		},
		checkbox: {
			//   是否全选
			'allCheckbox':false,
			//   选中
			'checkboxArr':[],
			//   点击单选
			checkboxClick:function(item){
				var temp_row = $scope.table_data.table_res.row;
				$scope.table_data.checkbox.checkboxArr = [];
				//  是否全选 true全选
				var temp_bol = true;
				for(var i in temp_row){
					if(temp_row[i].checked === true){
						$scope.table_data.checkbox.checkboxArr.push(temp_row[i]);
					}else{
						temp_bol = false;
					}
				}
				$scope.table_data.checkbox.allCheckbox = temp_bol;
			},
			//   全选
			checkboxAll:function(){
				var temp_row = $scope.table_data.table_res.row;
				$scope.table_data.checkbox.checkboxArr = [];
				for(var i in temp_row){
					if($scope.table_data.checkbox.allCheckbox){
						//   全选
						$scope.table_data.table_res.row[i].checked = true;
						$scope.table_data.checkbox.checkboxArr.push(temp_row[i]);
					}else{
						//   全不选
						$scope.table_data.table_res.row[i].checked = false;
					}
				}
			}
		}
	}
	
	
	
	/**
	 * 查询列表
	 */
	var findFunctionList = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/showGroups',form)
			.then(function(res) {
				console.log(res);
				if(res.status == 200 && res.data.retCode == 0) {
					angular.extend($scope.table_data.table_res, res.data);
					$scope.table_data.table_res.row = res.data.groups;
				} else {
					$scope.table_data.table_res.row = [];
				}
			});
	}
	
	
	
	//    删除用户组
	var delUserGroup = function(idarr) {
		if(idarr instanceof Array && idarr.length > 0){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/delGroup',{'ids':idarr})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_search();
					toaster.pop('success','成功', '删除成功。');
				} else {
					toaster.pop('warning','失败', '删除失败。');
				}
			});
		}
	}
	
	

	/**
	 * 操作
	 */
	$scope.table_operate = function(str, item) {
		if(str == 'add'){
			openAdd(str,item);
		}else if(str == 'edit') {
			openAdd('edit',item);
		} else if(str == 'del') {
			openDel(function(){
				delUserGroup([item.id]);
			});
		}
	}
	
	
	/**
	 * 批量删除
	 */
	$scope.batchDel = function(){
		var temp_ck = $scope.table_data.checkbox.checkboxArr;
		var temp_arr = [];
		for(var i in temp_ck){
			temp_arr.push(temp_ck[i].id);
		}
		//
		if(temp_arr.length < 1){
			$scope.addAlert('danger','未选中条目');
			return false;
		}
		// 
		openDel(function(){
			delUserGroup(temp_arr);
		});
	}
	
	
	
	/**
	 * 打开添加修改
	 */
	var openAdd = function(str, item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/user/type/modal_add.html',
			controller: 'modalUserTypeAddCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
						'alert': $scope.addAlert,
						'scope':$scope
					};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				$scope.table_search();
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	
	/**
	 * 删除
	 */
	var openDel = function(cb) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定删除吗？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				typeof cb == "function" && cb(bol);
			}
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
		//
		$scope.table_search();
	}
	run();
	
}]);