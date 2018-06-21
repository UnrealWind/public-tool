angular.module('infi-basic')
    .service('DataService',['$http',function($http){

        this.ajaxList = function(filter){
            return $http.get('data/list.json').then(function(data){
                return data.data;
            });
        }

        this.ajaxColumns = function(name){
            return $http.get('data/'+name+'.columns.json').then(function(data){
                return data.data;
            });
        }

    }]);