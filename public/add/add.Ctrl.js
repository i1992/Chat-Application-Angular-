(function() {
  'use strict';

  angular
    .module('app')
    .controller('addCtrl', addCtrl);

  addCtrl.$inject = ['$location', '$scope', '$localStorage', 'socket'];

  function addCtrl($location, $scope, $localStorage, socket) {
    $scope.name = '';
    let user_name;

    $scope.join = function() {
      user_name = $scope.name;
      $localStorage.login_name = user_name;

      socket.emit('join', {
        user_name: user_name
      });

      $location.path('/main');
    };

  }
})();
