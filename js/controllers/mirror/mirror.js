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
					toaster.pop('warning','失败', res.data.msg);
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
					toaster.pop('warning','失败', res.data.msg);
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
						'item2':item2,
						'alert':$scope.addAlert
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
						'alert':$scope.addAlert
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
 * 镜像部署
 */
app.controller('mirrorDeployCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster','$interval', function($scope, $timeout, globalFn, httpService, $modal, toaster, $interval) {
	console.log('镜像')
	
	//   状态   1,
	$scope.status = 1;
	
	$scope.form = {
		//   是否开启部署模式
		deployOn: $scope.app.deployOn,
		//   请选择终端固件升级或分发镜像进行下一步 updata : 固件升级 。img : 分发镜像
		operate: 'img',
		//   终端组
		grpId: null,
		//   重起所选终端组 1 重起 0 不重起
		grpR:1,
		//   终端数
		client: {
			total:0,
			ready:0,
			row:[]
		},
		//   固件
		upfile:'',
		
		//   部署的镜像
		imgs:{
			row:[],
			checked_row:[],
			checked_all:false,
			clear_old:false
		},
		
		
	}
	
	//   是否正在部署
	$scope.is_deploy = false;
	
	//  终端组
	$scope.grp = {};
	$scope.grp.grp_items = [];
	$scope.grp.grp_item = "";
	
	//  终端组 change
	$scope.grpChange = function(item){
		$scope.form.grpId = item.id;
	}
	
	
	//   第二步选择
	$scope.operateChange = function(str){
		$scope.form.operate = str;
	}
	
	
	//  1 第一步点击下一步
	$scope.status_1_next = function(){
		$scope.status = 2;
	}
	
	// 2
	$scope.status_2_prev = function(){
		$scope.status = 1;
	}
	$scope.status_2_next = function(){
		$scope.status = 3;
	}
	
	// 3
	$scope.status_3_prev = function(){
		$scope.status = 2;
		tm.fnStopAutoRefreshfn(tm);
	}
	$scope.status_3_next = function(){
		//   进入部署模式
		if(!(+$scope.form.grpId)){
			$scope.addAlert('danger','未选中条目');
			return false;
		}
		deployEnter($scope.form.grpId, $scope.form.grpR, function(bol){
			if(bol){
				//   进入下一步
				$scope.status = 4;
				//   开始轮循
				tm.fnAutoRefreshfn(tm);
			}else{
				//
			}
		});
	}
	
	
	// 4
	$scope.status_4_prev = function(){
		$scope.status = 3;
	}
	$scope.status_4_next = function(){
		if($scope.form.operate == 'img'){
			$scope.status = 6;
			//   取镜像
			getMachineImg($scope.form.grpId);
		}else{
			$scope.status = 5;
		}
	}
	
	// 5
	$scope.status_5_prev = function(){
		$scope.status = 4;
	}
	$scope.status_5_next = function(){
		$scope.status = 6;
	}
	
	
	// 6
	$scope.status_6_prev_show = true;
	$scope.status_6_next_show = true;
	$scope.status_6_prev = function(){
		if($scope.form.operate == 'img'){
			$scope.status = 4;
		}else{
			$scope.status = 5;
		}
	}
	$scope.status_6_next = function(){
		//   开始部署
		var temp_arr = [];
		for(var i in $scope.form.imgs.row){
			if($scope.form.imgs.row[i].checked){
				temp_arr.push($scope.form.imgs.row[i].id);
			}
		}
		if(temp_arr.length < 1){
			$scope.addAlert('danger','未选镜像');
			return false;
		}
		var temp_clear = $scope.form.imgs.clear_old ? 1 : 0;
		deployStart(temp_clear, temp_arr);
	}
	
	
	
	
	/**
	 * 打开部署模式  -  弹窗
	 */
	$scope.openModalAdminPwd = function() {
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_admin_pwd.html',
			controller: 'modalServerAdminPwdCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				$scope.app.deployOn = 1;
				toaster.pop('success','成功', '已进入部署模式');
			}else{
				$scope.app.deployOn = 0;
				toaster.pop('warning', '失败', '进入失败');
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	/**
	 * 退出部署模式 -  弹窗
	 */
	$scope.openModalAdminPwdExit = function() {
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定要退出吗？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/stopDeploy')
				.then(function(res) {
					if(res.status == 200 && res.data.retCode == 0) {
						$scope.app.deployOn = 0;
						$scope.status = 1;
						run();
						toaster.pop('success','成功', '退出成功。');
					} else {
						$scope.app.deployOn = 1;
						toaster.pop('warning', '失败', '退出失败');
					}
				});
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	//    取终端组
	var getCliGrp = function(cb) {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getCliGrps')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.grp.grp_items = res.data.grps;
				} else {
					$scope.grp.grp_items = [];
				}
				typeof cb == "function" && cb();
			});
	}
	
	
	/**
	 * 获取部署状态
	 */
	var deployStat = function(cb) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/deployStat',{})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.app.deployOn = res.data.status;
					$scope.form.imgs.checked_row = res.data.imgs;
					$scope.form.imgs.clear_old = res.data.clear ? true : false;
					//
					$scope.form.grpId = res.data.gid;
					for(var i in $scope.grp.grp_items){
						if($scope.grp.grp_items[i].id == $scope.form.grpId){
							$scope.grp.grp_item = $scope.grp.grp_items[i];
						}
					}
				} else {
					//
				}
				typeof cb == "function" && cb(res.data);
			});
	}
	
	
	/**
	 * 进入部署模式
	 * gid：组id
	 * reboot: 是否重启指定终端组，0为不重启，1为重启，默认为1 允许值: 1, 0
	 */
	var deployEnter = function(gid,reboot,cb) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/deployEnter',{gid:gid,reboot:reboot})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					typeof cb == "function" && cb(true);
				} else {
					typeof cb == "function" && cb(false);
					toaster.pop('warning', '失败', res.data.msg);
				}
			});
	}
	
	
	/**
	 * 获取部署终端状态
	 */
	var getDeployClis = function() {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/getDeployClis',{})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.form.client.row = res.data.clis;
					$scope.form.client.total = res.data.sum;
					$scope.form.client.ready = $scope.form.client.row ? $scope.form.client.row.length : 0;
				} else {
					$scope.form.client.row = [];
				}
			});
	}
	
	
	/**
	 * 获取终端组授权镜像
	 * gid ：终端组id
	 */
	var getMachineImg = function(gid,cb) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/getMachineImg',{gid:gid})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.form.imgs.row = res.data.imgs;
					typeof cb == "function" && cb(res.data);
				} else {
					$scope.form.imgs.row = [];
				}
			});
	}
	
	
	/**
	 * 开始部署
	 */
	var deployStart = function(clear,imgs) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/deployStart',{clear:clear,imgs:imgs})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					toaster.pop('success','成功', '部署开始');
					//   禁用点击
					$scope.status_6_prev_show = false;
					$scope.status_6_next_show = false;
					//   显示进度
					$scope.is_deploy = true;
				} else {
					toaster.pop('warning', '失败', res.data.msg);
				}
			});
	}
	
	
	
	/**
	 * 获取部署进度
	 */
	var getDeployProg = function() {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/getDeployProg',{})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					console.log(res);
					if(0){
						$scope.openModalEnd();
					}
				} else {
					//
				}
			});
	}
	
	
	
	
	/**
	 * 部署完成 
	 */
	$scope.openModalEnd = function() {
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/mirror/deploy/modal_alert.html',
			controller: 'modalMirrorAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'部署完成！'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/stopDeploy')
				.then(function(res) {
					if(res.status == 200 && res.data.retCode == 0) {
						$scope.status = 1;
						tm.fnStopAutoRefreshfn(tm);
						run();
						toaster.pop('success','成功', '退出部署模式成功。');
					} else {
						toaster.pop('warning', '失败', '退出失败');
					}
				});
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	
	
	
	
	//开始定义定时器
	var tm=$scope.setglobaldata.gettimer("app.mirror.deploy-deploy");
	if(tm.Key!="app.mirror.deploy-deploy"){
		tm.Key="app.mirror.deploy-deploy";
		tm.keyctrl="app.mirror.deploy";
		tm.fnAutoRefresh=function(){
			console.log("开始调用定时器");
			tm.interval = $interval(function() {
				getDeployClis();
				getDeployProg();
			}, 3000);
		};
		tm.fnStopAutoRefresh=function(){
			console.log("进入取消方法");
			if(tm.interval != null) {
				$interval.cancel(tm.interval);
				tm.interval = null;
				console.log("进入取消成功");
			}
			tm.interval=null;
		};
		$scope.setglobaldata.addtimer(tm);
	}
	//结束定义定时器
	
	
	
	
	
	
	
	
	
	/**
	 * run
	 */
	var run = function() {
		//    取终端组
		getCliGrp(function(){
			deployStat(function(data){
				//
				if(data && data.status != 1){
					tm.fnStopAutoRefreshfn(tm);
					return false;
				}
				//   
				if($scope.form.imgs.checked_row.length > 0){
					//   正在部署
					//   禁用点击
					$scope.status_6_prev_show = false;
					$scope.status_6_next_show = false;
					//   显示进度
					$scope.is_deploy = true;
					//   取镜像 + 选中
					getMachineImg($scope.form.grpId, function(){
						//  选中
						for(var i in $scope.form.imgs.row){
							for(var b in data.imgs){
								if($scope.form.imgs.row[i].id == data.imgs[b]){
									$scope.form.imgs.row[i].checked = true;
								}else{
									$scope.form.imgs.row[i].checked = false;
								}
							}
						}
					});
					tm.fnAutoRefreshfn(tm);
					$scope.status = 6;
					//  stop
					return false;
				}
				//  
				if($scope.form.grpId){
					//   
					$scope.status = 4;
					//   取终端状态
					getDeployClis();
					//   隐藏进度
					$scope.is_deploy = false;
					//   取镜像
					getMachineImg($scope.form.grpId);
					tm.fnAutoRefreshfn(tm);
				}
			});
		});
	}
	run();
	
	
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
	
	
	//   镜像还原
	var restore = function(gid,id){
		if(1){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/restore',{'id':id,'snpid':gid})
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
			openMove('reboot',item,function(gid){
				//
				restore(gid, item.id);
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
			delImg(temp_arr);
		});
	}
	
	
	
	
	
	
	

	/**
	 * 打开镜像克隆 、 修改
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
						'alert':$scope.addAlert
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
	 * 打开选择镜像还原点
	 */
	var openMove = function(str,item,cb) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/mirror/list/modal_move.html',
			controller: 'modalMirrorListMoveCtrl',
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
			//if(gid){
			if(1){
				typeof cb == "function" && cb(gid);
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