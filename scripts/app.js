/*
(function () {
    'use strict';
    
  
    
    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate'
    ])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + '/customer/customer.html' ,
                controller: 'customerController',
                controllerAs: '_ctrl'
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }
    ]);

})();
*/







(function () {
    'use strict';
	
 
  
    angular.module('InventoryLite', ['common.core', 'common.ui'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: _templateBase +"/spa/home/index.html",
                controller: "indexCtrl"
            })
            .when("/login", {
                templateUrl: _templateBase +"/spa/account/login.html",
                controller: "loginCtrl"
            })
            .when("/register", {
                templateUrl: _templateBase +"/spa/account/register.html",
                controller: "registerCtrl"
            })
         
            .when("/master/addState", {
                templateUrl: _templateBase +"/spa/masterData/add.html",
                controller: "masterDataCtrl"
               
            })
            .when("/master/addChamber", {
                templateUrl: _templateBase +"/spa/masterData/chamber/add.html",
                controller: "chamberCtrl"
               
            })
            .when("/master/addCrate", {
                templateUrl: _templateBase +"/spa/masterData/crate/add.html",
                controller: "crateCtrl"
               
            })
            .when("/master/addMeasurement", {
                templateUrl: _templateBase +"/spa/masterData/measurement/add.html",
                controller: "measurementCtrl"
               
            })
            .when("/master/addGroup", {
                templateUrl: _templateBase +"/spa/masterData/group/add.html",
                controller: "groupCtrl"

            })
            .when("/master/addSubgroup", {
                templateUrl: _templateBase +"/spa/subgroup/add.html",
                controller: "subgroupCtrl"

            })
            .when("/master/addStore", {
                templateUrl: _templateBase +"/spa/store/add.html",
                controller: "storeCtrl"

            })
             .when("/addPurchase", {
                 templateUrl: _templateBase +"/spa/purchase/add.html",
                 controller: "purchaseCtrl"

             })
            .when("/addPurchase/purchase", {
                templateUrl: _templateBase +"/spa/purchase/add.html",
                controller: "purchaseCtrl"

            })

              .when("/reports/purchase", {
                  templateUrl: _templateBase +"/spa/purchase/report.html",
                  controller: "purchaseReportCtrl"

              })

            .when("/addDirectSale", {
                templateUrl: _templateBase +"/spa/sale/addDirectSale.html",
                controller: "saleCtrl"

            })

            .when("/addSale", {
                templateUrl: _templateBase +"/spa/sale/add.html",
                controller: "saleCtrl"

            })

            .when("/addCrateEntry", {
                templateUrl: _templateBase +"/spa/crateEntry/add.html",
                controller: "crateEntryCtrl",
                resolve: { hasPermissions: hasPermissions }
                
            })

             .when("/reports/crate", {
                 templateUrl: _templateBase +"/spa/crateEntry/crateReport.html",
                 controller: "crateReportCtrl"

             })

             .when("/addPayment", {
                 templateUrl: _templateBase +"/spa/payment/add.html",
                 controller: "paymentCtrl"

             })

             .when("/reports/payment", {
                 templateUrl: _templateBase +"/spa/payment/paymentReport.html",
                 controller: "paymentReportCtrl"

             })

            .when("/addGoods", {
                templateUrl: _templateBase +"/spa/storeGood/add.html",
                controller: "storeGoodCtrl"

            })

            .when("/salePreview", {
                templateUrl: _templateBase +"/spa/sale/salePrint.html",
                controller: "salePrintCtrl"

            })

           .when("/reports/sale", {
               templateUrl: _templateBase +"/spa/sale/report.html",
               controller: "saleReportCtrl"

           })

           .when("/reports/statements", {
               templateUrl: _templateBase +"/spa/reports/statementReport.html",
               controller: "statementReportCtrl"
           })

           .when("/reports/balance", {
               templateUrl: _templateBase +"/spa/reports/balanceReport.html",
               controller: "balanceReportCtrl"
           })

           .when("/reports/stock", {
               templateUrl: _templateBase +"/spa/reports/stockReport.html",
               controller: "stockReportCtrl"

           })
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

    function run($rootScope, $location, $cookieStore, $http) {
        // handle page refreshes
        $rootScope.repository = $cookieStore.get('repository') || {};
        if ($rootScope.repository.loggedUser) {
            $http.defaults.headers.common['Authorization'] = $rootScope.repository.loggedUser.authdata;
        }

    
	   /*$(document).ready(function () {
            $(".fancybox").fancybox({
                openEffect: 'none',
                closeEffect: 'none'
            });

            $('.fancybox-media').fancybox({
                openEffect: 'none',
                closeEffect: 'none',
                helpers: {
                    media: {}
                }
            });

            $('[data-toggle=offcanvas]').click(function () {
                $('.row-offcanvas').toggleClass('active');
            });
        });
		*/
    }

    isAuthenticated.$inject = ['membershipService', '$rootScope', '$location'];

    function isAuthenticated(membershipService, $rootScope, $location) {
        if (!membershipService.isUserLoggedIn()) {
            $rootScope.previousState = $location.path();
            $location.path('/login');
        }
    }
    hasPermissions.$inject = ['membershipService', '$rootScope', '$location'];

    function hasPermissions(membershipService, $rootScope, $location) {
        return membershipService.hasRolePermission('Admin')
    }

})();
