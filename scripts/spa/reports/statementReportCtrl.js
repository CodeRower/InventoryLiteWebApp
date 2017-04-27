(function (app) {
    'use strict';

    app.controller('statementReportCtrl', statementReportCtrl);

    statementReportCtrl.$inject = ['$scope', '$modal', 'apiService', 'notificationService'];

    function statementReportCtrl($scope, $modal, apiService, notificationService) {

        $scope.pageClass = 'page-customers';
        $scope.loadingStatements = false;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.Statements = [];
        $scope.LoadSubGroup = loadSubGroup;
        $scope.TotalCredit = 0;
        $scope.TotalDebit = 0;
        $scope.search = search;
        $scope.clearSearch = clearSearch;
        $scope.filterStatements = {};
        $scope.filterStatements.ForCrate = true;
        $scope.RemainingAmount = 0;

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
                FromDate: $scope.filterStatements.FromDate,
                ToDate: $scope.filterStatements.ToDate,
                GroupID: $scope.filterStatements.Group.ID,
                SubGroupID: $scope.filterStatements.SubGroup.ID,
                ForCrate: $scope.filterStatements.ForCrate,
                PageNo: page,
                PageSize: 2
            };

            $scope.loadingStatements = true;

            if ($scope.filterStatements.ForCrate) {
                apiService.post('/api/report/getCrateStatement', filterData,
            StatementsLoadCompleted,
            StatementsLoadFailed);
            }
            else {
                apiService.post('/api/report/getBalanceStatement', filterData,
            StatementsLoadCompleted,
            StatementsLoadFailed);
            }

        }

        function StatementsLoadCompleted(result) {
            $scope.Statements = result.data;
            calculateTotalBalance();
            //$scope.page = result.data.Page;
            //$scope.pagesCount = result.data.TotalPages;
            //$scope.totalCount = result.data.TotalCount;
            $scope.loadingStatements = false;

            if ($scope.Statements && $scope.Statements.length) {
                notificationService.displayInfo(result.data.length + ' Statements found');
            }

        }

        function StatementsLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function calculateTotalBalance() {
            $scope.TotalCredit = 0;
            $scope.TotalDebit = 0;
            for (var i = 0; i < $scope.Statements.length; i++) {
                if ($scope.Statements[i].IsCredit) {
                    $scope.TotalCredit += $scope.filterStatements.ForCrate ? $scope.Statements[i].NoOfCrate : $scope.Statements[i].Amount;
                } else {
                    $scope.TotalDebit += $scope.filterStatements.ForCrate ? $scope.Statements[i].NoOfCrate : $scope.Statements[i].Amount;
                }
            }

            $scope.RemainingAmount = $scope.TotalCredit - $scope.TotalDebit;

            $scope.TotalDebit = $scope.TotalDebit > 0 ? $scope.TotalDebit : '--';
            $scope.TotalCredit = $scope.TotalCredit > 0 ? $scope.TotalCredit : '--';
        }

        function clearSearch() {
            $scope.filterStatements = '';
            search();
        }

        function loadSubGroup(group) {
            apiService.get('/api/subGroup/' + group.ID, null,
            subGroupLoadCompleted,
            subGroupLoadFailed);
        }
        function subGroupLoadCompleted(response) {
            $scope.subGroups = response.data;
        }

        function subGroupLoadFailed(response) {
            notificationService.displayError(response.data);
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
