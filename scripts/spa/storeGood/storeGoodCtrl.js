(function (app) {
    'use strict';

    app.controller('storeGoodCtrl', storeGoodCtrl);

    storeGoodCtrl.$inject = ['$scope', '$location', '$routeParams', 'apiService', 'notificationService'];

    function storeGoodCtrl($scope, $location, $routeParams, apiService, notificationService) {

        $scope.pageClass = 'page-movies';
        $scope.AddGood = addGood;
        $scope.LoadLots = loadLots;
        $scope.CalculateTotalCrate = calculateTotalCrate;
        $scope.CalcualteTotalMeasurement = calcualteTotalMeasurement;
        $scope.LoadGoodDetails = loadGoodDetails;
        $scope.good = {};
        $scope.good.CreatedDate = new Date();

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

        $scope.AddGoodDetails = addGoodDetails;
        $scope.RemoveGoodDetail = removeGoodDetail;
        $scope.goodDetails = [];

        function addGoodDetails() {
            $scope.goodDetails.push({
                Chamber: '',
                Measurement: '',
                NumberOfCrate: "",
                Crate: '',
                ID: 0,
            })
        }

        function removeGoodDetail(idx) {
            $scope.goodDetails.splice(idx, 1);
        }
        addGoodDetails();

        $scope.measurements = [];
        $scope.crates = [];
        $scope.lots = [];
        $scope.stores = [];
        $scope.chambers = [];

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

        function loadLots() {

            var filterData = {
                FromDate: $scope.good.CreatedDate,
            };

            apiService.post('/api/purchase/', filterData,
            lotsLoadCompleted,
            lotsLoadFailed);
        }

        function lotsLoadCompleted(result) {
            $scope.lots = result.data;
            $scope.good.Lot = '';
        }

        function lotsLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function addGood() {
            $scope.good.LotID = $scope.good.Lot.ID;
            $scope.good.GoodDetails = [];
            for (var detailIdx = 0; detailIdx < $scope.goodDetails.length; detailIdx++) {
                var selDet = $scope.goodDetails[detailIdx];
                var det = {
                    NumberOfCrate: selDet.NumberOfCrate,
                    CrateMasterID: selDet.Crate.ID,
                    MeasurementID: selDet.Measurement.ID,
                    ChamberID: selDet.Chamber.ID,
                    ID: selDet.ID
                }

                $scope.good.GoodDetails.push(det);
            }

            addGoodModel();
        }

        function addGoodModel() {
            apiService.post('/api/storeGood/add', $scope.good,
            addGoodSucceded,
            addGoodFailed);
        }


        function addGoodSucceded(response) {
            notificationService.displaySuccess('Store Good(s) has been submitted to Inventory Lite');
            resetToDefaultState();
            redirectToEdit();
        }

        function addGoodFailed(response) {
            console.log(response);
            notificationService.displayError(response.statusText);
        }

        function redirectToEdit() {
            $location.url('/');
        }

        function resetToDefaultState() {
            var createdDate = $scope.good.CreatedDate;
            $scope.good = {};
            $scope.good.CreatedDate = createdDate;
            $scope.goodDetails = [];
            addGoodDetails();
        }

        function calcualteTotalMeasurement() {
            var dozen = 0, weight = 0, selDet, measurement, crateNumber;
            for (var detailIdx = 0; detailIdx < $scope.goodDetails.length; detailIdx++) {
                crateNumber = $scope.goodDetails[detailIdx].NumberOfCrate > 0 ? $scope.goodDetails[detailIdx].NumberOfCrate : 0;
                selDet = $scope.goodDetails[detailIdx].Measurement.ID;
                measurement = $.grep($scope.measurements, function (obj) { return obj.$id == selDet; });

                if (measurement != null && measurement.length > 0) {
                    weight += (parseFloat(measurement[0].AverageWeight) * parseInt(crateNumber));
                    dozen += (parseFloat(measurement[0].MeasurementUnit) * parseInt(crateNumber));
                }

            }
            $scope.good.TotalWeight = weight;
            $scope.good.TotalDozen = dozen;
        }

        function calculateTotalCrate() {
            var totalCrate = 0, crateNumber;
            for (var detailIdx = 0; detailIdx < $scope.goodDetails.length; detailIdx++) {
                crateNumber = $scope.goodDetails[detailIdx].NumberOfCrate > 0 ? $scope.goodDetails[detailIdx].NumberOfCrate : 0;
                totalCrate += parseFloat(crateNumber);
            }
            $scope.good.TotalCrate = totalCrate;
        }

        function loadGoodDetails() {
            if ($scope.good.Lot && $scope.good.Lot.ID && $scope.good.CreatedDate) {
                var storeGoodModel = {
                    LotID: $scope.good.Lot.ID,
                    CreatedDate: $scope.good.CreatedDate
                };
                apiService.post('/api/storeGood/', storeGoodModel, loadDetailsSucedded, loadDetailsFailed);
            } else {
                resetToDefaultState();
            }
        }

        function loadDetailsSucedded(response) {
            for (var detailIdx = 0; detailIdx < response.data.length; detailIdx++) {
                $scope.goodDetails[detailIdx] = {
                    Chamber: { ID: response.data[detailIdx].ChamberID },
                    Measurement: { ID: response.data[detailIdx].MeasurementID },
                    NumberOfCrate: response.data[detailIdx].NumberOfCrate,
                    Crate: { ID: response.data[detailIdx].CrateMasterID },
                    ID: response.data[detailIdx].ID
                };
            }
            calculateTotalCrate();
            calcualteTotalMeasurement();
        }

        function loadDetailsFailed(response) {

        }

        loadChambers();
        loadMeasurements();
        loadCrates();
        loadStores();
        loadLots();
    }

})(angular.module('InventoryLite'));
