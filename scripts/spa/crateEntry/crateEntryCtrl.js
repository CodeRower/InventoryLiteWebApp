(function (app) {
    'use strict';

    app.controller('crateEntryCtrl', crateEntryCtrl);

    crateEntryCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    var childWindowObject = null;

    function crateEntryCtrl($scope, $location, $routeParams, apiService, notificationService) {

        $scope.pageClass = 'page-movies';
        $scope.AddCrateEntry = addCrateEntry;
        $scope.LoadSubGroup = loadSubGroup;
        $scope.crateEntry = {};
        $scope.crateEntry.CreatedDate = new Date();
        $scope.OpenSubGroup = openSubGroup;

        $scope.LoadCrateDetails = loadCrateDetails;
        $scope.AddCrateDetails = addCrateDetails;
        $scope.RemoveCrateDetail = removeCrateDetail;

        $scope.crateDetails = [];

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.datepicker = {};
        $scope.openDatePicker = openDatePicker;
        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker.opened = true;
        };

        function addCrateDetails() {
            $scope.crateDetails.push({
                Transaction: '',
                Crate: '',
                NumberOfCrate: "",
                ID: 0
            })
        }
        addCrateDetails();

        function removeCrateDetail(idx) {
            $scope.crateDetails.splice(idx, 1);
        }

        $scope.groups = [];
        $scope.transactions = [];
        $scope.crates = [];
        $scope.subGroups = [];

        window.onfocus = function () {
            if (childWindowObject != null && !childWindowObject.closed) {
                childWindowObject.focus();
            }
            else {
                loadSubGroup($scope.crateEntry.Group);
            }
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

        function loadTransactions() {
            apiService.get('/api/transactionType/', null,
            transactionsLoadCompleted,
            transactionsLoadFailed);
        }
        function transactionsLoadCompleted(response) {
            $scope.transactions = response.data;
        }
        function transactionsLoadFailed(response) {
            notificationService.displayError(response.data);
        }


        function loadCrates() {
            apiService.get('/api/crate/', null,
            cratesLoadCompleted,
           cratesLoadFailed);
        }
        function cratesLoadCompleted(response) {
            $scope.crates = response.data;
        }
        function cratesLoadFailed(response) {
            notificationService.displayError(response.data);
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


        function addCrateEntry() {
            $scope.crateEntry.GroupMasterID = $scope.crateEntry.Group.ID;
            $scope.crateEntry.SubGroupID = $scope.crateEntry.SubGroup.ID;

            $scope.crateEntry.CrateDetails = [];

            for (var detailIdx = 0; detailIdx < $scope.crateDetails.length; detailIdx++) {
                var selDet = $scope.crateDetails[detailIdx];
                var det = {
                    NumberOfCrate: selDet.NumberOfCrate,
                    ID: selDet.ID
                }

                if (selDet.Transaction != undefined) {
                    det.TransactionMasterID = selDet.Transaction.ID;
                }

                if (selDet.Crate != undefined) {
                    det.CrateMasterID = selDet.Crate.ID;
                }

                $scope.crateEntry.CrateDetails.push(det);
            }

            addCrateModel();
        }

        function addCrateModel() {
            apiService.post('/api/crateEntry/add', $scope.crateEntry,
            addCrateSucceded,
            addCrateFailed);
        }

        function redirectToEdit() {
            $location.url('/');
        }

        function addCrateSucceded(response) {
            notificationService.displaySuccess('Crate has been submitted to Inventory Lite');
            $scope.crateEntry = {};
            redirectToEdit();
        }

        function addCrateFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function resetToDefaultState() {
            var createdDate = $scope.crateEntry.CreatedDate;
            $scope.crateEntry = {};
            $scope.crateEntry.CreatedDate = createdDate;
            $scope.crateDetails = [];
            addCrateDetails();
        }

        function loadCrateDetails() {

            var crateModel = {};

            if ($scope.crateEntry.Group && $scope.crateEntry.SubGroup && $scope.crateEntry.CreatedDate) {

                crateModel = {
                    GroupMasterID: $scope.crateEntry.Group.ID,
                    SubGroupID: $scope.crateEntry.SubGroup.ID,
                    CreatedDate: $scope.crateEntry.CreatedDate
                };
                apiService.post('/api/crateEntry/Get', crateModel, loadDetailsSucedded, loadDetailsFailed);
            } else {
                resetToDefaultState();
            }
        };

        function loadDetailsSucedded(response) {

            if (response.data.length > 0) {
                for (var detailIdx = 0; detailIdx < response.data.length; detailIdx++) {
                    $scope.crateDetails[detailIdx] = {
                        Transaction: { ID: response.data[detailIdx].TransactionMasterID },
                        NumberOfCrate: response.data[detailIdx].NumberOfCrate,
                        Crate: { ID: response.data[detailIdx].CrateMasterID },
                        ID: response.data[detailIdx].ID
                    };

                }
            }
        }

        function loadDetailsFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function openSubGroup() {
            childWindowObject = window.open('#/master/addSubgroup', 'MsgWindow', "width=1200, height=700");
        }

        loadGroups();
        loadTransactions();
        loadCrates();
    }

})(angular.module('InventoryLite'));
