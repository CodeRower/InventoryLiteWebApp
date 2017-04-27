(function (app) {
    'use strict';

    app.controller('subgroupCtrl', subgroupCtrl);

    subgroupCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    function subgroupCtrl($scope, $location, $routeParams, apiService, notificationService) {

        $scope.pageClass = 'page-movies';
        $scope.AddSubGroup = AddSubgroup;
        $scope.FillSubGroup = fillSubGroup;
        $scope.LoadSubGroup = loadSubGroup;

        $scope.groups = [];
        $scope.subGroups = [];
        $scope.subgroup = {};

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

         function loadSubGroup(group) {
             apiService.get('/api/subGroup/' + group.ID, null,
             subGroupLoadCompleted,
             subGroupLoadFailed);
         }

         //function loadSubGroup(group) {
         //    apiService.get('/api/subGroup/', null,
         //    subGroupLoadCompleted,
         //    subGroupLoadFailed);
         //}

         function subGroupLoadCompleted(response) {
             $scope.subGroups = response.data;             
         }

         function subGroupLoadFailed(response) {
             notificationService.displayError(response.data);
         }

         function AddSubgroup() {
            $scope.subgroup.GroupMasterID = $scope.subgroup.Group.ID;
          
            AddSubgroupModel();
         }
        
         function AddSubgroupModel() {
            apiService.post('/api/subgroup/add', $scope.subgroup,
            addSubgroupSucceded,
            addSubgroupFailed);
        }

         function addSubgroupSucceded(response) {
            notificationService.displaySuccess($scope.subgroup.SubgroupName + ' has been submitted to Inventory Lite');
            redirectToEdit();
        }

         function addSubgroupFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

         function redirectToEdit() {
            $location.url('/');
        }

         function fillSubGroup(id) {
             $scope.subgroup.ID = $scope.subGroups[id].ID;
             $scope.subgroup.Group = $.grep($scope.groups, function (e) { return e.ID == $scope.subGroups[id].GroupMasterID; })[0];
             $scope.subgroup.SubGroupName = $scope.subGroups[id].SubGroupName;
             $scope.subgroup.AccountNumber = $scope.subGroups[id].AccountNumber;
             $scope.subgroup.AddressLine1 = $scope.subGroups[id].AddressLine1;
             $scope.subgroup.AddressLine2 = $scope.subGroups[id].AddressLine2;
             $scope.subgroup.AddressLine3 = $scope.subGroups[id].AddressLine3;
             $scope.subgroup.PhoneNumber = $scope.subGroups[id].PhoneNumber;
             $scope.subgroup.OpeningBalance = $scope.subGroups[id].OpeningBalance;
             $scope.subgroup.CreditDebit = $scope.subGroups[id].CreditDebit;
        }
        
        loadGroups();
        
        
    }

})(angular.module('InventoryLite'));
