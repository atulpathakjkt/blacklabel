'use strict';

angular.module('mean.businesses')

	.controller('BusinessesController', ['$scope', 'Global', 'Businesses',
	  function($scope, Global, Businesses) {
	    $scope.global = Global;
	    $scope.package = {
	      name: 'businesses'
	    };
	  }
	])

 /*Controller to handle new business registration #7*/
  .controller('BusinessRegistrationCtrl', ['$scope', 'Global', 'Businesses',
    function($scope, Global, Businesses) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;      
      $scope.businessnameError = null;
      $scope.registerError = null;      
      $scope.emailError = null;
      $scope.successRegistrationMessage = null;


      $scope.businessregistration = function() {
        $scope.global.registerForm = false;
        $scope.businessnameError = null;
        $scope.websiteError = null;
        $scope.businessError = null;
        $scope.successRegistrationMessage = null;
             
        var business = new Businesses({   
          category: $scope.business.category,
          website: $scope.business.website,
          businessname: $scope.business.businessname,

         addresses: [{
            addressline1: $scope.business.addressline1,
            addressline2: $scope.business.addressline2,
            city: $scope.business.city,
            state: $scope.business.state,
            country: $scope.business.country
           }]          
          });

         business.$save(function(response) {
            $scope.successRegistrationMessage = 0;
            $scope.errorMessage = 0;
          if (response.status === 'successfull') {
            $scope.successRegistrationMessage=response.msg;
          } else if (response.status === 'failure') {
            $scope.errorMessage = response.msg;  
          }        
        });
        };
      }
  ]);
