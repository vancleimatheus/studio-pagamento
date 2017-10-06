'use strict';
app.controller('listController', ['$scope', '$location', '$window', 'stateService',
    function ($scope, $location, $window, stateService) {
      $scope.funcionarios = [];
      $scope.getData = function(url) {
        var key = stateService.getKey();
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

      $scope.getData();
}
]);


