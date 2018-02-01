'use strict';


/**
 * 添加终端注册
 */
app.controller('modalTerminalListAddCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster','$timeout', function($scope,  globalFn, httpService,items,$modalInstance,toaster,$timeout) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {
		//   终端名
		name: '',
		//   计算机名
		clientName: '',
		//   mac
		mac: '',
		//
		mac_arr: ['00','00','00','00','00','00'],
		//   终端组ID
		gid: null,
	}
	
	
	//   终端组
	$scope.terminals = {}
	$scope.terminals.items = [];
	$scope.terminals.item = "";
	
	
	//   终端组change
	$scope.terminalsChange = function(item){
		$scope.form.gid = item.id;
	}
	
	
	$scope.bindKeyUp = function(e,index,item,name){
		var temp_val = item[name][index] || '';
        if (e.keyCode === 110) {
        	$timeout(function(){
        		item[name][index] = temp_val.substr(0, temp_val.length - 1);
            	$(e.target).parent().next().find('input').focus();
        	},10);
            
        } else if (e.key === 'Backspace' && (temp_val === null || temp_val === '') ) {
        	$timeout(function(){
        		$(e.target).parent().prev().find('input').focus();
        	},10);
            
        }else if (e.key === 'Tab') {
        	$timeout(function(){
        		//$(e.target).parent().next().find('input').focus();
        	},10);
            
        }  else if (temp_val.length == 2) {
        	$timeout(function(){
        		$(e.target).parent().next().find('input').focus();
        	},10);
            
        } else if (!(/^\w$/.test(e.key)) && e.key !== 'Backspace') {
        	$timeout(function(){
        		item[name][index] = temp_val.substr(0, temp_val.length - 1);
        	},10);
            
            
        }
	}
	
	
	//    取终端组
	var getTerminals = function(cb) {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/showCliGrp')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.terminals.items = res.data.grps;
					//  编辑时显示终端组选中项
					typeof cb == "function" && cb();
					
				} else {
					$scope.terminals.items = [];
				}
			});
	}
	
	//    取编辑时 终端组ID
	var getCli = function(id) {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getCli',{id:id})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.form.gid = res.data.gid;
					//  
					for(var i in $scope.terminals.items){
						if($scope.terminals.items[i].id == $scope.form.gid){
							$scope.terminals.item = $scope.terminals.items[i];
						}
					}
				} else {
					$scope.form.gid = null;
				}
			});
	}
	
	
	
	//   添加用户
	var addClient = function(){
		var temp_obj = {};
		//
		if(!(/^\S{3,16}$/.test($scope.form.name))){
			$scope.items.alert('danger','终端名称输入错误,必须3-16字符');
			return false;
		}else{
			temp_obj.name = $scope.form.name;
		}
		// mac
		var temp_mac = $scope.form.mac_arr.join(":");
		if(/^\w{2}:\w{2}:\w{2}:\w{2}:\w{2}:\w{2}$/.test(temp_mac)){
			temp_obj.mac = temp_mac;
		}else{
			$scope.items.alert('danger','Mac地址输入错误');
			return false;
		}
		//
		if($scope.form.gid === null){
			$scope.items.alert('danger','终端组未选择');
			return false;
		}else{
			temp_obj.gid = +$scope.form.gid;
		}
		temp_obj.clientName  = $scope.form.clientName;
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cliReg',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '新建用户成功');
				$modalInstance.close(true);
			} else {
				toaster.pop('warning', '失败', res.data.msg);
			}
		});
	}
	
	//   修改
	var editClient = function(){
		var temp_obj = {
			mid: $scope.form.id
		};
		//
		if(!(/^\S{3,16}$/.test($scope.form.name))){
			$scope.items.alert('danger','终端名称输入错误,必须3-16字符');
			return false;
		}else{
			temp_obj.name = $scope.form.name;
		}
		// mac
		var temp_mac = $scope.form.mac_arr.join(":");
		if(/^\w{2}:\w{2}:\w{2}:\w{2}:\w{2}:\w{2}$/.test(temp_mac)){
			temp_obj.mac = temp_mac;
		}else{
			$scope.items.alert('danger','Mac地址输入错误');
			return false;
		}
		//
		if($scope.form.gid === null){
			$scope.items.alert('danger','终端组未选择');
			return false;
		}else{
			temp_obj.gid = +$scope.form.gid;
		}
		temp_obj.clientName  = $scope.form.clientName;
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/cliEdit',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '修改用户成功');
				$modalInstance.close(true);
			} else {
				toaster.pop('warning', '失败', res.data.msg);
			}
		});
	}
	
	
	
	
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		switch($scope.items.operate){
			case 'add':
				addClient();
			break;
			case 'edit':
				editClient();
			break;
		}
	}
	
	
	//   run
	var run = function(){
		//
		angular.extend($scope.form, $scope.items.item);
		//  
		if($scope.items.operate == 'edit'){
			$scope.form.mac_arr = $scope.form.mac.split(':');
		}
		
		//  终端组
		getTerminals(function(){
			//   选中终端组
			if($scope.form.id){
				getCli($scope.form.id);
			}
		});
		
		
	}
	run();
}]);



/**
 * 移动到终端组
 */
app.controller('modalTerminalListMoveCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster', function($scope,  globalFn, httpService,items,$modalInstance,toaster) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {
		
	}
	
	
	//   终端组
	$scope.terminals = {}
	$scope.terminals.items = [];
	$scope.terminals.item = "";
	
	
	//   终端组change
	$scope.terminalsChange = function(item){
		$scope.form.gid = item.id;
	}
	
	//    取终端组
	var getTerminals = function() {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/showCliGrp')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.terminals.items = res.data.grps;
					//  输入用户组
					for(var i in $scope.terminals.items){
						if($scope.terminals.items[i].id == $scope.form.mGrpName){
							$scope.terminals.item = $scope.terminals.items[i];
						}
					}
				} else {
					$scope.terminals.items = [];
				}
			});
	}
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		if(!$scope.form.gid){
			$scope.items.alert('danger','终端组必选');
			return false;
		}
		//
		$modalInstance.close($scope.form.gid);
	}
	
	
	//   run
	var run = function(){
		//
		angular.extend($scope.form, $scope.items.item);
		//  终端组
		getTerminals();
	}
	run();
}]);





/**
 * 终端绑定用户
 */
app.controller('modalTerminalListUserCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster', function($scope,  globalFn, httpService,items,$modalInstance,toaster) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {
		
	}
	
	
	//   未绑定过的用户
	$scope.user = {}
	$scope.user.items = [];
	$scope.user.item = "";
	
	
	//   终端组change
	$scope.userChange = function(item){
		$scope.form.user_id = item.id;
	}
	
	//    取用户
	var getUsers = function() {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/getUsers',{})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.user.items = res.data.users;
					//  输入用户组
					for(var i in $scope.user.items){
						if($scope.user.items[i].name == $scope.form.user){
							$scope.user.item = $scope.user.items[i];
						}
					}
				} else {
					$scope.user.items = [];
				}
			});
	}
	
	
	//   绑定 
	var bindUsers = function(mid,uid) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/bind',{'mid':mid,'uid':uid})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$modalInstance.close(true);
				} else {
					$modalInstance.close(false);
				}
			});
	}
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		if(!$scope.form.user_id){
			$scope.items.alert('danger','用户必选');
			return false;
		}
		//
		bindUsers($scope.form.id, $scope.form.user_id);
	}
	
	
	//   run
	var run = function(){
		//
		angular.extend($scope.form, $scope.items.item);
		//  
		getUsers();
	}
	run();
}]);






/**
 * 添加终端组
 */
app.controller('modalTerminalTypeAddCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster', function($scope,  globalFn, httpService,items,$modalInstance,toaster) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {
		//  id
		id: undefined,
		//   组名
		name: '',
		//   是否离线   0 离线，1在线
		offline: 1,
		//   镜像ID数组
		imgs : [],
		//   镜像 ID 数组 表单使用
		imgs_ids: [],
		//   描述
		desc : null,
	}
	
	//   离线模式
	$scope.offline = {}
	$scope.offline.items = [
		{'name':'是','val':1},
		{'name':'否','val':0},
	];
	$scope.offline.item = $scope.offline.items[0];
	$scope.form.offline = $scope.offline.item.val;
	
	//   镜像
	$scope.imgs = {}
	$scope.imgs.items = [];
	$scope.imgs.item = [];
	
	//   离线模式change
	$scope.offlineChange = function(item){
		$scope.form.offline = item.val;
	}
	
	//   镜像change
	$scope.imgsChange = function(items){
		$scope.form.imgs_ids = [];
		for(var i in items){
			$scope.form.imgs_ids.push(items[i].imgs_ids.id);
		}
	}
	
	//    取指定终端组
	var getCliGrp = function(id) {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getCliGrp',{'id':id})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					//
					$scope.form.id = id;
					$scope.form.name = res.data.name;
					$scope.form.desc = res.data.desc;
					$scope.form.imgs = res.data.imgs;
					$scope.form.offline = res.data.offline;
					//  加入已选中
					for(var i in $scope.imgs.items){
						for(var b in $scope.form.imgs){
							if($scope.imgs.items[i].imgs_ids.id == $scope.form.imgs[b].id){
								$scope.imgs.item.push($scope.imgs.items[i]);
							}
						}
					}
				} else {
					
				}
			});
	}
	
	//    取镜像
	var getImgs = function(id,cb) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/getUsableImgs',{'gid':id})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					//   所有未绑定
					var data = res.data.tpls;
					var temp_arr = [];
					for(var i in data){
						var temp_obj = data[i];
						for(var b in data[i].imgs){
							var temp_ids = angular.copy(temp_obj);
							temp_ids.imgs_ids = data[i].imgs[b];
							temp_arr.push(temp_ids);
						}
					}
					$scope.imgs.items = temp_arr;
					//   加入选中
					typeof cb == "function" && cb(res);
				} else {
					$scope.imgs.items = [];
					$scope.imgs.item = [];
				}
			});
	}
	
	
	
	//   添加终端组
	var addCliGrp = function(){
		var temp_obj = {};
		if(!(/^\S{3,16}$/.test($scope.form.name))){
			$scope.items.alert('danger','终端组名称输入错误,必须3-16字符');
			return false;
		}else{
			temp_obj.name = $scope.form.name;
		}
		//
		temp_obj.offline  = $scope.form.offline;
		temp_obj.imgs  = $scope.form.imgs_ids;
		temp_obj.desc  = $scope.form.desc;
		
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/addCliGrp',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '新建终端组成功');
				$modalInstance.close(true);
			} else {
				toaster.pop('warning', '失败', res.data.msg);
			}
		});
	}
	
	//   修改
	var editCliGrp = function(){
		var temp_obj = {
			gid: $scope.form.id
		};
		if(!$scope.form.name){
			return false;
		}else{
			//   组名
			temp_obj.name = $scope.form.name;
		}
		//
		temp_obj.offline  = $scope.form.offline;
		temp_obj.imgs  = $scope.form.imgs_ids;
		temp_obj.desc  = $scope.form.desc;
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/editCliGrp',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '修改终端组成功');
				$modalInstance.close(true);
			} else {
				toaster.pop('warning', '失败', res.data.msg);
			}
		});
	}
	
	
	
	
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		switch($scope.items.operate){
			case 'add':
				addCliGrp();
			break;
			case 'edit':
				editCliGrp();
			break;
		}
	}
	
	
	//   run
	var run = function(){
		//   添加
		if($scope.items.operate == 'add'){
			//  取镜像
			getImgs(0);
		}
		
		//   修改
		if($scope.items.operate == 'edit' && 'id' in $scope.items.item){
			//   加入选中
			getImgs($scope.items.item.id, function(res){
				//   取信息
				getCliGrp($scope.items.item.id);
			});
		}
	}
	run();
}]);




















