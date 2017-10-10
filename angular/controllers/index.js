'use strict';
app.controller('indexController', ['$scope', '$location', '$window', '$http', '$filter',
    function ($scope, $location, $window, $http, $filter) {
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

        $scope.formatBR = function(number) {
            var fNum = 'R$ ' +  $filter('number')(number, 2);

            return(fNum.replace(',', '').replace('.', ','));
        }

        $scope.funcionarios = [];
        $scope.getData = function(url) {
          var key = $scope.dataState.gym.key;
          url = 'https://spreadsheets.google.com/feeds/list/' + key + '/od6/public/values?alt=json';
          $http.get(url).then(function(response) {
            var entries = response.data.feed.entry;
  
            for(var i =0; i<entries.length; i++) {
                var currentObj = $scope.funcionarios.find((a) => a.nome == entries[i].gsx$funcionario.$t);
                var func = {selected: false,
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
                };

                if(currentObj === undefined) {
                    $scope.funcionarios.push(func);

                    currentObj = func;
                }
                currentObj.total += calcularTotal(func);
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

        $scope.selectedFunc = [];

        $scope.toggleCheck = function() {
            $scope.selectedFunc = [];

            for(var i=0; i < $scope.funcionarios.length; i++)
            {
                $scope.funcionarios[i].selected = !$scope.funcionarios[i].selected;

                if($scope.funcionarios[i].selected)
                    $scope.selectedFunc.push($scope.funcionarios[i]);
            }
        }

        $scope.printData = function()
        {
            var mywindow = window.open('', 'PRINT', 'height=400,width=600');
        
            mywindow.document.write('<html><head><title>' + document.title  + '</title>');
            mywindow.document.write('    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">');
            mywindow.document.write('</head><body><div class="container">');
            
            for(var i=0; i<$scope.funcionarios.length; i++) {
                
                var func = $scope.funcionarios[i];

                if(func.selected) {
                    mywindow.document.write('<table style="width:50%"><tr><td>Nome:</td><td>');
                    mywindow.document.write(func.nome)
                    mywindow.document.write('</td></tr><tr><td>Valor:</td><td>');
                    mywindow.document.write($scope.formatBR(func.valor));
                    mywindow.document.write('</td></tr><tr><td>Nr. Aulas:</td><td>');
                    mywindow.document.write(func.numeroaulas);
                    mywindow.document.write('</td></tr><tr><td>DSR:</td><td>');
                    mywindow.document.write(func.dsr);
                    mywindow.document.write('</td></tr><tr><td>INSS:</td><td>');
                    mywindow.document.write(func.inss);
                    mywindow.document.write('</td></tr><tr><td>Vale:</td><td>');
                    mywindow.document.write(func.vale);
                    mywindow.document.write('</td></tr><tr><td>Extra:</td><td>');
                    mywindow.document.write(func.extra);
                    mywindow.document.write('</td></tr><tr><td>V. Trans:</td><td>');
                    mywindow.document.write(func.transporte);
                    mywindow.document.write('</td></tr><tr style="font-weight: bold"><td>Total:</td><td>');
                    mywindow.document.write($scope.formatBR(func.total));
                    mywindow.document.write('</td></tr><tr><td>&nbsp;</td></tr></table>');
                }
            }

            mywindow.document.write('</div></body></html>');
        
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
        
            //mywindow.print();
            //mywindow.close();
        
            return true;
        }
    }
]);