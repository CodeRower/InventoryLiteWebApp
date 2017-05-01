(function (app) {
    'use strict';

    app.controller('posCtrl', posCtrl);

    posCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService', '$timeout'];

    var childWindowObject = null;


    function posCtrl($scope, $location, $routeParams, apiService, notificationService, $timeout) {

        $scope.$on('$locationChangeStart', function (event, next, current) {
            if ($scope.datepicker.opened)
                event.preventDefault();
            $timeout(function () {
                $location.path(next.split('#')[1]); // path not hash
            });

        });

        $scope.pageClass = 'page-movies';
        //    $scope.AddPurchase = addPurchase;
        //  $scope.LoadCity = loadCity;
        //   $scope.LoadCrates = loadCrates;
        //    $scope.CalculateAmount = calculateAmount;
        //    $scope.LoadDataField = loadDataField;
        //    $scope.CalculatePaymentAmount = calculatePaymentAmount;
        //    $scope.CalculatePurchaseAmount = calculatePurchaseAmount;
        $scope.purchase = {};
        //     $scope.LoadLots = loadLots;
        $scope.purchase.PurchaseDate = new Date();
        //     $scope.LoadPurchase = loadPurchase;
        //     $scope.CalculateRate = calculateRate;
        //     $scope.CalculateFreightAmount = calculateFreightAmount;
        //     $scope.CalculateWeightDiff = calculateWeightDiff;
        //     $scope.CalculateWeightForPay = calculateWeightForPay;
        //     $scope.OpenSubGroup = openSubGroup;


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

        /*Load Customers*/
        $scope.customers = [];
        function loadCustomers() {
            apiService.get('/api/customers/all', null,
                function (response) {
                    $scope.customers = response.data;
                },
                function (response) {
                    notificationService.displayError(response.data);
                });
        }

        loadCustomers();


        /*Load Categories*/
        $scope.categories = [];
        function loadCategories() {
            apiService.get('/api/categories/all', null,
                function (response) {
                    $scope.categories = response.data;
                },
                function (response) {
                    notificationService.displayError(response.data);
                });
        }

        loadCategories();
        $scope.onCategorySelected = function (categoryId) {
            alert(categoryId);

            apiService.get('/api/products/bycategory/' + categoryId, null,
                function (response) {
                    $scope.productsForSelectedCategories = response.data;
                },
                function (response) {
                    notificationService.displayError(response.data);
                });

        };


        $scope.Stock = {
            ProductId: 0,
            Quantity: 0,
            CostPerUnit: 0,
            Type: "N",
            //SettledPricePerUnit = item.TotalPrice / item.Quantity,
            Discount: 0,
            Tax: 0,//item.,
            PricePerUnit: 0,
            CreatedById: 1,
            UpdatedById: 1,
            LocalCreatedOn: new Date(),
            LocalUpdatedOn: new Date(),
            CreatedOn: new Date(),
            UpdatedOn: new Date()
        };
        $scope.Sale = {
            Id: "",
            InvoiceNumber: "",
            TAX: 0,
            CustomerId: 0,
            Discount: 0,
            SaleDetails: [],
            CreatedById: 1,
            UpdatedById: 1,
            LocalCreatedOn: new Date(),
            LocalUpdatedOn: new Date(),
            TotalAmount: 0,
            TotalQuantity: 0,
            TotalPrice: 0
        };


        /*    $scope.states = [];
         $scope.cities = [];
         $scope.crates = [];
         $scope.partySubGroups = [];
         $scope.agentSubGroups = [];
         $scope.lots = [];*/

        /*  window.onfocus = function () {
         if (childWindowObject != null && !childWindowObject.closed) {
         childWindowObject.focus();
         }
         else {
         loadPartySubGroups();
         loadAgentSubGroups();
         }
         }*/

        /*   function loadLots() {
         if (loadDataField()) {
         var filterData = {
         FromDate: $scope.purchase.PurchaseDate,
         };

         apiService.post('/api/purchase/', filterData,
         lotsLoadCompleted,
         lotsLoadFailed);
         }
         }

         function lotsLoadCompleted(result) {
         $scope.lots = result.data;
         }

         function lotsLoadFailed(response) {
         notificationService.displayError(response.data);
         }

         function loadPurchase(id) {
         apiService.get('/api/purchase/details/' + id, null,
         purchaseLoadCompleted,
         purchaseLoadFailed);
         }

         function purchaseLoadCompleted(result) {
         $scope.purchase = result.data;
         $scope.purchase.State = $.grep($scope.states, function (e) { return e.ID == $scope.purchase.StateMasterID; })[0];
         loadCity();
         $scope.purchase.Lot = $.grep($scope.lots, function (e) { return e.ID == result.data.ID; })[0];
         $scope.purchase.AgentSubGroup = $.grep($scope.agentSubGroups, function (e) { return e.ID == result.data.AgentSubGroupID; })[0];
         $scope.purchase.PartySubGroup = $.grep($scope.partySubGroups, function (e) { return e.ID == result.data.PartySubGroupID; })[0];
         $scope.purchase.SubAgentSubGroup = $.grep($scope.subAgentSubGroups, function (e) { return e.ID == result.data.SubAgentSubGroupID; })[0];

         if (result.data.CrateMasterID != undefined && result.data.CrateMasterID > 0) {
         $scope.purchase.Crate = $.grep($scope.crates, function (e) { return e.ID == result.data.CrateMasterID; })[0];
         }

         $scope.purchase.City = $.grep($scope.cities, function (e) { return e.ID == result.data.CityID; })[0];
         }

         function purchaseLoadFailed(response) {
         notificationService.displayError(response.data);
         }

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

         function loadCity() {
         apiService.get('/api/city/' + $scope.purchase.State.ID, null,
         cityLoadCompleted,
         cityLoadFailed);
         }

         function cityLoadCompleted(response) {
         $scope.cities = response.data;

         if ($scope.purchase.ID > 0) {
         $scope.purchase.City = $.grep($scope.cities, function (e) { return e.ID == $scope.purchase.CityID; })[0];
         }
         }

         function cityLoadFailed(response) {
         notificationService.displayError(response.data);
         }

         function loadPartySubGroups(group) {
         apiService.get('/api/subGroup/' + 1, null,
         partySubGroupLoadCompleted,
         partySubGroupLoadFailed);
         }

         function partySubGroupLoadCompleted(response) {
         $scope.partySubGroups = response.data;
         }

         function partySubGroupLoadFailed(response) {
         notificationService.displayError(response.data);
         }

         function loadAgentSubGroups(group) {
         apiService.get('/api/subGroup/' + 3, null,
         agentSubGroupLoadCompleted,
         agentSubGroupLoadFailed);
         }

         function agentSubGroupLoadCompleted(response) {
         $scope.agentSubGroups = response.data;
         $scope.subAgentSubGroups = response.data;
         }

         function agentSubGroupLoadFailed(response) {
         notificationService.displayError(response.data);
         }

         function loadCrates() {
         apiService.get('/api/crate/', null,
         cratesLoadCompleted,
         crateLoadFailed);
         }

         function cratesLoadCompleted(response) {
         $scope.crates = response.data;
         }

         function crateLoadFailed(response) {
         notificationService.displayError(response.data);
         }

         function addPurchase() {
         $scope.purchase.StateMasterID = $scope.purchase.State.ID;
         $scope.purchase.CityID = $scope.purchase.City.ID;
         if ($scope.purchase.PartySubGroup != undefined) {
         $scope.purchase.PartySubGroupID = $scope.purchase.PartySubGroup.ID;
         $scope.purchase.PartySubGroupName = $scope.purchase.PartySubGroup.SubGroupName;
         }
         if ($scope.purchase.AgentSubGroup != undefined) {
         $scope.purchase.AgentSubGroupID = $scope.purchase.AgentSubGroup.ID;
         $scope.purchase.AgentSubGroupName = $scope.purchase.AgentSubGroup.SubGroupName;
         }
         if ($scope.purchase.SubAgentSubGroup != undefined) {
         $scope.purchase.SubAgentSubGroupID = $scope.purchase.SubAgentSubGroup.ID;
         }
         if ($scope.purchase.Crate != undefined) {
         $scope.purchase.CrateMasterID = $scope.purchase.Crate.ID;
         }
         if ($scope.purchase.Lot != undefined) {
         $scope.purchase.LotNo = $scope.purchase.Lot.LotNo;
         }
         else {
         $scope.purchase.LotNo = getCurrentDate() + "/" + $scope.purchase.TruckNo;
         }

         if ($scope.purchase.ID != undefined && $scope.purchase.ID > 0) {
         UpdatePurchaseModel();
         }
         else {
         addPurchaseModel();
         }
         }

         function UpdatePurchaseModel() {
         apiService.post('/api/purchase/update', $scope.purchase,
         updatePurchaseSucceded,
         updatePurchaseFailed);
         }

         function updatePurchaseSucceded(response) {
         console.log(response);
         notificationService.displaySuccess('Purchase have been updated');
         $scope.purchase = {};
         redirectToEdit();
         }

         function updatePurchaseFailed(response) {
         notificationService.displayError(response);
         }

         function getCurrentDate() {
         var currentdate = new Date();
         var datetime = currentdate.getDate() + "/"
         + (currentdate.getMonth() + 1) + "/"
         + currentdate.getFullYear() + "/"
         + currentdate.getHours() + "/"
         + currentdate.getMinutes();
         return datetime;
         }

         function addPurchaseModel() {
         apiService.post('/api/purchase/add', $scope.purchase,
         addPurchaseSucceded,
         addPurchaseFailed);
         }

         function addPurchaseSucceded(response) {
         notificationService.displaySuccess('Purchase Details has been submitted to Inventory Lite');
         redirectToEdit();
         }

         function addPurchaseFailed(response) {
         console.log(response);
         notificationService.displayError(response.statusText);
         }

         function calculateAmount() {
         calculateWeightDiff();
         calculateWeightForPay();
         $scope.purchase.Amount = ($scope.purchase.WeightForPay > 0 ? $scope.purchase.WeightForPay : $scope.purchase.NoOfCrate) * $scope.purchase.Rate;
         calculatePaymentAmount();
         }

         function calculateRate() {

         $scope.purchase.Rate = parseInt($scope.purchase.Amount / ($scope.purchase.ActualWeight > 0 ? $scope.purchase.ActualWeight : $scope.purchase.NoOfCrate), 10);
         calculatePaymentAmount();
         }

         function loadDataField() {
         return $location.path() === '/addPurchase' ? false : true
         }

         function calculatePaymentAmount() {
         $scope.purchase.PaymentAmount = 0;
         $scope.purchase.PaymentAmount += $scope.purchase.Amount > 0 ? $scope.purchase.Amount : 0;
         $scope.purchase.PaymentAmount += $scope.purchase.AgentCommission > 0 ? $scope.purchase.AgentCommission : 0
         $scope.purchase.PaymentAmount += $scope.purchase.AdvanceFreight > 0 ? $scope.purchase.AdvanceFreight : 0;

         calculatePurchaseAmount();
         }

         function calculateFreightAmount() {
         $scope.purchase.FreightAmount = 0;
         $scope.purchase.FreightAmount += $scope.purchase.INAM > 0 ? $scope.purchase.INAM : 0;
         $scope.purchase.FreightAmount += $scope.purchase.Miscellaneous > 0 ? $scope.purchase.Miscellaneous : 0;
         $scope.purchase.FreightAmount += $scope.purchase.MandiTax > 0 ? $scope.purchase.MandiTax : 0;
         $scope.purchase.FreightAmount += $scope.purchase.Foam > 0 ? $scope.purchase.Foam : 0;
         $scope.purchase.FreightAmount += $scope.purchase.Insurance > 0 ? $scope.purchase.Insurance : 0;
         $scope.purchase.FreightAmount += $scope.purchase.Labour > 0 ? $scope.purchase.Labour : 0;
         $scope.purchase.FreightAmount += $scope.purchase.Freight > 0 ? $scope.purchase.Freight : 0;
         $scope.purchase.FreightAmount -= $scope.purchase.LessFreight > 0 ? $scope.purchase.LessFreight : 0
         $scope.purchase.FreightAmount -= $scope.purchase.Daala > 0 ? $scope.purchase.Daala : 0
         $scope.purchase.FreightAmount -= $scope.purchase.AdvanceFreight > 0 ? $scope.purchase.AdvanceFreight : 0;
         $scope.purchase.FreightAmount += $scope.purchase.Kanta > 0 ? $scope.purchase.Kanta : 0;

         calculatePaymentAmount();
         }

         function calculatePurchaseAmount() {
         $scope.purchase.PurchaseCost = 0;
         $scope.purchase.PurchaseCost += $scope.purchase.PaymentAmount > 0 ? $scope.purchase.PaymentAmount : 0;
         $scope.purchase.PurchaseCost += $scope.purchase.AverageExpense > 0 ? $scope.purchase.AverageExpense : 0;
         $scope.purchase.PurchaseCost += $scope.purchase.SubAgentCommission > 0 ? $scope.purchase.SubAgentCommission : 0;
         $scope.purchase.PurchaseCost += $scope.purchase.FreightAmount > 0 ? $scope.purchase.FreightAmount : 0;
         }

         function calculateWeightDiff() {
         $scope.purchase.WeightDiff = 0;
         $scope.purchase.WeightDiff += $scope.purchase.ActualWeight > 0 ? $scope.purchase.ActualWeight : 0;
         $scope.purchase.WeightDiff -= $scope.purchase.NetWeight > 0 ? $scope.purchase.NetWeight : 0;
         }

         function calculateWeightForPay() {
         $scope.purchase.WeightForPay = 0;
         $scope.purchase.WeightForPay += $scope.purchase.ActualWeight > 0 ? $scope.purchase.ActualWeight : 0;
         $scope.purchase.WeightForPay += $scope.purchase.Dunthal > 0 ? $scope.purchase.Dunthal : 0;
         $scope.purchase.WeightForPay -= $scope.purchase.Patta > 0 ? $scope.purchase.Patta : 0;
         }

         function openSubGroup()
         {
         childWindowObject = window.open('#/master/addSubgroup', 'MsgWindow', "width=1200, height=700");
         }

         function redirectToEdit() {
         $location.url('/');
         }

         loadStates();
         loadPartySubGroups();
         loadAgentSubGroups();
         loadCrates();
         loadLots();*/
    }

})(angular.module('InventoryLite'));
