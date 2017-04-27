(function (app) {
    'use strict';

    app.controller('paymentCtrl', paymentCtrl);

    paymentCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    var childWindowObject = null;

    function paymentCtrl($scope, $location, $routeParams, apiService, notificationService) {

        $scope.pageClass = 'page-movies';
        $scope.AddPayment = addPayment;
        $scope.LoadSubGroup = loadSubGroup;
        $scope.payment = {};
        $scope.payment.CreatedDate = new Date();
        $scope.OpenSubGroup = openSubGroup;

        $scope.LoadPaymentDetails = loadPaymentDetails;
        $scope.AddPaymentDetails = addPaymentDetails;
        $scope.RemovePaymentDetail = removePaymentDetail;

        $scope.paymentDetails = [];

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

        function addPaymentDetails() {
            $scope.paymentDetails.push({
                Transaction: '',
                Remark: '',
                Amount: "",
                ID: 0
            })
        }
        addPaymentDetails();

        function removePaymentDetail(idx) {
            $scope.paymentDetails.splice(idx, 1);
        }

        $scope.groups = [];
        $scope.transactions = [];
        $scope.subGroups = [];
        //$scope.stores = [];

        //function loadStores() {
        //    apiService.get('/api/store/', null,
        //    storesLoadCompleted,
        //    storesLoadFailed);
        //}
        //function storesLoadCompleted(response) {
        //    $scope.stores = response.data;
        //}
        //function storesLoadFailed(response) {
        //    notificationService.displayError(response.data);
        //}

        window.onfocus = function () {
            if (childWindowObject != null && !childWindowObject.closed) {
                childWindowObject.focus();
            }
            else {
                loadSubGroup($scope.payment.Group);
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

        function loadSubGroup(group) {
            if (group != undefined) {
                apiService.get('/api/subGroup/' + group.ID, null,
                subGroupLoadCompleted,
                subGroupLoadFailed);
            }
        }

        function subGroupLoadCompleted(response) {
            $scope.subGroups = response.data;
        }

        function subGroupLoadFailed(response) {
            notificationService.displayError(response.data);
        }


        function addPayment() {
            $scope.payment.GroupMasterID = $scope.payment.Group.ID;
            $scope.payment.SubGroupID = $scope.payment.SubGroup.ID;
            //$scope.payment.StoreID = $scope.payment.Store.ID;

            $scope.payment.PaymentDetails = [];

            for (var detailIdx = 0; detailIdx < $scope.paymentDetails.length; detailIdx++) {
                var selDet = $scope.paymentDetails[detailIdx];
                var det = {
                    Remark: selDet.Remark,
                    Amount: selDet.Amount,
                    ID: selDet.ID
                }

                if (selDet.Transaction != undefined) {
                    det.TransactionMasterID = selDet.Transaction.ID;
                }

                $scope.payment.PaymentDetails.push(det);
            }

            addPaymentModel();
        }

        function addPaymentModel() {
            apiService.post('/api/payment/add', $scope.payment,
            addPaymentSucceded,
            addPaymentFailed);
        }

        function redirectToEdit() {
            $location.url('/');
        }

        function addPaymentSucceded(response) {
            notificationService.displaySuccess($scope.payment.SubGroup.SubGroupName + ' has been submitted to Inventory Lite');
            $scope.payment = {};
            redirectToEdit();
        }

        function addPaymentFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function resetToDefaultState() {
            var createdDate = $scope.payment.CreatedDate;
            $scope.payment = {};
            $scope.payment.CreatedDate = createdDate;
            $scope.paymentDetails = [];
            addPaymentDetails();
        }

        function loadPaymentDetails() {

            var paymentModel = {};

            if ($scope.payment.Group && $scope.payment.SubGroup && $scope.payment.CreatedDate) {

                paymentModel = {
                    GroupMasterID: $scope.payment.Group.ID,
                    SubGroupID: $scope.payment.SubGroup.ID,
                    CreatedDate: $scope.payment.CreatedDate
                };
                apiService.post('/api/payment/Get', paymentModel, loadDetailsSucedded, loadDetailsFailed);
            } else {
                resetToDefaultState();
            }
        };

        function loadDetailsSucedded(response) {

            if (response.data.length > 0) {
                for (var detailIdx = 0; detailIdx < response.data.length; detailIdx++) {
                    $scope.paymentDetails[detailIdx] = {
                        Transaction: { ID: response.data[detailIdx].TransactionMasterID },
                        Amount: response.data[detailIdx].Amount,
                        Remark: response.data[detailIdx].Remark,
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
        //loadStores();
    }

})(angular.module('InventoryLite'));
