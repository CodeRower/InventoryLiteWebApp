(function (app) {
    'use strict';

    app.controller('crateCtrl', crateCtrl);

    crateCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    function crateCtrl($scope, $location, $routeParams, apiService, notificationService) {


        $scope.pageClass = 'page-movies';
        $scope.AddCrate = AddCrate;

        function AddCrate() {
            AddCrateModel();
        }

        function AddCrateModel() {
            apiService.post('/api/crate/add', $scope.crate,
            addCrateSucceded,
            addCrateFailed);
        }


        function addCrateSucceded(response) {
            notificationService.displaySuccess($scope.crate.CrateSize + ' has been submitted to Inventory Lite');
            redirectToEdit();
        }

        function addCrateFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function redirectToEdit() {
            $location.url('/');
        }

    }

})(angular.module('InventoryLite'));
