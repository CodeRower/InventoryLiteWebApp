(function (app) {
    'use strict';

    app.controller('measurementCtrl', measurementCtrl);

    measurementCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    function measurementCtrl($scope, $location, $routeParams, apiService, notificationService) {

        $scope.pageClass = 'page-movies';
        $scope.AddMeasurement = AddMeasurement;



        function AddMeasurement() {
            AddMeasurementModel();
        }
 






        function AddMeasurementModel() {
            apiService.post('/api/measurement/add', $scope.measurement,
            addMeasurementSucceded,
            addMeasurementFailed);
        }


        function addMeasurementSucceded(response) {
            notificationService.displaySuccess($scope.measurement.MeasurementName + ' has been submitted to Inventory Lite');
            redirectToEdit();
        }

        function addMeasurementFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function redirectToEdit() {
            $location.url('/');
        }



     
    }

})(angular.module('InventoryLite'));
