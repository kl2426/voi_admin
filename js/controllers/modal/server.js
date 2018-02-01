'use strict';


/**
 * 服务输入许可证弹窗
 */
app.controller('modalServerNOCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance', function($scope,  globalFn, httpService,items,$modalInstance) {
	
	//   items
	$scope.items = items;
	
	
	$scope.form = {
		//  序列号
		'lic': ''
	}
	
	
	//    系统注册
	var systemReg = function(lic) {
		if(!lic){
			return false;
		}
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/systemReg',{'lic': lic})
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
		if(!(/^\S{1,64}$/.test($scope.form.name))){
			$scope.items.alert('danger','许可证输入错误');
			return false;
		}
		systemReg($scope.form.lic);
	}
	
	
	//   run
	var run = function(){
	}
	run();
	
	
}]);


/**
 * 开启部署模式 弹窗
 */
app.controller('modalServerAdminPwdCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance', function($scope,  globalFn, httpService,items,$modalInstance) {
	
	//   items
	$scope.items = items;
	
	$scope.form = {
		pwd:''
	}
	
	//    开启部署模式
	var startDeploy = function(pwd) {
		if(!pwd){
			return false;
		}
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/startDeploy',{'pwd': pwd})
			.then(function(res) {
				if(res.status == 200 && res.data.retCode == 0) {
					//  添加成功
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
		if($scope.form.pwd.length < 1){
			$scope.items.alert('danger','密码不能为空');
		}
		startDeploy($scope.form.pwd);
	}
	
	
	//   run
	var run = function(){
		
	}
	run();
	
	
}]);



/**
 * 确认弹窗 弹窗
 */
app.controller('modalAlertCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance', function($scope,  globalFn, httpService,items,$modalInstance) {
	
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
 * 网络配置 弹窗
 */
app.controller('modalServerIpCtrl', ['$scope', 'globalFn', 'httpService','items','$modalInstance','$timeout','toaster', function($scope,  globalFn, httpService,items,$modalInstance,$timeout,toaster) {
	
	//   items
	$scope.items = items;
	
	//  
	$scope.title = "重启服务器？";
	
	$scope.title = $scope.items.title;
	
	$scope.form = {
		ip:[null,null,null,null],
		mask:[null,null,null,null],
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
            
        }  else if (temp_val.length == 3) {
        	$timeout(function(){
        		$(e.target).parent().next().find('input').focus();
        	},10);
            
        } else if (!(/^\d$/.test(e.key)) && e.key !== 'Backspace') {
        	$timeout(function(){
        		item[name][index] = temp_val.substr(0, temp_val.length - 1);
        	},10);
            
            
        }
	}
	
	
	//   配置ip
	var nwConf = function(){
		var temp_obj = {};
		// mac
		var temp_ip = $scope.form.ip.join(".");
		if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(temp_ip)){
			temp_obj.ip = temp_ip;
		}else{
			$scope.items.alert('danger','IP地址输入错误');
			return false;
		}
		// mac
		var temp_mask = $scope.form.mask.join(".");
		if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(temp_mask)){
			temp_obj.mask = temp_mask;
		}else{
			$scope.items.alert('danger','子网掩码输入错误');
			return false;
		}
		//
		httpService.ajaxPost(httpService.API.origin + '/rest/ajax.php/nwConf',temp_obj)
		.then(function(res) {
			if(res.status == 200 && res.data.retCode == 0) {
				//  添加成功
				toaster.pop('success','成功', '配置成功');
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
		nwConf();
	}
	
	
	
	
	//   run
	var run = function(){
		//
		if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test($scope.items.ip)){
			$scope.form.ip = $scope.items.ip.split('.');
		}
		if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test($scope.items.mask)){
			$scope.form.mask = $scope.items.mask.split('.');
		}
	}
	run();
	
	
}]);