'use strict';


/**
 * 镜像管理
 */
app.controller('mirrorCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal', function($scope, $timeout, globalFn, httpService, $modal) {
	console.log('镜像')
}]);


/**
 * 镜像模板管理
 */
app.controller('mirrorTemplateCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster', function($scope, $timeout, globalFn, httpService, $modal, toaster) {
	console.log('镜像')
	
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
	
	//   默认展开
	$scope.list_open = [];
	
	//   展开
	$scope.item_open = function(item){
		item.is_open = !item.is_open;
		$scope.list_open = angular.copy($scope.table_data.table_res.row);
	}
	
	//   终端组change
	$scope.grpChange = function(item){
		$scope.table_data.form.gid = item.id;
	}
	
	
	/**
	 * 查询列表
	 */
	var findFunctionList = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/showTpls',{})
			.then(function(res) {
				console.log(res);
				if(res.status == 200 && res.data.retCode == 0) {
					angular.extend($scope.table_data.table_res, res.data);
					$scope.table_data.table_res.row = res.data.tpls;
					var row = $scope.table_data.table_res.row;
					var list = $scope.list_open;
					if(list.length == 0 && row.length > 0){
						row[0].is_open = true;
					}
					for(var i in row){
						for(var b in list){
							if(row[i].id == list[b].id && list[b].is_open){
								$scope.table_data.table_res.row[i].is_open = true;
							}
						}
					}
				} else {
					$scope.table_data.table_res.row = [];
					$scope.list_open = [];
				}
			});
	}
	
	
	//    删除模板
	var delTpl = function(id) {
		if(id){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/delTpl',{'id':id})
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
	
	//    删除镜像
	var delImg = function(ids) {
		if(ids){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/delImg',{'ids':ids})
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
	 * 镜像操作
	 */
	$scope.tpls_operate = function(str, item) {
		if(str == 'add'){
			openTplsAdd(str,item);
		}else if(str == 'edit') {
			openTplsAdd('edit',item);
		} else if(str == 'del') {
			openDel(function(){
				delTpl(item.id);
			});
		}else if (str == 'copy'){
			//   克隆
			openCopyAdd(str,item);
		}
	}
	

	/**
	 * 镜像操作
	 */
	$scope.imgs_operate = function(str, item, item2) {
		if(str == 'edit'){
			openCopyAdd(str, item);
		}else if(str == 'del') {
			openDel(function(){
				delImg([item.id]);
			});
		}else if(str == 'new') {
			//   应用为模板
			openTplsAdd(str, item, item2);
		}
	}
	
	
	/**
	 * 打开添加修改
	 */
	var openTplsAdd = function(str, item, item2) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/mirror/template/modal_add.html',
			controller: 'modalMirrorTemplateAddCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
						'item2':item2
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
	 * 打开镜像克隆
	 */
	var openCopyAdd = function(str, item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/mirror/template/modal_copy.html',
			controller: 'modalMirrorTemplateCopyCtrl',
			size: (str == 'copy') ? 'lg' : '',
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
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
		//   取菜单
		//$scope.getMenu();
		
		$scope.table_search();
	}
	run();
	
}]);




/**
 * 镜像模板管理
 */
app.controller('mirrorDeployCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal', function($scope, $timeout, globalFn, httpService, $modal) {
	console.log('镜像')
}]);





/**
 * 镜像管理 - 镜像总览
 */
app.controller('mirrorListCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster', function($scope, $timeout, globalFn, httpService, $modal, toaster) {

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
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/showImgs',form)
			.then(function(res) {
				console.log(res);
				if(res.status == 200 && res.data.retCode == 0) {
					angular.extend($scope.table_data.table_res, res.data);
					$scope.table_data.table_res.row = res.data.imgs;
				} else {
					$scope.table_data.table_res.row = [];
				}
			});
	}
	
	
	
	//    删除
	var delImg = function(idarr) {
		if(idarr instanceof Array && idarr.length > 0){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/delImg',{'ids':idarr})
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
		if(idarr instanceof Array && idarr.length > 0 && action){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cgCtl',{'ids':idarr,'action':action})
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
		if(str == 'edit') {
			openCopyAdd('edit',item);
		} else if(str == 'del') {
			openDel(function(){
				delImg([item.id]);
			});
		}else if (str == 'reboot'){
			//   还原
			openCliCtrl('重起',function(){
				cgCtl([item.id],'reboot');
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
		openDel(function(){
			delImg(temp_arr);
		});
	}
	
	
	
	
	
	
	

	/**
	 * 打开镜像克隆
	 */
	var openCopyAdd = function(str, item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/mirror/template/modal_copy.html',
			controller: 'modalMirrorTemplateCopyCtrl',
			size: (str == 'copy') ? 'lg' : '',
			resolve: {
				items: function() {
					return {
						'operate': str,
						'item': item,
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