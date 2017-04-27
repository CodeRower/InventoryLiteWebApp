(function (app) {
    'use strict';

    app.controller('storeCtrl', storeCtrl);

    storeCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    function storeCtrl($scope, $location, $routeParams, apiService, notificationService) {

        $scope.pageClass = 'page-movies';
        $scope.AddStore = AddStore;
       
       
        function AddStore() {
            AddStoreModel();
        }
        
        function AddStoreModel() {
            apiService.post('/api/store/add', $scope.store,
            addStoreSucceded,
            addStoreFailed);
        }


        function addStoreSucceded(response) {
            notificationService.displaySuccess($scope.store.StoreName + ' has been submitted to Inventory Lite');
            redirectToEdit();
        }

        function addStoreFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function redirectToEdit() {
            $location.url('/');
        }

        
    }

})(angular.module('InventoryLite'));
