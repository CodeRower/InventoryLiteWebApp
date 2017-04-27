(function (app) {
    'use strict';

    app.controller('balanceReportCtrl', balanceReportCtrl);

    balanceReportCtrl.$inject = ['$scope', '$modal', 'apiService', 'notificationService'];

    function balanceReportCtrl($scope, $modal, apiService, notificationService) {

        $scope.pageClass = 'page-customers';
        $scope.loadingBalances = false;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.Balances = [];
        $scope.TotalCredit = 0;
        $scope.TotalDebit = 0;
        $scope.search = search;
        $scope.clearSearch = clearSearch;
        $scope.filterBalances = {};
        $scope.filterBalances.ForCrate = true;

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
                //FromDate: $scope.filterBalances.FromDate,
                //ToDate: $scope.filterBalances.ToDate,
                GroupID: $scope.filterBalances.Group.ID,
                ForCrate: $scope.filterBalances.ForCrate,
                PageNo: page,
                PageSize: 2
            };

            $scope.loadingBalances = true;

            if ($scope.filterBalances.ForCrate) {
                apiService.post('/api/report/getBalanceCrateReportData', filterData,
            BalancesLoadCompleted,
            BalancesLoadFailed);
            }
            else {
                apiService.post('/api/report/getBalanceReportData', filterData,
            BalancesLoadCompleted,
            BalancesLoadFailed);
            }
        }

        function BalancesLoadCompleted(result) {
            $scope.Balances = result.data;
            calculateTotalBalance();
            //$scope.page = result.data.Page;
            //$scope.pagesCount = result.data.TotalPages;
            //$scope.totalCount = result.data.TotalCount;
            $scope.loadingBalances = false;

            if ($scope.Balances && $scope.Balances.length) {
                notificationService.displayInfo(result.data.length + ' Balances found');               
            }

        }

        function BalancesLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function calculateTotalBalance() {            
            for (var i = 0; i < $scope.Balances.length; i++) {
                if ($scope.filterBalances.ForCrate)
                {
                    if ($scope.Balances[i].NoOfCrate > 0) {
                        $scope.TotalCredit += $scope.Balances[i].NoOfCrate;
                    } else {
                        $scope.TotalDebit += $scope.Balances[i].NoOfCrate;
                    }
                }
                else {
                    if ($scope.Balances[i].Amount > 0) {
                        $scope.TotalCredit += $scope.Balances[i].Amount;
                    } else {
                        $scope.TotalDebit += $scope.Balances[i].Amount;
                    }
                }
                
            }

            $scope.TotalDebit = $scope.TotalDebit < 0 ? $scope.TotalDebit * -1 : '--';
            $scope.TotalCredit = $scope.TotalCredit > 0 ? $scope.TotalCredit : '--';
        }

        function clearSearch() {
            $scope.filterBalances = '';
            search();
        }


        function loadGroups() {
            apiService.get('/api/group/', null,
            groupsLoadCompleted,
            groupsLoadFailed);
        }
        function groupsLoadCompleted(response) {
            $scope.groups = response.data;
        }
        function groupsLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        loadGroups();
        
    }

})(angular.module('InventoryLite'));
