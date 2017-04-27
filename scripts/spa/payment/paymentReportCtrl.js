(function (app) {
    'use strict';

    app.controller('paymentReportCtrl', paymentReportCtrl);

    paymentReportCtrl.$inject = ['$scope', '$modal', 'apiService', 'notificationService'];

    function paymentReportCtrl($scope, $modal, apiService, notificationService) {

        $scope.pageClass = 'page-customers';
        $scope.loadingPurchases = false;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.Purchases = [];
        $scope.TotalCredit = 0;
        $scope.TotalDebit = 0;
        $scope.RemainingAmount = 0;

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
                PageSize: 20
            };

            $scope.loadingPurchases = true;

            apiService.post('/api/payment/', filterData,
            purchasesLoadCompleted,
            purchasesLoadFailed);
        }

        function purchasesLoadCompleted(result) {
            $scope.Purchases = result.data.Items;

            //$scope.page = result.data.Page;
            //$scope.pagesCount = result.data.TotalPages;
            $scope.OpeningBalance = result.data.TotalCount;
            calculateTotalBalance();

            $scope.loadingPurchases = false;

            if ($scope.Purchases && $scope.Purchases.length) {
                notificationService.displayInfo(result.data.Items.length + ' payments found');
            }

        }

        function calculateTotalBalance() {
            $scope.TotalCredit = 0;
            $scope.TotalDebit = 0;

            //calculate total
            for (var i = 0; i < $scope.Purchases.length; i++) {
                if ($scope.Purchases[i].TransactionMasterID == 1) {
                    $scope.TotalCredit += $scope.Purchases[i].Amount;
                } else {
                    $scope.TotalDebit += $scope.Purchases[i].Amount;
                }
            }
            if ($scope.OpeningBalance > 0) {
                $scope.TotalCredit = $scope.TotalCredit + $scope.OpeningBalance;
            }
            else {
                $scope.TotalDebit = $scope.TotalDebit - $scope.OpeningBalance;
            }

            $scope.RemainingAmount = $scope.TotalCredit - $scope.TotalDebit;

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
