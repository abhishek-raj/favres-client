var app = angular.module('Client', ['ui.bootstrap']);
var serverToFetch = 'https://heroku-favres-server.herokuapp.com';
//var serverToFetch = 'http://127.0.0.1:5000';
app.controller('mainController', function($scope, $uibModal, $http) {
	$scope.newuser = {};
  $scope.signinuser = {};
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

  $scope.showSignupFormToggle = true;
  $scope.showSignupForm = function() {
    $scope.showSignupFormToggle = true;
    $scope.showSigninFormToggle = false;
    return $scope.showSignupFormToggle;
  }

  $scope.signupmessage = '';
  $scope.addUser = function() {
    console.log('New User.');
    $http.post(
        serverToFetch+'/addusers',
        JSON.stringify($scope.newuser),
        {headers: {'Content-Type': 'text/plain'}}
    ).then(function(response) {
      $scope.signupmessage = response.data.message;
      alert($scope.signupmessage);
   }); 
  }

  $scope.showSigninFormToggle = false;
  $scope.showSigninForm = function() {
    $scope.showSigninFormToggle = true;
    $scope.showSignupFormToggle = false;
    return $scope.showSigninFormToggle;
  }

  $scope.signinmessage = '';
  $scope.signedinuser = {};
  $scope.signinUser = function() {
    console.log($scope.signinuser);
    $http.post(
        serverToFetch+'/userauth',
        JSON.stringify($scope.signinuser),
        {headers: {'Content-Type': 'text/plain'}}
    ).then(function(response) {
      $scope.signinmessage = response.data.message;
      $scope.signedinuser = response.data.user;
      alert($scope.signinmessage+'\nHello '+$scope.signedinuser.name+'!');
   }); 
  }

  $scope.favmessage = '';
  $scope.addFav = function(restaurant) {
    if(!($scope.signedinuser.password && $scope.signedinuser.username))
    {
      alert("Please sign in.");
    }
    else
    {
      restaurant.username = $scope.signedinuser.username;
      restaurant.password = $scope.signedinuser.password;
      restaurant.place = $scope.addresses[0].formatted;
      restaurant.latlng = restaurant.lat+'..'+restaurant.lng;
      console.log(JSON.stringify(restaurant));
      $http.post(
        serverToFetch+'/favourites/post',
        JSON.stringify(restaurant),
        {headers: {'Content-Type': 'text/plain'}}
    ).then(function(response) {
      $scope.favmessage = response.data.message;
      alert($scope.favmessage);
   });
    }
  }

  $scope.favourites = [];
  $scope.getFav = function() {
    if(!($scope.signedinuser.password && $scope.signedinuser.username))
    {
      alert("Please sign in.");
    }
    else
    {
      var temp = {};
      temp.username = $scope.signedinuser.username;
      temp.password = $scope.signedinuser.password;
      console.log(JSON.stringify(temp));
      $http.post(
        serverToFetch+'/favourites',
        JSON.stringify(temp),
        {headers: {'Content-Type': 'text/plain'}}
    ).then(function(response) {
      $scope.favourites = response.data.favs;
   });
    }
  }

  $scope.removeFav = function(restaurant) {
    if(!($scope.signedinuser.password && $scope.signedinuser.username))
    {
      alert("Please sign in.");
    }
    else
    {
      restaurant.username = $scope.signedinuser.username;
      restaurant.password = $scope.signedinuser.password;
      console.log(JSON.stringify(restaurant));
      $http.post(
        serverToFetch+'/favourites/post/delete',
        JSON.stringify(restaurant),
        {headers: {'Content-Type': 'text/plain'}}
    ).then(function(response) {
      $scope.favmessage = response.data.message;
      $scope.getFav();
      alert($scope.favmessage);
   });
    }
  }

  $scope.searchResultsShow = true;
  $scope.favouritesShow = false;
  $scope.showResultsPage = function() {
    $scope.searchResultsShow = true;
    $scope.favouritesShow = false;
  }
  $scope.showFavouritesPage = function() {
    $scope.searchResultsShow = false;
    $scope.favouritesShow = true;
  }

  $scope.openSigninSignup = function (size) {

    $scope.modalInstance = $uibModal.open({
      templateUrl:'myModalContent.html',
      scope : $scope,
      resolve: {}
    });
    $scope.modalInstance.result.then(function (scopeModal) {
      $scope = scopeModal;
    }, function () {
    });
  };

  $scope.ok = function () {
    $scope.modalInstance.close($scope);
  };
});