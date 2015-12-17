var app = angular.module('Client', []);
var serverToFetch = 'https://heroku-favres-server.herokuapp.com';
//var serverToFetch = 'http://127.0.0.1:5000';
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

  $scope.showSignupFormToggle = false;
  $scope.showSignupForm = function() {
    if($scope.showSignupFormToggle)
    {
      $scope.showSignupFormToggle = false;
    }
    else
    {
      $scope.showSignupFormToggle = true;
    }
    $scope.showSigninFormToggle = false;
    return $scope.showSignupFormToggle;
  }

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
    if($scope.showSigninFormToggle)
    {
      $scope.showSigninFormToggle = false;
    }
    else
    {
      $scope.showSigninFormToggle = true;
    }
    $scope.showSignupFormToggle = false;
    return $scope.showSigninFormToggle;
  }

  $scope.signinUser = function() {
    console.log('Sign in.');
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

  $scope.addFav = function(restaurant) {
    if(!($scope.signedinuser))
    {
      alert("Please sign in.");
    }
    else
    {
      restaurant.username = $scope.signedinuser.username;
      restaurant.password = $scope.signedinuser.password;
      restaurant.place = $scope.addresses[0].formatted;
      restaurant.latlng = restaurant.lat+','+restaurant.lan;
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
  $scope.getFav = function() {
    if(!($scope.signedinuser))
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
});