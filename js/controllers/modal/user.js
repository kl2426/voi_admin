'use strict';


/**
 * 添加用户
 */
app.controller('modalUserListAddCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster', function($scope,  globalFn, httpService,items,$modalInstance,toaster) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {
		//   用户名
		name: '',
		//   真实姓名
		realName: '',
		//   用户组ID
		gid: null,
		//   终端组ID
		mGrpName: null,
		//   组名
		grpName: '',
		//   原密码
		pwd: '',
		//   新密码
		newpwd: ''
		
	}
	
	//   用户组
	$scope.groups = {}
	$scope.groups.items = [];
	$scope.groups.item = "";
	
	//   终端组
	$scope.terminals = {}
	$scope.terminals.items = [];
	$scope.terminals.item = {};
	
	//   用户组change
	$scope.groupsChange = function(item){
		$scope.form.gid = item.id;
	}
	
	//   终端组change
	$scope.terminalsChange = function(item){
		$scope.form.grpName = item.name;
		$scope.form.mGrpName = item.id;
	}
	
	
	
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
	
	
	
	//   添加用户
	var addUser = function(){
		var temp_obj = {};
		if(!$scope.form.name){
			return false;
		}else{
			temp_obj.user = $scope.form.name;
		}
		//
		if(!$scope.form.realName){
			return false;
		}else{
			temp_obj.realName = $scope.form.realName;
		}
		//
		if($scope.form.gid === null){
			return false;
		}else{
			temp_obj.gid = +$scope.form.gid;
		}
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/addUser',temp_obj)
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
	
	//   修改用户
	var editUser = function(){
		var temp_obj = {
			id: $scope.form.id
		};
		//
		if(!$scope.form.realName){
			return false;
		}else{
			temp_obj.realName = $scope.form.realName;
		}
		//
		if($scope.form.gid === null){
			return false;
		}else{
			temp_obj.gid = +$scope.form.gid;
		}
		// 
		if($scope.form.gid != 1 && $scope.form.mGrpName === null){
			return false;
		}else{
			temp_obj.mGid = $scope.form.mGrpName;
		}
		// 
		if(!$scope.form.newpwd){
			//return false;
		}else{
			temp_obj.newPwd = $scope.form.newpwd;
		}
		// 
		if(!$scope.form.pwd){
			//return false;
		}else{
			temp_obj.pwd = $scope.form.pwd;
		}
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/modifyUser',temp_obj)
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
				addUser();
			break;
			case 'edit':
				editUser();
			break;
		}
	}
	
	
	//   run
	var run = function(){
		//
		angular.extend($scope.form, $scope.items.item);
		//  取用户组
		getUserGroups();
		//  终端组
		getTerminals();
	}
	run();
}]);



/**
 * 移动到用户组
 */
app.controller('modalUserListMoveCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster', function($scope,  globalFn, httpService,items,$modalInstance,toaster) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {
		//   用户名
		name: '',
		//   真实姓名
		realName: '',
		//   用户组ID
		gid: null,
		//   终端组ID
		mGrpName: null,
		//   组名
		grpName: '',
		//   原密码
		pwd: '',
		//   新密码
		newpwd: ''
		
	}
	
	//   用户组
	$scope.groups = {}
	$scope.groups.items = [];
	$scope.groups.item = "";
	
	//   终端组
	$scope.terminals = {}
	$scope.terminals.items = [];
	$scope.terminals.item = {};
	
	//   用户组change
	$scope.groupsChange = function(item){
		$scope.form.gid = item.id;
	}
	
	//   终端组change
	$scope.terminalsChange = function(item){
		$scope.form.grpName = item.name;
		$scope.form.mGrpName = item.id;
	}
	
	
	
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
	
	
	
	//   添加用户
	var addUser = function(){
		var temp_obj = {};
		if(!$scope.form.name){
			return false;
		}else{
			temp_obj.user = $scope.form.name;
		}
		//
		if(!$scope.form.realName){
			return false;
		}else{
			temp_obj.realName = $scope.form.realName;
		}
		//
		if($scope.form.gid === null){
			return false;
		}else{
			temp_obj.gid = +$scope.form.gid;
		}
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/addUser',temp_obj)
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
	
	//   修改用户
	var editUser = function(){
		var temp_obj = {
			id: $scope.form.id
		};
		//
		if(!$scope.form.realName){
			return false;
		}else{
			temp_obj.realName = $scope.form.realName;
		}
		//
		if($scope.form.gid === null){
			return false;
		}else{
			temp_obj.gid = +$scope.form.gid;
		}
		// 
		if($scope.form.gid != 1 && $scope.form.mGrpName === null){
			return false;
		}else{
			temp_obj.mGid = $scope.form.mGrpName;
		}
		// 
		if(!$scope.form.newpwd){
			//return false;
		}else{
			temp_obj.newPwd = $scope.form.newpwd;
		}
		// 
		if(!$scope.form.pwd){
			//return false;
		}else{
			temp_obj.pwd = $scope.form.pwd;
		}
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/modifyUser',temp_obj)
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
//		switch($scope.items.operate){
//			case 'add':
//				addUser();
//			break;
//			case 'edit':
//				editUser();
//			break;
//		}
		
		$modalInstance.close($scope.form.gid);

	}
	
	
	//   run
	var run = function(){
		//
		angular.extend($scope.form, $scope.items.item);
		//  取用户组
		getUserGroups();
		//  终端组
		getTerminals();
	}
	run();
}]);












/**
 * 添加用户组
 */
app.controller('modalUserTypeAddCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster', function($scope,  globalFn, httpService,items,$modalInstance,toaster) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {
		//  id
		id: undefined,
		//   组名
		name: '',
		//   镜像ID数组
		imgs : [],
		//   镜像 ID 数组 表单使用
		imgs_ids: [],
		//   网盘大小
		diskSize: 0,
		//   描述
		desc : null,
	}
	
	//   镜像
	$scope.imgs = {}
	$scope.imgs.items = [];
	$scope.imgs.item = [];
	
	
	//   用户组change
	$scope.imgsChange = function(items){
		$scope.form.imgs_ids = [];
		for(var i in items){
			$scope.form.imgs_ids.push(items[i].imgs_ids.id);
		}
	}
	
	//    取镜像
	var getImgs = function() {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getImgs')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
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
					//   查看时加载
					$scope.imgs.item = [];
					for(var i in $scope.form.imgs){
						for(var b in temp_arr){
							if(temp_arr[b].imgs_ids.id == $scope.form.imgs[i][0]){
								$scope.imgs.item.push(temp_arr[b]);
							}
						}
					}
				} else {
					$scope.imgs.items = [];
					$scope.imgs.item = [];
				}
			});
	}
	
	
	
	//   添加用户组
	var addUserType = function(){
		var temp_obj = {};
		if(!$scope.form.name){
			return false;
		}else{
			temp_obj.group = $scope.form.name;
		}
		//
		if(isNaN($scope.form.diskSize)){
			return false;
		}else{
			temp_obj.diskSize = $scope.form.diskSize;
		}
		//
		temp_obj.imgs  = $scope.form.imgs_ids;
		temp_obj.desc  = $scope.form.desc;
		
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/addGroup',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '新建用户组成功');
				$modalInstance.close(true);
			} else {
				toaster.pop('warning', '失败', res.data.msg);
			}
		});
	}
	
	//   修改用户
	var editUserType = function(){
		var temp_obj = {
			id: $scope.form.id
		};
		//
		if(!$scope.form.name){
			return false;
		}else{
			temp_obj.group = $scope.form.name;
		}
		//
		if(isNaN($scope.form.diskSize)){
			return false;
		}else{
			temp_obj.diskSize = $scope.form.diskSize;
		}
		//
		temp_obj.imgs  = $scope.form.imgs_ids;
		temp_obj.desc  = $scope.form.desc;
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/modifyGroup',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '修改用户组成功');
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
				addUserType();
			break;
			case 'edit':
				editUserType();
			break;
		}
	}
	
	
	//   run
	var run = function(){
		//
		angular.extend($scope.form, $scope.items.item);
		//  取镜像
		getImgs();
		
		//   默认选中镜像 提交时使用
		if($scope.form.imgs.length > 0){
			$scope.form.imgs_ids = [];
			for(var i in $scope.form.imgs){
				$scope.form.imgs_ids.push($scope.form.imgs[i][0]);
			}
		}
	}
	run();
}]);










