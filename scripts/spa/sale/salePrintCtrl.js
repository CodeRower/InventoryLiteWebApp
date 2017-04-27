(function (app) {
    'use strict';

    app.controller('salePrintCtrl', salePrintCtrl);

    salePrintCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService', '$timeout'];

  
    function salePrintCtrl($scope, $location, $routeParams, apiService, notificationService, $timeout) {

        $scope.pageClass = 'page-movies';
        $scope.LoadData = loadData;
        
        function loadData(parameter) {

            var filterData = {
                BillID: parameter.billID,
                WithRate: parameter.rateRequired
            };           

            apiService.post('/api/sale/getsaledata/', filterData,
            loadCompleted,
            loadFailed);
        }

        function loadCompleted(response) {
            $scope.Sales = response.data;
            $scope.saleData = response.data[0];
        }

        function loadFailed(response) {
            notificationService.displayError(response.data);
        }
       
        loadData($location.search())
    }

})(angular.module('InventoryLite'));
