(function (app) {
    'use strict';

    app.controller('saleCtrl', saleCtrl);

    saleCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    var childWindowObject = null;

    function saleCtrl($scope, $location, $routeParams, apiService, notificationService) {

        $scope.pageClass = 'page-movies';
        $scope.AddSale = addSale;
        $scope.LoadSubGroup = loadSubGroup;
        $scope.LoadLots = loadLots;
        $scope.LoadSaleDetails = loadSaleDetails;
        $scope.CalculateAmount = calculateAmount;
        $scope.CalculateDirectSaleAmount = calculateDirectSaleAmount;
        $scope.AddSaleDetails = addSaleDetails;
        $scope.RemoveSaleDetail = removeSaleDetail;
        $scope.sale = {};
        $scope.sale.CreatedDate = new Date();
        $scope.sale.IsDirectSale = isDirectSale();
        $scope.PrintSale = printSale;
        $scope.OpenSubGroup = openSubGroup;

        $scope.saleDetails = [];
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

        window.onfocus = function () {
            if (childWindowObject != null && !childWindowObject.closed) {
                childWindowObject.focus();
            }
            else if ($scope.sale.Group != undefined) {
                loadSubGroup($scope.sale.Group);
            }
        }

        function addSaleDetails() {
            $scope.saleDetails.push({
                Lot: '',
                Chamber: '',
                Measurement: '',
                NumberOfCrate: "",
                Crate: '',
                Amount: "",
                ID: 0
            })
        }
        addSaleDetails();
        function removeSaleDetail(idx) {
            $scope.saleDetails.splice(idx, 1);
        }


        $scope.groups = [];
        $scope.measurements = [];
        $scope.crates = [];
        $scope.subGroups = [];
        $scope.chambers = [];



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

        function loadMeasurements() {
            apiService.get('/api/measurement/', null,
            measurementsLoadCompleted,
            measurementsLoadFailed);
        }
        function measurementsLoadCompleted(response) {
            $scope.measurements = response.data;
        }
        function measurementsLoadFailed(response) {
            notificationService.displayError(response.data);
        }


        function loadCrates() {
            apiService.get('/api/crate/', null,
            cratesLoadCompleted,
           cratesLoadFailed);
        }
        function cratesLoadCompleted(response) {
            $scope.crates = response.data;
        }
        function cratesLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function loadSubGroup(group) {
            apiService.get('/api/subGroup/' + group.ID, null,
            subGroupLoadCompleted,
            subGroupLoadFailed);
        }
        function subGroupLoadCompleted(response) {
            $scope.subGroups = response.data;

            if ($scope.sale.ID > 0) {
                $scope.sale.SubGroup = $.grep($scope.subGroups, function (e) { return e.ID == $scope.sale.SubGroupID; })[0];
            }
        }

        function subGroupLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function loadLots() {

            if (isDirectSale()) {
                var filterData = {
                    FromDate: $scope.sale.CreatedDate
                };

                apiService.post('/api/purchase/', filterData,
                lotsLoadCompleted,
                lotsLoadFailed);
            }
            else {
                apiService.get('/api/purchase/', null,
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


        function loadChambers() {
            apiService.get('/api/chamber/', null,
            chambersLoadCompleted,
            chambersLoadFailed);
        }
        function chambersLoadCompleted(response) {
            $scope.chambers = response.data;
        }
        function chambersLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function addSale() {
            $scope.sale.GroupMasterID = $scope.sale.Group.ID;
            $scope.sale.SubGroupID = $scope.sale.SubGroup.ID;

            if ($scope.sale.NumberOfEmptyCrateSize != undefined) {
                $scope.sale.NumberOfEmptyCrateSize = $scope.sale.NumberOfEmptyCrateSize.ID
            }

            $scope.sale.SaleDetails = [];

            if (isDirectSale()) {

                if ($scope.sale.Crate != undefined) {
                    $scope.sale.CrateMasterID = $scope.sale.Crate.ID;
                }

                var det = {
                    LotID: $scope.sale.Lot.ID,
                    NumberOfCrate: $scope.sale.NumberOfCrate,
                    Rate: $scope.sale.Rate,
                    Amount: $scope.sale.Amount,
                    ID: $scope.sale.ID,
                    IsDirectSale: true,
                    CratemasterID: $scope.sale.CrateMasterID
                }

                $scope.sale.SaleDetails.push(det);
            }
            else {
                for (var detailIdx = 0; detailIdx < $scope.saleDetails.length; detailIdx++) {
                    var selDet = $scope.saleDetails[detailIdx];
                    var det = {
                        LotID: selDet.Lot.ID,
                        NumberOfCrate: selDet.NumberOfCrate,
                        Rate: selDet.Rate,
                        Amount: selDet.Amount,
                        ID: selDet.ID
                    }
                    if (selDet.Crate != undefined) {
                        det.CrateMasterID = selDet.Crate.ID;
                    }
                    if (selDet.Measurement != undefined) {
                        det.MeasurementID = selDet.Measurement.ID;
                    }
                    if (selDet.Chamber != undefined) {
                        det.ChamberID = selDet.Chamber.ID;
                    }

                    $scope.sale.SaleDetails.push(det);
                }
            }
            addSaleModel();
        }

        function addSaleModel() {
            apiService.post('/api/sale/add', $scope.sale,
            addSaleSucceded,
            addSaleFailed);
        }

        function addSaleSucceded(response) {
            notificationService.displaySuccess('Sales(s) has been submitted to Inventory Lite');
            $scope.sale = response.data;
            $('.btn-print').removeAttr('disabled');
            printSale();
        }

        function redirectToEdit() {
            $location.url('/');
        }

        function addSaleFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function resetToDefaultState() {
            var createdDate = $scope.sale.CreatedDate;
            $scope.sale = {};
            $scope.sale.CreatedDate = createdDate;
            $scope.saleDetails = [];
            addSaleDetails();
        }

        function calculateAmount() {
            var totalAmount = 0, crateNumber, Rate;
            for (var detailIdx = 0; detailIdx < $scope.saleDetails.length; detailIdx++) {
                crateNumber = $scope.saleDetails[detailIdx].NumberOfCrate > 0 ? $scope.saleDetails[detailIdx].NumberOfCrate : 0;
                Rate = $scope.saleDetails[detailIdx].Rate > 0 ? $scope.saleDetails[detailIdx].Rate : 0;
                $scope.saleDetails[detailIdx].Amount = parseFloat(crateNumber) * parseFloat(Rate);
            }
        }

        function loadSaleDetails() {

            var saleModel = {};

            if ($scope.sale.Group && $scope.sale.SubGroup && $scope.sale.CreatedDate) {

                saleModel = {
                    LotID: isDirectSale() ? $scope.sale.Lot.ID : 0,
                    GroupMasterID: $scope.sale.Group.ID,
                    SubGroupID: $scope.sale.SubGroup.ID,
                    IsDirectSale: isDirectSale(),
                    CreatedDate: $scope.sale.CreatedDate
                };
                apiService.post('/api/sale/Get', saleModel, loadDetailsSucedded, loadDetailsFailed);
            } else {
                resetToDefaultState();
            }
        };

        function loadDetailsSucedded(response) {

            if (response.data.length > 0) {
                if (isDirectSale()) {
                    $scope.sale.ID = response.data[0].ID;
                    $scope.sale.Lot.ID = response.data[0].LotID;
                    $scope.sale.SubGroupID = response.data[0].SubGroupID;
                    $scope.sale.Group = $.grep($scope.groups, function (e) { return e.ID == response.data[0].GroupMasterID; })[0];
                    loadSubGroup($scope.sale.Group);

                    if (response.data[0].CrateMasterID != undefined && response.data[0].CrateMasterID > 0) {
                        $scope.sale.Crate = $.grep($scope.crates, function (e) { return e.ID == response.data[0].CrateMasterID; })[0];
                    }

                    $scope.sale.Lungar = response.data[0].Lungar;
                    $scope.sale.Weight = response.data[0].Weight;
                    $scope.sale.Rate = response.data[0].Rate;
                    $scope.sale.Amount = response.data[0].Amount;
                    $scope.sale.NumberOfCrate = response.data[0].NumberOfCrate;
                }
                else {
                    for (var detailIdx = 0; detailIdx < response.data.length; detailIdx++) {
                        $scope.saleDetails[detailIdx] = {
                            Lot: { ID: response.data[detailIdx].LotID },
                            Chamber: { ID: response.data[detailIdx].ChamberID },
                            Measurement: { ID: response.data[detailIdx].MeasurementID },
                            NumberOfCrate: response.data[detailIdx].NumberOfCrate,
                            Crate: { ID: response.data[detailIdx].CrateMasterID },
                            Amount: response.data[detailIdx].Amount,
                            Rate: response.data[detailIdx].Rate,
                            ID: response.data[detailIdx].ID
                        };

                    }
                }

                $scope.sale.PaymentID = response.data[0].PaymentID;
                $scope.sale.TruckNo = response.data[0].TruckNo;
                $scope.sale.Freight = response.data[0].Freight;
                $scope.sale.MiscellaneousExpense = response.data[0].MiscellaneousExpense;
                $scope.sale.Remark = response.data[0].Remark;
                $scope.sale.PaymentReceived = response.data[0].PaymentReceived;
                $scope.sale.BillID = response.data[0].BillID;
                $scope.sale.NumberOfEmptyCrate = response.data[0].NumberOfEmptyCrate;

                if (response.data[0].NumberOfEmptyCrateSize != undefined && response.data[0].NumberOfEmptyCrateSize > 0) {
                    $scope.sale.NumberOfEmptyCrateSize = $.grep($scope.crates, function (e) { return e.ID == response.data[0].NumberOfEmptyCrateSize; })[0];
                }
                $scope.sale.PaymentReceived = response.data[0].PaymentReceived;
            }
        }

        function calculateDirectSaleAmount() {

            $scope.sale.Amount = ($scope.sale.Weight > 0 ? $scope.sale.Weight : $scope.sale.NumberOfCrate) * $scope.sale.Rate;
        }

        function isDirectSale() {
            return $location.path() === '/addDirectSale' ? true : false
        }

        function loadDetailsFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function printSale() {
            if (!$('.btn-print').attr('disabled')) {
                var p = confirm("Do you want to print the Sale Details?");

                if (p == true) {
                    var rateRequired = confirm("Details Required with Rate?");
                    $location.url('/salePreview?billID=' + $scope.sale.BillID + '&rateRequired=' + rateRequired);
                } else {
                    redirectToEdit();
                }
            }
        }

        function openSubGroup() {
            childWindowObject = window.open('#/master/addSubgroup', 'MsgWindow', "width=1200, height=700");
        }

        loadGroups();
        loadMeasurements();
        loadCrates();
        loadChambers();
        loadLots();
    }

})(angular.module('InventoryLite'));