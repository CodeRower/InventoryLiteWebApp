(function (app) {
    'use strict';

    app.controller('purchaseReportCtrl', purchaseReportCtrl);

    purchaseReportCtrl.$inject = ['$scope', '$modal', 'apiService', 'notificationService'];

    function purchaseReportCtrl($scope, $modal, apiService, notificationService) {

        $scope.pageClass = 'page-customers';
        $scope.loadingPurchases = false;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.Purchases = [];

        $scope.search = search;
        $scope.clearSearch = clearSearch;

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
                FromDate: $scope.filterPurchases.FromDate,
                ToDate: $scope.filterPurchases.ToDate,
                PageNo: page,
                PageSize: 25
            };

            $scope.loadingPurchases = true;

            apiService.post('/api/purchase/', filterData,
            purchasesLoadCompleted,
            purchasesLoadFailed);
        }

        function purchasesLoadCompleted(result) {
            $scope.Purchases = result.data.Items;

            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.loadingPurchases = false;

            if ($scope.filterPurchases && $scope.filterPurchases.length) {
                notificationService.displayInfo(result.data.Items.length + ' purchases found');
            }

        }

        function purchasesLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function clearSearch() {
            $scope.filterPurchases = '';
            search();
        }
        
    }

})(angular.module('InventoryLite'));
