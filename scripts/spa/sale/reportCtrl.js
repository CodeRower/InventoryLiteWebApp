(function (app) {
    'use strict';

    app.controller('saleReportCtrl', saleReportCtrl);

    saleReportCtrl.$inject = ['$scope', '$modal', 'apiService', 'notificationService'];

    function saleReportCtrl($scope, $modal, apiService, notificationService) {

        $scope.pageClass = 'page-customers';
        $scope.loadingSales = false;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.Sales = [];

        $scope.search = search;
        $scope.clearSearch = clearSearch;
        $scope.TotalAmount = 0;
        $scope.TotalQty = 0;

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.startdatepicker = {};
        $scope.enddatepicker = {};
        $scope.openDatePicker = openDatePicker;
        function openDatePicker($event, datepickerValue) {
            $event.preventDefault();
            $event.stopPropagation();
            if (datepickerValue == 1) {
                $scope.startdatepicker.opened = true;
            } else if (datepickerValue == 2) {
                $scope.enddatepicker.opened = true;
            }
        };

        function search(page) {
            page = page || 0;

            var filterData = {
                FromDate: $scope.filterSales.FromDate,
                ToDate: $scope.filterSales.ToDate,
                LotID: $scope.filterSales.Lot ? $scope.filterSales.Lot.ID : $scope.filterSales.Lot,
                PageNo: page,
                PageSize: 25
            };

            $scope.loadingSales = true;

            apiService.post('/api/sale/getSaleReportData    ', filterData,
            salesLoadCompleted,
            salesLoadFailed);
        }

        function salesLoadCompleted(result) {
            $scope.Sales = result.data;
            calculateTotalQtyAndAmount();
            //$scope.page = result.data.Page;
            //$scope.pagesCount = result.data.TotalPages;
            //$scope.totalCount = result.data.TotalCount;
            $scope.loadingSales = false;

            if ($scope.Sales && $scope.Sales.length) {
                notificationService.displayInfo(result.data.length + ' sale found');
            }

        }

        function calculateTotalQtyAndAmount() {
            $scope.TotalAmount = 0;
            $scope.TotalQty = 0;
            for (var i = 0; i < $scope.Sales.length; i++) {
                $scope.TotalAmount += $scope.Sales[i].Amount;
                $scope.TotalQty += $scope.Sales[i].Qty;
            }
        }
        
        function salesLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function clearSearch() {
            $scope.filterSales = '';
            search();
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

        loadLots();

    }

})(angular.module('InventoryLite'));
