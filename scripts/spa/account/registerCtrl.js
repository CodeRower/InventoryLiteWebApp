(function (app) {
    'use strict';

    app.controller('registerCtrl', registerCtrl);

    registerCtrl.$inject = ['$scope', 'membershipService', 'notificationService', '$rootScope', '$location', 'apiService'];

    function registerCtrl($scope, membershipService, notificationService, $rootScope, $location, apiService) {
        $scope.pageClass = 'page-login';
        $scope.register = register;
        $scope.user = {};
        $scope.user.RoleIDs = [];
        $scope.stores = [];
        function loadStores() {
            apiService.get('/api/store/', null,
            storesLoadCompleted,
            storesLoadFailed);
        }

        function storesLoadCompleted(response) {
            $scope.stores = response.data;
        }

        function storesLoadFailed(response) {
            notificationService.displayError(response.data);
        }
        function loadRoles() {
            apiService.get('/api/account/getroles', null,
            rolesLoadCompleted,
            rolesLoadFailed);
        }

        function rolesLoadCompleted(response) {
            $scope.roles = response.data;
        }

        function rolesLoadFailed(response) {
            notificationService.displayError(response.data);
        }
        $scope.toggleSelection = function toggleSelection(roleId) {
            var idx = $scope.user.RoleIDs.indexOf(roleId);

            // is currently selected
            if (idx > -1) {
                $scope.user.RoleIDs.splice(idx, 1);
            }

                // is newly selected
            else {
                $scope.user.RoleIDs.push(roleId);
            }
        };




        
        function register() {
            $scope.user.StoreID = $scope.user.Store.ID;
            membershipService.register($scope.user, registerCompleted)
        }

        function registerCompleted(result) {
            if (result.data.success) {
                membershipService.saveCredentials($scope.user);
                notificationService.displaySuccess('Hello ' + $scope.user.username);
                $scope.userData.displayUserInfo();
                $location.path('/');
            }
            else {
                notificationService.displayError('Registration failed. Try again.');
            }
        }
        loadStores();
        loadRoles();
    }

})(angular.module('common.core'));