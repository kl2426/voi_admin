'use strict';
/**
 * Created by Administrator on 2016/7/21.
 * 
 */




/**
 * 
 */
angular.module('app').factory('httpService', function ($http, $q, $location) {
	//
	var http = {
		dev:{
			protocol: $location.protocol() + ':',
			hostname: $location.host(),
			port: $location.port(),
			hash:''
		},
		dev2:{
			protocol:'http:',
			hostname:'192.168.0.129',
			port:'80',
			hash:''
		}
		
	}
	http.dev.origin = http.dev.protocol + '//' + http.dev.hostname + ':' + http.dev.port;
	//http.dev.origin = "";
	http.dev.href = http.dev.origin + http.dev.hash;
	
	//
    return {

        //========================================================================
        // 下面是通过$http访问后台进行记录的增、删、改、查
        //========================================================================

        //GET请求
        ajaxGet: function (url, params) {
            var deferred = $q.defer();
            $http({
                url: url,
                method: "GET",
                params: params
            })
                .success(function (data, status, headers, config) {
                	var temp_obj = {data:data,status:status,headers:headers,config:config};
                    deferred.resolve(temp_obj);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject('Service error ');
                })
            return deferred.promise;
        },
        //DELETE请求
        ajaxDelete: function (url) {
            var deferred = $q.defer();
            $http({
                url: url,
                method: "DELETE",
                params: {}
            })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject('Service error ');
                })
            return deferred.promise;
        },
        //POST请求
        ajaxPost: function (url, data, out, params) {
        	out ? out : out = 30 * 1000;
            var deferred = $q.defer();
            $http({
                url: url,
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                data:$.param(data),
                timeout:out,
                params: params ? params : {}
            }).success(function (data, status, headers, config) {
            		var temp_obj = {data:data,status:status,headers:headers,config:config};
                    deferred.resolve(temp_obj);
               }).error(function (data, status, headers, config) {
               		var temp_obj = {data:data,status:status,headers:headers,config:config};
                    deferred.resolve(temp_obj);
                });
            return deferred.promise;
        },
        //PUT请求
        ajaxPut: function (url, row) {
            var deferred = $q.defer();
            $http({
                url: url,
                method: "PUT",
                data: row,
                params: {}
            })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject('Service error ');
                })
            return deferred.promise;
        },
        //
        API:http.dev
    };
});

