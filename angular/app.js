var app = angular.module('studioPayment', ['ngRoute', 'ngSanitize']);


app.config(function ($routeProvider) {    
  
      $routeProvider.when("/list", {
          controller: "listController",
          templateUrl: "angular/views/list.html"
      });
  
      $routeProvider.when("/print", {
          controller: "printController",
          templateUrl: "angular/views/print.html"
      });
  
      $routeProvider.otherwise({ redirectTo: "/" });
  });