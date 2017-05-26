(function() {
    'use strict';
}())

angular
  .module('app', ['ngCookies',
                  'ngRoute',
                  'ngSanitize',
                  'ngStorage',
                  'ngLodash'
                ])
.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('')
}])

//add is main controller to add user to chat and MainCtrl is controllerto handle chat and whiteboard functionality.
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'main/main.html',
        controller: 'MainCtrl'
      })
      .when('/add', {
        templateUrl: 'add/add.html',
        controller: 'addCtrl'
      })
      .otherwise({
        redirectTo: '/add'
      })
  }])
