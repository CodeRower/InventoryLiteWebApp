(function (app) {
    'use strict';

    app.controller('groupCtrl', groupCtrl);

    groupCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    function groupCtrl($scope, $location, $routeParams, apiService, notificationService) {

        $scope.pageClass = 'page-movies';
        $scope.AddGroup = AddGroup;
       
        function AddGroup() {
            AddGroupModel();
        }
        
        function AddGroupModel() {
            apiService.post('/api/group/add', $scope.group,
            addGroupSucceded,
            addGroupFailed);
        }


        function addGroupSucceded(response) {
            notificationService.displaySuccess($scope.group.GroupName + ' has been submitted to Inventory Lite');
            redirectToEdit();
        }

        function addGroupFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function redirectToEdit() {
            $location.url('/');
        }



        
    }

})(angular.module('InventoryLite'));
