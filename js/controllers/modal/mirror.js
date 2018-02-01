'use strict';


/**
 * 添加镜像模板
 */
app.controller('modalMirrorTemplateAddCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster','$timeout', function($scope,  globalFn, httpService,items,$modalInstance,toaster,$timeout) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {
		//   模板名
		name: '',
		//   操作系统(win7为1， win10为2)  允许值: 1, 2 
		os: null,
		os_items: [
			{val:1,name:'win7'},
			{val:2,name:'win10'},
		],
		os_item: '',
		//   系统位宽,默认64    64 32
		bitWidth: null,
		bitWidth_items: [
			{val:64,name:'64位'},
			{val:32,name:'32位'},
		],
		bitWidth_item: '',
		//   C盘大小 系统中显示的C盘大小，单位为G
		size: null,
		//   终端模型，具体型号待定,编号从1开始
		model: null,
		model_items: [
			{val:1,name:'未定'},
		],
		model_item: '',
		//   模板文件名,select中option的值为镜像名(模板列表通过getExtTpls获取)
		imgName: '',
		imgName_items: [],
		imgName_item: '',
		//   描述
		desc: '',
	}
	//
	$scope.form.os_item = $scope.form.os_items[0];
	$scope.form.os = $scope.form.os_item.val;
	
	$scope.form.bitWidth_item = $scope.form.bitWidth_items[0];
	$scope.form.bitWidth = $scope.form.bitWidth_item.val;
	
	$scope.form.model_item = $scope.form.model_items[0];
	$scope.form.model = $scope.form.model_item.val;
	
	
	
	//   操作系统change
	$scope.osChange = function(item){
		$scope.form.os = item.val;
	}
	//   系统位宽change
	$scope.bitWidthChange = function(item){
		$scope.form.bitWidth = item.val;
	}
	//   终端模型change
	$scope.modelChange = function(item){
		$scope.form.model = item.val;
	}
	//   模板文件名change
	$scope.imgNameChange = function(item){
		$scope.form.imgName = item.name;
	}
	
	
	
	//    取模板
	var getTpl = function(id) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/getTpl', {id: id})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					angular.extend($scope.form, res.data);
					//
					var os_items = $scope.form.os_items;
					for(var i in os_items){
						if(os_items[i].val == res.data.os){
							$scope.form.os_item = os_items[i];
							$scope.form.os = $scope.form.os_item.val;
						}
					}
					//
					var bitWidth_items = $scope.form.bitWidth_items;
					for(var i in bitWidth_items){
						if(bitWidth_items[i].val == res.data.bitWidth){
							$scope.form.bitWidth_item = bitWidth_items[i];
							$scope.form.os = $scope.form.bitWidth_item.val;
						}
					}
					//
					var model_items = $scope.form.model_items;
					for(var i in model_items){
						if(model_items[i].val == res.data.model){
							$scope.form.model_item = model_items[i];
							$scope.form.os = $scope.form.model_item.val;
						}
					}
				} else {
					//
				}
			});
	}
	
	//    取获取外部模板文件
	var getExtTpls = function() {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/getExtTpls', {})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.form.imgName_items = res.data.tpls;
					//  选中 
					for(var i in res.data.tpls){
						if(res.data.tpls[i].name == $scope.form.imgName){
							$scope.form.imgName_item = res.data.tpls[i];
						}
					}
				} else {
					//
				}
			});
	}
	
	
	
	//   添加模板
	var addTpl = function(){
		var temp_obj = {};
		//
		if(!(/^\S{3,16}$/.test($scope.form.name))){
			$scope.items.alert('danger','模板名称输入错误,必须3-16字符');
			return false;
		}else{
			temp_obj.name = $scope.form.name;
		}
		// size
		if(/^\d*$/.test($scope.form.size)){
			temp_obj.size = +$scope.form.size;
		}else{
			$scope.items.alert('danger','镜像大小输入错误');
			return false;
		}
		//
		if($scope.form.imgName === ''){
			$scope.items.alert('danger','模板文件输入错误');
			return false;
		}else{
			temp_obj.imgName = $scope.form.imgName;
		}
		//
		temp_obj.os = +$scope.form.os;
		temp_obj.bitWidth = +$scope.form.bitWidth;
		temp_obj.model = +$scope.form.model;
		temp_obj.desc = $scope.form.desc;
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/addTpl',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '新建模板成功');
				$modalInstance.close(true);
			} else {
				toaster.pop('warning', '失败', res.data.msg);
			}
		});
	}
	
	//   修改
	var editTpl = function(){
		var temp_obj = {
			id: $scope.form.id
		};
		if(!(/^\S{3,16}$/.test($scope.form.name))){
			$scope.items.alert('danger','模板名称输入错误,必须3-16字符');
			return false;
		}else{
			temp_obj.name = $scope.form.name;
		}
		// size
		if(/^\d*$/.test($scope.form.size)){
			temp_obj.size = +$scope.form.size;
		}else{
			$scope.items.alert('danger','镜像大小输入错误');
			return false;
		}
		//
		temp_obj.os = +$scope.form.os;
		temp_obj.bitWidth = +$scope.form.bitWidth;
		temp_obj.model = +$scope.form.model;
		temp_obj.desc = $scope.form.desc;
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/editTpl',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '编辑模板成功');
				$modalInstance.close(true);
			} else {
				toaster.pop('warning', '失败', res.data.msg);
			}
		});
	}
	
	
	//   应用为模板
	var applyTpl = function(){
		var temp_obj = {
			id: $scope.items.item2.id
		};
		if(!(/^\S{3,16}$/.test($scope.form.name))){
			$scope.items.alert('danger','模板名称输入错误,必须3-16字符');
			return false;
		}else{
			temp_obj.name = $scope.form.name;
		}
		temp_obj.desc = $scope.form.desc;
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/applyTpl',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '应用模板成功');
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
				addTpl();
			break;
			case 'edit':
				editTpl();
			break;
			case 'new':
				applyTpl();
			break;
		}
	}
	
	
	//   run
	var run = function(){
		//  
		if($scope.items.operate == 'edit' || $scope.items.operate == 'new'){
			angular.extend($scope.form, $scope.items.item);
			//   模板详情
			getTpl($scope.form.id);
		}
		//   外部模板文件
		getExtTpls();
	}
	run();
}]);









/**
 * 添加镜像克隆
 */
app.controller('modalMirrorTemplateCopyCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster','$timeout', function($scope,  globalFn, httpService,items,$modalInstance,toaster,$timeout) {
	//   items
	$scope.items = items;
	
	//  
	$scope.best_url = httpService.API.origin + '/dist/img/';
	
	//   form
	$scope.form = {
		//   模板id
		tplId: null,
		tplId_items: [],
		tplId_item: '',
		//   镜像名
		imgName: '',
		//   是否个性化，0为否，1为是，默认0
		isPersonal: 0,
		isPersonal_items: [
			{val:0, name:'否'},
			{val:1, name:'是'},
		],
		isPersonal_item: '',
		//   镜像图片(getPics获取可用图片)
		pic: '',
		pic_items: [],
		pic_item: '',
		//   授权终端组
		mid: '',
		mid_items: [],
		mid_item: '',
		//   授权用户组id数组
		grps: [],
		grps_items: [],
		grps_item: [],
		//   描述
		desc: '',
	}
	//
	$scope.form.isPersonal_item = $scope.form.isPersonal_items[0];
	$scope.form.isPersonal = $scope.form.isPersonal_item.val;
	
	
	
	//   模板change
	$scope.tplIdChange = function(item){
		$scope.form.tplId = item.id;
	}
	//   是否个性化change
	$scope.isPersonalChange = function(item){
		$scope.form.isPersonal = item.val;
	}
	//   授权终端组change
	$scope.midChange = function(item){
		$scope.form.mid = item.id;
	}
	//   镜像图片change
	$scope.picChange = function(item){
		$scope.form.pic = item.name;
	}
	//   授权用户组change
	$scope.grpsChange = function(items){
		$scope.form.grps = [];
		for(var i in items){
			$scope.form.grps.push(items[i].id);
		}
	}
	
	
	
	/**
	 * 取模板列表
	 */
	var showTpls = function() {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/showTpls',{})
			.then(function(res) {
				console.log(res);
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.form.tplId_items = res.data.tpls;
					//  加入选中
					for(var i in res.data.tpls){
						if(res.data.tpls[i].id == $scope.form.id){
							$scope.form.tplId_item = res.data.tpls[i];
						}
					}
				} else {
					$scope.form.tplId_items = [];
				}
			});
	}
	
	
	//    取终端组
	var getCliGrp = function() {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getCliGrps')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.form.mid_items = res.data.grps;
					//   选中
					for(var i in res.data.grps){
						if(res.data.grps[i].id == $scope.form.mid){
							$scope.form.mid_item = res.data.grps[i];
						}
					}
				} else {
					$scope.form.mid_items = [];
				}
			});
	}
	
	
	//    取用户组
	var getUserGroups = function() {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getUserGroups')
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.form.grps_items = res.data.groups;
					//   选中
					$scope.form.grps_item = [];
					for(var i in res.data.groups){
						for(var b in $scope.form.grps){
							if(res.data.groups[i].id == $scope.form.grps[b]){
								$scope.form.grps_item.push(res.data.groups[i]);
							}
						}
					}
				} else {
					$scope.form.grps_items = [];
				}
			});
	}
	
	//    获取镜像图片
	var getPics = function() {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/getPics', {})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.form.pic_items = res.data.pics;
				} else {
					$scope.form.pic_items = [];
				}
			});
	}
	
	//    获取镜像
	var getImg = function(id,cb) {
		httpService.ajaxGet(httpService.API.origin + '/rest/ajax.php/getImg', {id: id})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					//  选中  
					for(var i in $scope.form.isPersonal_items){
						if($scope.form.isPersonal_items[i].val == res.data.isPersonal){
							$scope.form.isPersonal_item = $scope.form.isPersonal_items[i];
							$scope.form.isPersonal = $scope.form.isPersonal_item.val;
						}
					}
					//
					$scope.form.tplId_items = [{name: res.data.tpl}];
					$scope.form.tplId_item = $scope.form.tplId_items[0];
					//
					$scope.form.imgName = res.data.name;
					//
					$scope.form.mid_items = [{name: res.data.name}];
					$scope.form.mid_item = $scope.form.mid_items[0];
					//
					$scope.form.mid = res.data.cliGrp;
					//
					$scope.form.grps = res.data.userGrps;
					$scope.form.desc = res.data.desc;
				} else {
					//$scope.form.pic_items = [];
				}
				typeof cb == "function" && cb(res.data);
			});
	}
	
	
	
	//   添加
	var imgClone = function(){
		var temp_obj = {
			tplId: $scope.form.id
		};
		//
		if(!(/^\S{3,16}$/.test($scope.form.imgName))){
			$scope.items.alert('danger','镜像名称输入错误,必须3-16字符');
			return false;
		}else{
			temp_obj.imgName = $scope.form.imgName;
		}
		//
		if(!$scope.form.mid){
			$scope.items.alert('danger','请选择授权终端组');
			return false;
		}else{
			temp_obj.mid = +$scope.form.mid;
		}
		if($scope.form.grps.length > 0){
			temp_obj.grps = $scope.form.grps;
		}else{
			$scope.items.alert('danger','请选择授权用户组');
			return false;
		}
		//
		temp_obj.isPersonal = +$scope.form.isPersonal;
		temp_obj.pic = $scope.form.pic;
		temp_obj.desc = $scope.form.desc;
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/imgClone',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '克隆模板成功');
				$modalInstance.close(true);
			} else {
				toaster.pop('warning', '失败', res.data.msg);
			}
		});
	}
	
	
	
	
	//   修改
	var editImg = function(){
		var temp_obj = {
			id: $scope.form.id
		};
		//
		if(!(/^\S{3,16}$/.test($scope.form.imgName))){
			$scope.items.alert('danger','镜像名称输入错误,必须3-16字符');
			return false;
		}else{
			temp_obj.imgName = $scope.form.imgName;
		}
		//
		if($scope.form.grps.length > 0){
			temp_obj.grps = $scope.form.grps;
		}else{
			$scope.items.alert('danger','请选择授权用户组');
			return false;
		}
		temp_obj.desc = $scope.form.desc;
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/editImg',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '修改镜像成功');
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
			case 'copy':
				imgClone();
			break;
			case 'edit':
				editImg();
			break;
		}
	}
	
	
	//   run
	var run = function(){
		//  
		if($scope.items.operate == 'copy'){
			angular.extend($scope.form, $scope.items.item);
			//   取模板列表
			showTpls();
			//   取终端组
			getCliGrp();
			//   用户组
			getUserGroups();
			//   图片
			getPics();
		}else if($scope.items.operate == 'edit'){
			$scope.form.id = $scope.items.item.id;
			getImg($scope.items.item.id, function(){
				//   取模板列表
				showTpls();
				//   取终端组
				getCliGrp();
				//   用户组
				getUserGroups();
				//   图片
				getPics();
			});
		}
		
	}
	run();
}]);




/**
 * 部署完成 确认弹窗
 */
app.controller('modalMirrorAlertCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance', function($scope,  globalFn, httpService,items,$modalInstance) {
	
	//   items
	$scope.items = items;
	
	//  
	$scope.title = "重启服务器？";
	
	$scope.title = $scope.items.title;
	
	//  close
	$scope.cancel = function() {
		$modalInstance.close(false);
	};
	
	$scope.ok = function(){
		$modalInstance.close(true);
	}
	
	
	//   run
	var run = function(){
	}
	run();
	
	
}]);





/**
 * 选择镜像还原点弹窗 
 */
app.controller('modalMirrorListMoveCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster', function($scope,  globalFn, httpService,items,$modalInstance,toaster) {
	//   items
	$scope.items = items;
	
	//   form
	$scope.form = {
		
	}
	
	
	//   还原点
	$scope.restore = {}
	$scope.restore.items = [];
	$scope.restore.item = "";
	
	
	//   终端组change
	$scope.restoreChange = function(item){
		$scope.form.restore_id = item.id;
	}
	
	//    取终端组
	var getRestoreList = function(id) {
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/getRestoreList',{'id':id})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					$scope.restore.items = res.data.snps;
				} else {
					$scope.restore.items = [];
				}
			});
	}
	
	
	//  close
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.ok = function(){
		if($scope.form.restore_id.toString().length < 1){
			$scope.items.alert('danger','还原点必选');
			return false;
		}
		//
		$modalInstance.close($scope.form.restore_id);
	}
	
	
	//   run
	var run = function(){
		//
		angular.extend($scope.form, $scope.items.item);
		//
		getRestoreList($scope.form.id);
	}
	run();
}]);






















