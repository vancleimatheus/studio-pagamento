'use strict';
app.controller('indexController', ['$scope', '$location', '$window', 'stateService', '$http',
    function ($scope, $location, $window, stateService, $http) {
        $scope.showState = {
            main: true,
            list: false,
            print: false            
        };

        $scope.dataState = {
            gym: null
        }

        $scope.gyms = [{name:"Iguaçu", key: '1YSS4rOv5Lw3ScUxRyjXq4xK2GsUZ-KC_vZfF3yw07z0'}, 
                  {name: "Metropolitan", key: ''}, 
                  {name: "Água Verde", key: ''}];
    
        $scope.openList = function(obj) {
            $scope.dataState.gym = obj
            $scope.showState = {
                main: false,
                list: true,
                print: false
            };
            $scope.getData();
        };

        $scope.printData = function() {
            $scope.showState = {
                main: false,
                list: false,
                print: true
            };            
        }

        $scope.funcionarios = [];
        $scope.getData = function(url) {
          var key = $scope.dataState.gym.key;
          url = 'https://spreadsheets.google.com/feeds/list/' + key + '/od6/public/values?alt=json';
          $http.get(url).then(function(response) {
            var entries = response.data.feed.entry;
  
            for(var i =0; i<entries.length; i++) {
              $scope.funcionarios.push({
                selected: false,
                nome: entries[i].gsx$funcionario.$t,
                modalidade: entries[i].gsx$modalidade.$t,
                valor: tryParseFloat(entries[i].gsx$valor.$t),
                numeroaulas: entries[i].gsx$numerodeaulas.$t,
                dsr: tryParseFloat(entries[i].gsx$dsr.$t),
                inss: tryParseFloat(entries[i].gsx$inss.$t),
                salariofamilia: tryParseFloat(entries[i].gsx$salariofamilia.$t),
                vale: tryParseFloat(entries[i].gsx$vale.$t),
                extra: tryParseFloat(entries[i].gsx$extra.$t),
                transporte: tryParseFloat(entries[i].gsx$transporte.$t),
                total: 0
              });
  
              $scope.funcionarios[i].total = calcularTotal($scope.funcionarios[i]);
            }
          });
        };
  
        function calcularTotal(funcionario) {
          var total = funcionario.valor;
  
          if(funcionario.numeroaulas!="" && !isNaN(funcionario.numeroaulas))
            total *= parseInt(funcionario.numeroaulas);
          
          total = total + funcionario.dsr + funcionario.inss + funcionario.salariofamilia + funcionario.extra + funcionario.transporte - funcionario.vale;
  
          return total;
        }
  
        function tryParseFloat(value) {
          value = value.replace(',', '.');
  
          if(value!="" && !isNaN(value))
            return parseFloat(value);
          else
            return 0;
        }

        $scope.toggleCheck = function() {
            for(var i=0; i < $scope.funcionarios.length; i++)
                $scope.funcionarios[i].selected = !$scope.funcionarios[i].selected;
        }
    }
]);