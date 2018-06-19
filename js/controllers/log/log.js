'use strict';


/**
 * 日志管理
 */
app.controller('logCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal', function($scope, $timeout, globalFn, httpService, $modal) {
	console.log('日志管理')
}]);


/**
 * 日志管理 - 日志列表
 */
app.controller('logListCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster','$filter', function($scope, $timeout, globalFn, httpService, $modal, toaster,$filter) {

	/**
	 * 表格1
	 */
	var new_date = new Date();
	$scope.table_data = {
		//   模块
		module_items:[
			{"name":"请选择","val":0},
			{"name":"主模块","val":1},
			{"name":"web","val":2},
			{"name":"终端管理模块","val":3},
			{"name":"部署模块","val":4}
		],
		module_item:'',
		//   日志级别
		level_items:[
			{"name":"请选择","val":0},
			{"name":"debug","val":1},
			{"name":"info","val":2},
			{"name":"warnning","val":3},
			{"name":"error","val":4}
		],
		level_item:'',
		//
		form: {
			module: null,
			level: null,
			key:'',
			start: $filter('date')(new_date.setDate(new_date.getDate() - 7), 'yyyy-MM-dd HH:mm:ss'),
			end: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
			page:1,
			pageSize: 10
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
	
	//   默认值 
	$scope.table_data.module_item = $scope.table_data.module_items[0];
	$scope.table_data.form.module = $scope.table_data.module_item.val;
	//
	$scope.table_data.level_item = $scope.table_data.level_items[0];
	$scope.table_data.form.level = $scope.table_data.level_item.val;
	
	
	
	//  change
	$scope.moduleChange = function(item){
		$scope.table_data.module_item = item;
		$scope.table_data.form.module = $scope.table_data.module_item.val;
	}
	//  change
	$scope.levelChange = function(item){
		$scope.table_data.level_item = item;
		$scope.table_data.form.level = $scope.table_data.level_item.val;
	}
	
	
	
	
	/**
	 * 查询列表
	 */
	var findFunctionList = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/showLog',form)
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.table_data.table_res.row = res.data.logs;
					$scope.table_data.table_res.total = res.data.total;
				} else {
					$scope.table_data.table_res.row = [];
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
	 * 打开添加修改
	 */
	var openAdd = function(str, item) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/log/list/modal_add.html',
			controller: 'modalLogSeeCtrl',
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
		$scope.table_search();
		
		//时间选择器
		laydate.render({
		  elem: '#log_start',
		  type: 'datetime',
		  theme: '#b18bbb',
		  done:function(value, date, endDate){
		  	$scope.table_data.form.start = value;
		  }
		});
		//时间选择器
		laydate.render({
		  elem: '#log_end',
		  type: 'datetime',
		  theme: '#b18bbb',
		  done:function(value, date, endDate){
		  	$scope.table_data.form.end = value;
		  }
		});
	}
	run();

}]);





















