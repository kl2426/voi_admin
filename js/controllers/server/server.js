'use strict';

app.controller('serverCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster','$interval', function($scope, $timeout, globalFn, httpService, $modal,toaster, $interval) {

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
	
	//   系统概况
	$scope.sys = {
		//  
		'status':'良好',
		//  ip
		'ip':'',
		'mask':'',
		//   模板数
		'tpls':0,
		//   镜像数
		'imgs':0,
		//   用户组数
		'userGrps':0,
		//   用户数
		'users':0,
		//   Serial NO
		'ser':'',
		//////////////////////
		//  镜像
		'img_obj':{
			//   镜像百分比 
			'used':0,
			//   总量
			'diskSpace':0
		},
		///////////////////////
		//   授权终端数量
		'clilimit':0,
		//   终端组数量
		'cliGrpNum':0,
		//   终端总数
		'pageSum':0,
		//   在线终端数
		'onlines':0,
		//   离线终端数
		'offlines':0,
		//   系统状态   0 1 
		'isRunning':0
	}
	
	//   终端组 与镜像
	$scope.grps = [];
	
	
	//   终端组过滤
	$scope.grpChange = function(item){
		$scope.table_data.form.gid = item.id;
		$scope.table_search();
	}
	
	
	/**
	 * 查询列表
	 */
	var findFunctionList = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cliStatus',form)
			.then(function(res) {
				console.log(res);
				if(res.status == 200 && res.data.retCode == 0) {
					angular.extend($scope.table_data.table_res, res.data);
					$scope.table_data.table_res.row = res.data.clients;
					$scope.table_data.table_res.total = res.data.pageSum;
					//
					$scope.table_data.grp_items = res.data.cliGroups;
					//  添加选项
					$scope.table_data.grp_items.splice(0,0,{id:'',name:'选择终端组'});
				} else {
					$scope.table_data.grp_items = [{id:'',name:'选择终端组'}];
					$scope.table_data.table_res.row = [];
				}
			});
	}
	
	
	/**
	 * 查询系统状态
	 */
	var sysStatus = function() {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/sysStatus')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.sys.tpls = res.data.tpls ? res.data.tpls : 0;
					$scope.sys.imgs = res.data.imgs ? res.data.imgs : 0;
					$scope.sys.userGrps = res.data.userGrps ? res.data.userGrps : 0;
					$scope.sys.ip = res.data.ip ? res.data.ip : "";
					$scope.sys.mask = res.data.mask ? res.data.mask : "";
					$scope.sys.users = res.data.users ? res.data.users : 0;
					$scope.sys.ser = res.data.ser ? res.data.ser : '';
					//   系统是否注册
					$scope.app.registerd = res.data.registerd;
					//   部署模式
					$scope.app.deployOn = res.data.deployOn ? res.data.deployOn : 0;
					//  镜像
					$scope.sys.img_obj.used = res.data.used ? res.data.used : 0;
					$scope.sys.img_obj.diskSpace = res.data.diskSpace ? res.data.diskSpace : 0;
					//   画圈
					var temp_echarts_o = angular.copy($scope.echarts_option1);
					temp_echarts_o.series[0].data[0].value = parseInt($scope.sys.img_obj.used / 100 * $scope.sys.img_obj.diskSpace);
					temp_echarts_o.series[0].data[1].value = $scope.sys.img_obj.diskSpace;
					$scope.echarts_option1 = temp_echarts_o;
					//   运行状态
					$scope.sys.status = $scope.sys.img_obj.used;
					//   系统状态
					$scope.sys.isRunning = res.data.isRunning != undefined ? res.data.isRunning : 0;
					
				} else {
					// $scope.table_data.grp_items = [];
				}
			});
	}
	
	
	/**
	 * 查询终端状态
	 */
	var cliStatus = function() {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cliStatus',{
			'mid':0
		})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.sys.clilimit = res.data.clilimit ? res.data.clilimit : 0;
					$scope.sys.cliGrpNum = res.data.cliGrpNum ? res.data.cliGrpNum : 0;
					$scope.sys.pageSum = res.data.pageSum ? res.data.pageSum : 0;
					$scope.sys.onlines = res.data.onlines ? res.data.onlines : 0;
					$scope.sys.offlines = $scope.sys.pageSum - $scope.sys.onlines;
				} else {
					// $scope.table_data.grp_items = [];
				}
			});
	}
	
	

	/**
	 * 查询终端组
	 */
	var getCliGrps = function() {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getCliGrps')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					//$scope.table_data.grp_items = $scope.table_data.grp_items.concat(res.data.grps);
					//
					$scope.grps = res.data.grps;
					//   取终端组镜像
					for(var i in $scope.grps){
						getCliGrp($scope.grps[i].id, i);
					}
				} else {
					//$scope.table_data.grp_items = [];
					$scope.grps = [];
				}
			});
	}
	
	
	/**
	 * 查询终端组详情
	 */
	var getCliGrp = function(id, index) {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getCliGrp',{'id':id})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.grps[index].imgs = res.data.imgs;
					for(var i in res.data.imgs){
						if(res.data.imgs[i].id == res.data.defOs){
							$scope.grps[index].imgs[i].seleced = 1;
						}
					}
//					console.log('grps',$scope.grps)
				} else {
					$scope.grps[index].imgs = [];
				}
			});
	}
	
	
	//   终端操作   
	//   action:  string 允许值: reboot, shutdown,   重起， 关机
	var cgCtl = function(idarr,action){
		//  if(idarr instanceof Array && idarr.length > 0 && action){
		if(1){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cgCtl',{'gid':idarr,'action':action})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					toaster.pop('success','成功', '操作成功。');
				} else {
					toaster.pop('warning','失败', '操作失败。');
				}
			});
		}else{
			
		}
	}
	
	//   client - 设置自启动镜像
	var autobootImg = function(gid,osid){
		if(gid){
			httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/autobootImg',{'gid':gid,'osid':osid})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					toaster.pop('success','成功', '设置成功');
					//   刷新
					getCliGrps();
				} else {
					toaster.pop('warning','失败', '设置失败');
				}
			});
		}else{
			
		}
	}
	
	
	
	//   开启系统
	var startServer = function(){
		if(1){
			httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/startServer')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					toaster.pop('success','成功', '开启成功');
					$scope.sys.isRunning = 1;
				} else {
					toaster.pop('warning','失败', '开启失败');
					$scope.sys.isRunning = 0;
				}
			});
		}else{
			
		}
	}
	
	//   关闭系统
	var stopServer = function(){
		if(1){
			httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/stopServer')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					toaster.pop('success','成功', '关闭成功');
					$scope.sys.isRunning = 0;
				} else {
					$scope.sys.isRunning = 1;
					toaster.pop('warning','失败', '关闭失败');
				}
			});
		}else{
			
		}
	}
	

	/**
	 * 打开未注册弹窗
	 */
	$scope.openModalNO = function() {
    
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_no.html',
			controller: 'modalServerNOCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {
						'alert':$scope.addAlert,
						'ser':$scope.sys.ser
					};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				toaster.pop('success','成功', '注册完成');
				$scope.app.registerd = 1;
			}else{
				$scope.app.registerd = 0;
				toaster.pop('warning','失败', '注册失败');
			}
			//$scope.selected = selectedItem;
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
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
					return {
						'alert':$scope.addAlert
					};
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
	
	
	
	/**
	 * 打开重起服务器 -  弹窗
	 */
	$scope.openModalAlert = function() {
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'重启服务器？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/serReboot')
				.then(function(res) {
					if(res.status == 200 && res.data.retCode == 0) {
						toaster.pop('success', '成功', '服务器重启成功');
					} else {
						toaster.pop('warning', '失败', '服务器重启失败');
					}
				});
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	/**
	 * 打开关机 -  弹窗
	 */
	$scope.openModalAlert2 = function() {
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'关闭服务器？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/serShutdown')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					toaster.pop('success', '成功', '服务器关机成功');
				} else {
					toaster.pop('warning', '失败', '服务器关机失败');
				}
			});
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	/**
	 * 打开网络配置/服务器IP配置 -  弹窗
	 */
	$scope.openModalServerIp = function() {
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/server/modal_server_ip.html',
			controller: 'modalServerIpCtrl',
			resolve: {
				items: function() {
					return {
						'scope':$scope,
						'alert':$scope.addAlert,
						'ip':$scope.sys.ip,
						'mask':$scope.sys.mask
					};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				//toaster.pop('success','成功', '服务器已关机。');
			}else{
				
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	/**
	 * 打开终端组管理 重起，关机 -  弹窗
	 */
	$scope.openModalCgCtl = function(str,item,str2) {
		var temp_name = '';
		if(str == 'reboot'){
			//   
			temp_name = '确定要重起吗？';
		}else if(str == 'shutdown'){
			temp_name = '确定要关机吗？';
		}
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':temp_name};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				if(str2 == 'all'){
					//   所有
					var temp_arr = [];
					for(var i in $scope.grps){
						temp_arr.push($scope.grps[i].id);
					}
					cgCtl(0, str);
				}else{
					//   单个
					cgCtl(item.id, str);
				}
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	
	/**
	 * 终端组设置自动起动镜像 -  弹窗
	 */
	$scope.openModalAutoImg = function(gid,osid) {
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定设置为自动起动镜像？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				autobootImg(gid,osid);
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	
	/**
	 * 开启系统弹窗
	 */
	$scope.openModalstartServer = function() {
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定要开启系统吗？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				startServer();
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	/**
	 * 关闭系统弹窗
	 */
	$scope.openModalstopServer = function() {
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_alert.html',
			controller: 'modalAlertCtrl',
			windowClass: 'm-modal-alert',
			size: 'sm',
			resolve: {
				items: function() {
					return {'title':'确定要关闭系统吗？'};
				}
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				stopServer();
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
	
	
	// 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

	$scope.echarts_option1 = {
	    series: [
	        {
	            type:'pie',
	            radius: ['80%', '100%'],
	            avoidLabelOverlap: false,
	            hoverAnimation:false,
	            animation:false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '30',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {value:0, itemStyle:{normal:{color:'#feb609'}}},
	                {value:70, itemStyle:{normal:{color:'#fdf3e5'}}}
	            ]
	        }
	    ]
	};
	$scope.echarts_option2 = {
	    series: [
	        {
	            type:'pie',
	            radius: ['80%', '100%'],
	            avoidLabelOverlap: false,
	            hoverAnimation:false,
	            animation:false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '30',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {value:30, itemStyle:{normal:{color:'#31CFC2'}}},
	                {value:70, itemStyle:{normal:{color:'#E6FAF4'}}}
	            ]
	        }
	    ]
	};
	$scope.echarts_option3 = {
	    series: [
	        {
	            type:'pie',
	            radius: ['80%', '100%'],
	            avoidLabelOverlap: false,
	            hoverAnimation:false,
	            animation:false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '30',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {value:30, itemStyle:{normal:{color:'#FF499A'}}},
	                {value:70, itemStyle:{normal:{color:'#FBE9F2'}}}
	            ]
	        }
	    ]
	};
	
	
	
	
	//开始定义定时器
	var tm=$scope.setglobaldata.gettimer("app.server");
	if(tm.Key!="app.server"){
		tm.Key="app.server";
		tm.keyctrl="app.server";
		tm.fnAutoRefresh=function(){
			console.log("开始调用定时器");
			tm.interval = $interval(function() {
				//   取服务状态
				//  sysStatus();
				//   取终端状态
				cliStatus();
			}, 5000);
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
		//   取菜单
		//$scope.getMenu();
		
		$scope.table_search();
		//   查询终端组
		getCliGrps();
		
		//   取服务状态
		sysStatus();
		//   取终端状态
		cliStatus();
		//
		tm.fnAutoRefreshfn(tm);
	}
	run();

}]);

/**
 * 管理子权限弹窗
 */
app.controller('modalXtglYhglCdglCtrl', ['$scope', 'globalFn', 'httpService', 'items', '$modalInstance', function($scope, globalFn, httpService, items, $modalInstance) {

	//   items
	$scope.items = items;

	/**
	 * 表格1
	 */
	$scope.table_data = {
		//   是否菜单
		is_menu_items: [{
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
		is_menu_item: {
			title: '全部',
			val: ""
		},
		form: {
			fucecode: $scope.items.fucecode,
			page: 1,
			pageSize: 1000
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
	 * 添加修改表单
	 */
	$scope.add_form = {
		fuceurlname: "",
		fucecode: "",
		fuceurlresource: ""
	}

	/**
	 * 查询列表
	 */
	var findFunctionList = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/Rest/function/findFunctionSonList', form)
			.then(function(res) {
				if(res.status == 200 && res.data) {
					angular.extend($scope.table_data.table_res, res.data);
					console.log($scope.table_data)
				} else {
					$scope.table_data.table_res.rows = [];
				}
			});
	}

	/**
	 * 操作
	 */
	$scope.table_operate = function(str, item) {
		if(str == 'son') {
			openSon(item);
		} else if(str == 'del') {
			menuDel(item);
		} else if(str == 'edit') {
			$scope.add_form.fuceurlname = item.fuceurlname;
			$scope.add_form.fucecode = $scope.items.fucecode;
			$scope.add_form.fuceurlresource = item.fuceurlresource;
		}
	}

	/**
	 *   添加修改
	 */

	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	//   run
	var run = function() {
		findFunctionList($scope.table_data.form);
	}
	run();

}]);

/**
 * 添加修改弹窗
 */
app.controller('modalAddXtglYhglCdglCtrl', ['$scope', 'globalFn', 'httpService', 'items', '$modalInstance', function($scope, globalFn, httpService, items, $modalInstance) {

	//   items
	$scope.items = items;

	/**
	 * 表格1
	 */
	$scope.table_data = {
		//   是否菜单
		is_menu_items: [{
				title: '是',
				val: '1'
			},
			{
				title: '不是',
				val: '0'
			},
		],
		is_menu_item: {
			title: '是',
			val: '1'
		}
	}

	/**
	 * 添加修改表单
	 */
	$scope.add_form = {
		"fuceid": "",
		"fucecode": "",
		"fucename": "",
		"fucelevel": "",
		"fucedesc": "",
		"fuceresource": "",
		"fuceindex": "",
		"fuceparentcode": "",
		"fuceismenu": $scope.table_data.is_menu_items[0].val,
		"ownerType": '0',
	}

	$scope.fuceismenuChange = function() {
		$scope.add_form.fuceismenu = $scope.table_data.is_menu_item.val.toString();
	}

	/**
	 * 添加修改
	 */
	var doFunctionSave = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/Rest/function/doFunctionSave', form)
			.then(function(res) {
				console.log(res)
			});
	}

	/**
	 *   添加修改
	 */

	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.ok = function() {
		console.log($scope.add_form);
		doFunctionSave($scope.add_form);
	}

	//   run
	var run = function() {
		//   编辑
		if($scope.items.operate == 'edit') {
			angular.extend($scope.add_form, $scope.items.item);
			//   选中是否菜单
			if($scope.add_form.fuceismenu == 1) {
				$scope.table_data.is_menu_item = $scope.table_data.is_menu_items[0];
			}
		} else if($scope.items.operate == 'add') {
			//   父级ID
			$scope.add_form.fuceparentcode = $scope.items.select_item.fucecode;
		}

		//  层级
		$scope.add_form.fucelevel = (+$scope.items.select_item.level + 1).toString();

	}
	run();

}]);

/**
 * 添加修改弹窗
 */
app.controller('modalRoleXtglYhglCdglCtrl', ['$scope', 'globalFn', 'httpService', 'items', '$modalInstance', function($scope, globalFn, httpService, items, $modalInstance) {

	//   items
	$scope.items = items;

	/**
	 * 
	 */
	$scope.ztree_options = {
		check: {
			enable: true
		},

		data: {
			key: {
				name: 'fucename'
			},
			simpleData: {
				enable: true,
				idKey: 'fucecode',
				pIdKey: 'fuceparentcode'
			}
		},
		callback: {
			onCheck: function(e, t, n) {
				console.log(n);
				console.log($scope.zTree.getCheckedNodes(true))
			}
		},

		//   数据
		data_tree: []
	}

	//   取菜单
	var getMenu = function() {
		//
		httpService.ajaxPost(httpService.API.origin + '/Rest/function/findAllMenuFunctionList')
			.then(function(data) {
				if(data.status == 200) {
					if(data.data.length > 0) {
						$scope.ztree_options.data_tree = data.data;
						console.log($scope.ztree_options);
					}
				}
			});
	}

	/**
	 * 添加修改
	 */
	var doFunctionSave = function(form) {
		httpService.ajaxPost(httpService.API.origin + '/Rest/function/doFunctionSave', form)
			.then(function(res) {
				console.log(res)
			});
	}

	/**
	 *   添加修改
	 */

	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.ok = function() {}

	//   run
	var run = function() {
		getMenu();
	}
	run();

}]);