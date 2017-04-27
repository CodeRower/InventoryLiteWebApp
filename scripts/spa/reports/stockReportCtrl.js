(function (app) {
    'use strict';

    app.controller('stockReportCtrl', stockReportCtrl);

    stockReportCtrl.$inject = ['$scope', '$modal', 'apiService', 'notificationService'];

    function stockReportCtrl($scope, $modal, apiService, notificationService) {

        $scope.pageClass = 'page-customers';
        $scope.loadingStocks = false;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.Stocks = [];
        $scope.ResetFields = resetFields;

        $scope.search = search;
        $scope.clearSearch = clearSearch;
        $scope.filterStocks = {};
        $scope.filterStocks.type = 1;

        function search(page) {
            page = page || 0;

            var filterData = {

                ChamberID: $scope.filterStocks.Chamber ? $scope.filterStocks.Chamber.ID : $scope.filterStocks.Chamber,
                LotID: $scope.filterStocks.Lot ? $scope.filterStocks.Lot.ID : $scope.filterStocks.Lot,
                PageNo: page,
                PageSize: 2
            };

            $scope.loadingStocks = true;

            apiService.post('/api/report/getStockReport', filterData,
            StocksLoadCompleted,
            StocksLoadFailed);
        }

        function StocksLoadCompleted(result) {
            $scope.Stocks = result.data;

            //$scope.page = result.data.Page;
            //$scope.pagesCount = result.data.TotalPages;
            //$scope.totalCount = result.data.TotalCount;
            $scope.loadingStocks = false;
            calculateTotalAmount();

            if ($scope.Stocks && $scope.Stocks.length) {
                notificationService.displayInfo(result.data.length + ' Stocks found');
            }

        }

        function StocksLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function clearSearch() {
            $scope.filterStocks = '';
            search();
        }

        function calculateTotalAmount() {
            $scope.TotalDozen = 0;
            $scope.TotalCrate = 0;
            for (var i = 0; i < $scope.Stocks.length; i++) {
                $scope.TotalDozen += $scope.Stocks[i].MeasurementUnit;
                $scope.TotalCrate += $scope.Stocks[i].NumberOfCrate;
            }
        }

        function resetFields() {
            $scope.filterStocks.Chamber = null;
            $scope.filterStocks.Lot = null;
        }

        function loadChambers() {
            apiService.get('/api/chamber/', null,
            chambersLoadCompleted,
            chambersLoadFailed);
        }
        function chambersLoadCompleted(response) {
            $scope.chambers = response.data;
        }
        function chambersLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function loadLots() {

            apiService.get('/api/purchase/', null,
                              lotsLoadCompleted,
                              lotsLoadFailed);

        }

        function lotsLoadCompleted(result) {
            $scope.lots = result.data;
        }

        function lotsLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        loadChambers();
        loadLots();

    }

})(angular.module('InventoryLite'));
