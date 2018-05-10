'use strict';


/**
 * 终端管理
 */
app.controller('terminalCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal', function($scope, $timeout, globalFn, httpService, $modal) {
	console.log('终端管理')
}]);


/**
 * 终端管理 - 终端总览
 */
app.controller('terminalListCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster', function($scope, $timeout, globalFn, httpService, $modal, toaster) {

	/**
	 * 表格1
	 */
	$scope.table_data = {
		//   终端组
		grp_items: [],
		grp_item: "",
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
	
	
	//   终端组change
	$scope.grpChange = function(item){
		$scope.table_data.form.gid = item.id;
	}
	
	
	/**
	 * 查询列表
	 */
	var findFunctionList = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/showClient',form)
			.then(function(res) {
				console.log(res);
				if(res.status == 200 && res.data.retCode == 0) {
					angular.extend($scope.table_data.table_res, res.data);
					$scope.table_data.table_res.row = res.data.clis;
					console.log($scope.table_data)
				} else {
					$scope.table_data.table_res.row = [];
				}
			});
	}
	
	
	//    取终端组
	var getCliGrp = function() {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getCliGrps')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_data.grp_items = res.data.grps;
					$scope.table_data.grp_items.splice(0,0,{'id':'','name':'选择终端组'});
				} else {
					$scope.table_data.grp_items = [{'id':'','name':'选择终端组'}];
				}
			});
	}
	
	//   移动到终端组
	var chgCliGrp = function(idarr,gid){
		if(idarr instanceof Array && idarr.length > 0 && gid){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/chgCliGrp',{'ids':idarr,'gid':gid})
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
	
	
	//    删除终端
	var cliDel = function(idarr) {
		if(idarr instanceof Array && idarr.length > 0){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cliDel',{'ids':idarr})
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
	
	
	//    解绑
	var unbind = function(mid) {
		if(mid){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/unbind',{'mid':mid})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_search();
					toaster.pop('success','成功', '解绑成功');
				} else {
					toaster.pop('warning','失败', '解绑失败');
				}
			});
		}
	}
	
	
	
	
	
	//   终端操作   
	//   action:  string 允许值: reboot, shutdown, approve, reject   重起， 关机 ，起用，禁用
	var cliCtrl = function(idarr,action){
		if(idarr instanceof Array && idarr.length > 0 && action){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cliCtrl',{'ids':idarr,'action':action})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_search();
					toaster.pop('success','成功', '操作成功。');
				} else {
					toaster.pop('warning','失败', '操作失败。');
				}
			});
		}else{
			
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
				cliDel([item.id]);
			});
		}else if (str == 'move'){
			openMove(str,item,function(gid){
				chgCliGrp([item.id],gid);
			});
		}else if (str == 'approve'){
			//   启用
			openCliCtrl('启用',function(){
				cliCtrl([item.id],'approve');
			});
		}else if (str == 'reject'){
			//   停用
			openCliCtrl('停用',function(){
				cliCtrl([item.id],'reject');
			});
		}else if (str == 'reboot'){
			//   重起
			openCliCtrl('重起',function(){
				cliCtrl([item.id],'reboot');
			});
		}else if (str == 'shutdown'){
			//   关机
			openCliCtrl('关机',function(){
				cliCtrl([item.id],'shutdown');
			});
		}
	}
	
	
	/**
	 * 批量移动到终端组
	 * 
	 */
	$scope.batchMove = function(){
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
			chgCliGrp(temp_arr,gid);
		});
		
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
			cliDel(temp_arr);
		});
	}
	
	
	/**
	 * 批量操作
	 * str 操作标识字符串，
	 * name 操作名称
	 */
	$scope.batchCliCtrl = function(str,name){
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
		openCliCtrl(name,function(){
			cliCtrl(temp_arr,str);
		});
	}
	
	
	
	
	

	/**
	 * 打开添加修改
	 */
	var openAdd = function(str, item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/terminal/list/modal_add.html',
			controller: 'modalTerminalListAddCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
						'alert': $scope.addAlert
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
	 * 打开移动到终端组
	 */
	var openMove = function(str,item,cb) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/terminal/list/modal_move.html',
			controller: 'modalTerminalListMoveCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
						'alert': $scope.addAlert 
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
	 * 终端绑定用户
	 */
	$scope.openUser = function(str,item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/terminal/list/modal_user.html',
			controller: 'modalTerminalListUserCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
						'alert': $scope.addAlert 
					};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol) {
				$scope.table_search();
				toaster.pop('success','成功', '绑定成功');
			} else {
				toaster.pop('warning','失败', '绑定失败');
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	/**
	 * 解绑
	 */
	$scope.openUnbind = function(item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定要解绑吗？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				unbind(item.id);
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
	 * 打开批量操作弹窗
	 */
	var openCliCtrl = function(str,cb) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定要' + str + '吗？'};
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
		//   取菜单
		//$scope.getMenu();
		
		$scope.table_search();
		//  取终端组
		getCliGrp();
	}
	run();

}]);




/**
 * 终端管理 - 终端组总览
 */
app.controller('terminalTypeCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster', function($scope, $timeout, globalFn, httpService, $modal, toaster) {

	/**
	 * 表格1
	 */
	$scope.table_data = {
		//   终端组
		grp_items: [],
		grp_item: "",
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
	
	
	//   终端组change
	$scope.grpChange = function(item){
		$scope.table_data.form.gid = item.id;
	}
	
	
	/**
	 * 查询列表
	 */
	var findFunctionList = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/showCliGrp',form)
			.then(function(res) {
				console.log(res);
				if(res.status == 200 && res.data.retCode == 0) {
					angular.extend($scope.table_data.table_res, res.data);
					$scope.table_data.table_res.row = res.data.grps;
					console.log($scope.table_data)
				} else {
					$scope.table_data.table_res.row = [];
				}
			});
	}
	
	
	
	//    删除终端
	var delCliGrp = function(idarr) {
		if(idarr instanceof Array && idarr.length > 0){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/delCliGrp',{'ids':idarr})
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
	
	
	
	
	
	//   终端操作   
	//   action:  string 允许值: reboot, shutdown,   重起， 关机
	var cgCtl = function(idarr,action){
		//if(idarr instanceof Array && idarr.length > 0 && action){
		if(1){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cgCtl',{'gid':idarr,'action':action})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_search();
					toaster.pop('success','成功', '操作成功。');
				} else {
					toaster.pop('warning','失败', '操作失败。');
				}
			});
		}else{
			
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
				delCliGrp([item.id]);
			});
		}else if (str == 'reboot'){
			//   重起
			openCliCtrl('重起',function(){
				cgCtl(item.id,'reboot');
			});
		}else if (str == 'shutdown'){
			//   关机
			openCliCtrl('关机',function(){
				cgCtl(item.id,'shutdown');
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
			delCliGrp(temp_arr);
		});
	}
	
	
	/**
	 * 批量操作
	 * str 操作标识字符串，
	 * name 操作名称
	 */
	$scope.batchCliCtrl = function(str,name){
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
		openCliCtrl(name,function(){
			cgCtl(temp_arr,str);
		});
	}
	
	
	
	
	

	/**
	 * 打开添加修改
	 */
	var openAdd = function(str, item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/terminal/type/modal_add.html',
			controller: 'modalTerminalTypeAddCtrl',
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
	 * 打开批量操作弹窗
	 */
	var openCliCtrl = function(str,cb) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定要' + str + '吗？'};
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
		//   取菜单
		//$scope.getMenu();
		
		$scope.table_search();
	}
	run();

}]);