var app = angular.module('Client', []);
var serverToFetch = 'https://nameless-temple-6285.herokuapp.com';
app.controller('mainController', function($scope, $http) {
	
	$scope.addresses = {};
	$scope.refreshAddresses = function(address) {
		console.log(address);
    return $http.post(
      serverToFetch+'/getgeocode',
      address,
      {headers: {'Content-Type': 'text/plain'}}
    ).then(function(response) {
      $scope.addresses = response.data.results
    });
  };

  	$scope.restaurants = {};
  	$scope.fetchRestaurants = function() {
  		console.log('Called');
  		latlan = $scope.addresses[0].lat+','+$scope.addresses[0].lng;
  		return $http.post(
      		serverToFetch+'/restaurants',
      		latlan,
      		{headers: {'Content-Type': 'text/plain'}}
    	).then(function(response) {
      	$scope.restaurants = response.data.results
    });
  	}
});