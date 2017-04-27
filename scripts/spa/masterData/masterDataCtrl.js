(function (app) {
    'use strict';

    app.controller('masterDataCtrl', masterDataCtrl);

    masterDataCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    function masterDataCtrl($scope, $location, $routeParams, apiService, notificationService) {

        $scope.pageClass = 'page-movies';
        $scope.AddCity = AddCity;
        $scope.AddState = AddState;
        
        $scope.states = [];
                
        function loadStates() {
            apiService.get('/api/state/', null,
            statesLoadCompleted,
            statesLoadFailed);
        }

        function statesLoadCompleted(response) {
            $scope.states = response.data;
        }

        function statesLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function AddState() {
            AddStateModel();
        }
        function AddCity() {
            $scope.city.StateMasterID = $scope.city.State.ID;
            AddCityModel();
        }
        function AddCityModel() {
            apiService.post('/api/city/add', $scope.city,
            addCitySucceded,
            addCityFailed);
        }


        function addCitySucceded(response) {
            notificationService.displaySuccess($scope.city.CityName + ' has been submitted to Inventory Lite');
            redirectToEdit();
        }

        function addCityFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function AddStateModel() {
            apiService.post('/api/state/add', $scope.state,
            addStateSucceded,
            addStateFailed);
        }

        function addStateSucceded(response) {
            notificationService.displaySuccess($scope.state.StateName + ' has been submitted to Inventory Lite');
            redirectToEdit();
        }

        function addStateFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function redirectToEdit() {
            $location.url('/');
        }



        loadStates();
    }

})(angular.module('InventoryLite'));
