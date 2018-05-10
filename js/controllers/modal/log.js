'use strict';


/**
 * 添加终端注册
 */
app.controller('modalLogSeeCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','toaster','$timeout', function($scope,  globalFn, httpService,items,$modalInstance,toaster,$timeout) {
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











