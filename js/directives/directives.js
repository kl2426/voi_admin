'use strict';

/**
 * 
 */
angular.module('app')
	.directive('myTable', ['httpService','$compile','$timeout', function(httpService,$compile,$timeout) {
		return {
			restrict: 'E, A, C',
			link: function(scope, element, attrs, controller) {
				//   默认参数
				var options = scope.table_options;
				if('tableOptions' in attrs){
					options = eval('(' + attrs.tableOptions + ')');
				}
				//   语言
				var language = {  
	                'emptyTable': '没有数据',  
	                'loadingRecords': '加载中...',  
	                'processing': '查询中...',  
	                'search': '检索:',  
	                'lengthMenu': '每页 _MENU_ 条',  
	                'zeroRecords': '没有数据',  
	                'paginate': {  
	                    'first':      '第一页',  
	                    'last':       '最后一页',  
	                    'next':       '下一页',  
	                    'previous':   '上一页'  
	                },  
	                'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',  
	                'infoEmpty': '没有数据',  
	                'infoFiltered': '(过滤总件数 _MAX_ 条)'  
	            }
				if(!('language' in options)){
					options.language = language;
				}
				
				//  dom定位
				if(!('dom' in options)){
					options.dom = '<"dataTable_top"<"table-form">><"row"<""t>><"row"<"col-sm-4 col-xs-12"l><"col-sm-2 text-center col-xs-12"i><"col-sm-6 col-xs-12"p>>';
				}
				
				var myTableFn = function(){
					/*Javascript代码片段*/
					scope.myTable = element.DataTable({
						"processing": true,
						"serverSide": true,
						ajax: function(d, callback, settings) {
							console.log(scope.table_options);
							debugger
							console.log(d);
							if('form' in options){
								if('search_page' in options.form){
									options.form.page = +options.form.search_page + 1;
									options.form.search_page = undefined;
								}else{
									options.form.page = +d.start + 1;
								}
								options.form.pageSize = d.length;
							}else{
								options.form = d;
							}
							console.log('form................',options.form)
							httpService.ajaxPost(httpService.API.origin + options.url, options.form)
							.then(function(res) {
								console.log('dataaaaaaaaaaaa',res);
								if(res.status == 200) {
									var temp_data = {
										//   获取请求次数
										//"draw":d.draw,
										//   总启记录数
										"recordsTotal": res.data.total,
										//   过滤后的记录数
										"recordsFiltered": res.data.total,
										//   数据
										"data": res.data.rows
									}
									callback(temp_data);
								}
							});
						},
						//每页显示三条数据
						pageLength: options.pageLength,
						columns: options.columns,
						columnDefs:options.columnDefs,
						language:options.language,
						dom:options.dom,
						//   完成事件
						drawCallback: function( settings ) {
					        element.parents('.table-responsive').find(".form").appendTo($(settings.nTableWrapper).find(".table-form"));
							scope.myTable.columns.adjust();
							//  scope.myTable.page(options.form.page - 1).draw( false );
							//   刷新 angular 标签
							$compile($(settings.nTable).find('tbody')[0])(scope);
					    }
					});
				}
				
				
				myTableFn();	

			}
		};
	
	
	}])
	


	//    百度 echarts 指令
	.directive('eChart', [function () {
	
	    function link($scope, element, attrs) {
	        // 基于准备好的dom，初始化echarts图表
	        var myChart = echarts.init(element[0]);
	
	        //监听options变化
	        if (attrs.uiOptions) {
	            attrs.$observe('uiOptions', function () {
	                var options = $scope.$eval(attrs.uiOptions);
	                if (angular.isObject(options)) {
	                	if(options.fn){
	                		//  formatter
		                	options = $scope.$parent.formatter(options,element);
		                };
	                    myChart.setOption(options);
	                }
	            }, true);
	        }
	    }
	    return {
	        restrict: 'A',
	        link: link
	    };
	}]);


/**
 * 弹窗拖动
 */
angular.module('app').directive('modalMove', ['$timeout','$document', function($timeout,$document) {
    function link(scope, element, attr) {
    	//   延迟生成dom
    	var timer = $timeout(function(){
    		//
    		var dialog = element.parents(".modal-dialog");
    		var dialogHeight = dialog.height();
    		var wHeight = jQuery(window).height();
    		var wWidth = jQuery(window).width();
    		var header = dialog.find(".g-modal-header");
    		//   弹窗居中
    		if(dialogHeight < wHeight){
    			dialog.css("margin-top",(wHeight - dialogHeight) / 2);
    		}
    		//
    		var startX = 0, startY = 0, x = 0, y = 0;
            //
            header.css({
                position: 'relative',
                cursor: 'move'
            });
			//
            header.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                //   不超过屏幕
                if(event.pageY > 0 && event.pageX > 0 && event.pageX < wWidth && event.pageY < wHeight){
                	dialog.css({
	                top: y + 'px',
	                left:  x + 'px'
	                });
                }
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }


    	},50);
    };
    return {
        restrict: 'A',
        link: link
    };
}]);