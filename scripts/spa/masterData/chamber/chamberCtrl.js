(function (app) {
    'use strict';

    app.controller('chamberCtrl', chamberCtrl);

    chamberCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    function chamberCtrl($scope, $location, $routeParams, apiService, notificationService) {
        $scope.chamber = {};
        $scope.pageClass = 'page-movies';
        $scope.AddChamber = AddChamber;
       
        function AddChamber() {
            AddChamberModel();
        }
        
        function AddChamberModel() {
            apiService.post('/api/chamber/add', $scope.chamber,
            addChamberSucceded,
            addChamberFailed);
        }


        function addChamberSucceded(response) {
            notificationService.displaySuccess($scope.chamber.ChamberName + ' has been submitted to Inventory Lite');
            redirectToEdit();
        }

        function addChamberFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function redirectToEdit() {
            $location.url('/');
        }

    }

})(angular.module('InventoryLite'));
