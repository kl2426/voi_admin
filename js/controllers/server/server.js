'use strict';

app.controller('serverCtrl', ['$scope', '$timeout', 'globalFn', 'httpService', '$modal','toaster', function($scope, $timeout, globalFn, httpService, $modal,toaster) {

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
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cliStatus',form)
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
	 * 打开未注册弹窗
	 */
	$scope.openModalNO = function() {
		
		
    
    
		var modalInstance = $modal.open({
			templateUrl: 'tpl/modal/server/modal_no.html',
			controller: 'modalServerNOCtrl',
			//size: size,
			resolve: {
				items: function() {
					return {};
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			console.log(selectedItem)
        	toaster.pop('success','注册完成', '成功注册系统');
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
					return {};
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			console.log(selectedItem)
        	toaster.pop('success','成功', '已进入部署模式');
			//$scope.selected = selectedItem;
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

		modalInstance.result.then(function(selectedItem) {
			console.log(selectedItem)
        	toaster.pop('success','成功', '服务器已重起。');
			//$scope.selected = selectedItem;
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

		modalInstance.result.then(function(selectedItem) {
			console.log(selectedItem)
        	toaster.pop('success','成功', '服务器已关机。');
			//$scope.selected = selectedItem;
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
					return {'scope':$scope};
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			console.log(selectedItem)
        	toaster.pop('success','成功', '服务器已关机。');
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
	                {value:30, itemStyle:{normal:{color:'#feb609'}}},
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