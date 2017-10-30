'use strict';
app.controller('indexController', ['$scope', '$location', '$window', '$http', '$filter',
    function ($scope, $location, $window, $http, $filter) {
        
        $scope.showState = {};

        $scope.dataState = {
            gym: null
        }
        
        $scope.gyms = [{name:"Iguaçu", key: '1YSS4rOv5Lw3ScUxRyjXq4xK2GsUZ-KC_vZfF3yw07z0', razao_social: 'Mv Academia de Ginástica Ltda.'}, 
        {name: "Metropolitan", key: '1RGsWfmvQ60dEHBS1KUSD8MwlWP-WiSc20FFNhX9SgdM', razao_social: 'Metropolitan Ltda.'}, 
        {name: "Água Verde", key: '1SNBxj5gwAJda1ZnWz9bObh3JP0Nu1B7sjobhEea0Wes', razao_social: 'Água Verde Ltda.'}];

        $scope.goHome = function() {
            $scope.funcionarios = [];

            $scope.showState = {
                main: true,
                list: false,
                print: false            
            };                
        }

        $scope.goHome();
    
        $scope.openList = function(obj) {
            $scope.dataState.gym = obj
            $scope.showState = {
                main: false,
                list: true,
                print: false
            };
            $scope.getData();
        };

        $scope.editData = function(){
            var key = $scope.dataState.gym.key;
            $window.open('https://docs.google.com/spreadsheets/d/' + key + '/edit', '_blank');
        };

        $scope.refreshData = function() {
            $scope.funcionarios = [];
            $scope.openList($scope.dataState.gym);
        }

        $scope.formatBR = function(number) {
            if(number !== null && number!==0 && !isNaN(number)) {
                var fNum = 'R$ ' +  $filter('number')(number, 2);

                return(fNum.replace(',', '').replace('.', ','));
            } else {
                return '';
            }
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
                    valorFMT: '',
                    subtotal: 0,
                    numeroaulas: entries[i].gsx$numerodeaulas.$t,
                    dsr: tryParseFloat(entries[i].gsx$dsr.$t),
                    inss: tryParseFloat(entries[i].gsx$inss.$t),
                    salariofamilia: tryParseFloat(entries[i].gsx$salariofamilia.$t),
                    vale: tryParseFloat(entries[i].gsx$vale.$t),
                    extra: tryParseFloat(entries[i].gsx$extra.$t),
                    transporte: tryParseFloat(entries[i].gsx$transporte.$t),
                    total: 0
                };

                calcularTotal(func);

                if(currentObj === undefined) {
                    $scope.funcionarios.push(func);

                    currentObj = func;
                } else {
                    mergeObj(currentObj, func);
                }                                
            }
          });
        };
  
        function mergeObj(f1, f2) {
            f1.modalidade += " | " + f2.modalidade;
            f1.valorFMT += " | " + f2.valorFMT;
            f1.numeroaulas += " | " + f2.numeroaulas;
            f1.subtotal += f2.subtotal;
            f1.dsr += f2.dsr;
            f1.inss += f2.inss;
            f1.salariofamilia += f2.salariofamilia;
            f1.vale += f2.vale;
            f1.extra += f2.extra;
            f1.transporte += f2.transporte;
            f1.total += f2.total;
        }

        function calcularTotal(funcionario) {
          var total = funcionario.valor;
  
          if(funcionario.numeroaulas!="" && !isNaN(funcionario.numeroaulas))
            total *= parseInt(funcionario.numeroaulas);
          
          funcionario.valorFMT = $scope.formatBR(funcionario.valor);
          funcionario.subtotal = total;
          funcionario.total = total + funcionario.dsr + funcionario.inss + funcionario.salariofamilia + funcionario.extra + funcionario.transporte - funcionario.vale;
            
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

        $scope.printSingle = function(func) {
            var arr = [];
            arr.push(func);
            $scope.printFunction(arr);
        };

        $scope.printEmpty = function(func) {
            var func = {selected: false,
                nome: func.nome,
                modalidade: '',
                valor: null,
                numeroaulas: '',
                dsr: null,
                inss: null,
                salariofamilia: null,
                vale: null,
                extra: null,
                transporte: null,
                total: null
            };

            $scope.printSingle(func);
        };

        $scope.printData = function() {
            var arr = [];

            for(var i=0; i<$scope.funcionarios.length; i++) {
                if($scope.funcionarios[i].selected)
                    arr.push($scope.funcionarios[i]);
            }

            if(arr.length>0)
                $scope.printFunction(arr);
            else
                alert('Por favor selecione um funcionário para a impressão do recibo.');
        }

        $scope.printFunction = function(arr)
        {
            var mywindow = window.open('', 'PRINT', 'height=400,width=800');
            var d = new Date();
        
            mywindow.document.write('<html>');
            mywindow.document.write('<head>');
            mywindow.document.write('<title>Pagamentos Studio Corpo Livre</title>');
            mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">');
            mywindow.document.write('<style type="text/css">td {padding-bottom: 10px;} #valores td {border: 1px solid black;padding: 5px;}</style></head><body>');
            mywindow.document.write('<div class="container">');                
            
            for(var i=0; i<arr.length; i++) {
                
                var func = arr[i];

                mywindow.document.write('<table style="width:100%">');
                mywindow.document.write('<tr style="background-color: silver; border: 1px solid black; font-weight: bold; font-size: 20px">');
                mywindow.document.write('<td colspan="2" style="padding: 10px;" >Recibo de Comissão</td></tr>');
                mywindow.document.write('<tr><td>&nbsp;</td></tr><tr>');
                mywindow.document.write('<td>Nome da Empresa:</td><td><strong>');
                mywindow.document.write($scope.dataState.gym.razao_social);
                mywindow.document.write('</strong></td></tr><tr><td>Nome do Funcionário:</td><td>');
                mywindow.document.write(func.nome)
                mywindow.document.write('</td></tr><tr><td>Período: </td><td>_______________ à _______________ de ');
                mywindow.document.write(d.getFullYear());
                mywindow.document.write('</td></tr><tr><td>&nbsp;</td></tr><tr><td colspan="2" style="padding-left:20px">');
                mywindow.document.write('<table id="valores" style="width:100%"><tr><td>Valor:</td><td>');
                mywindow.document.write(func.valorFMT);
                if(func.numeroaulas!=='') {
                    mywindow.document.write('</td></tr><tr><td>Nr. Aulas:</td><td>');
                    mywindow.document.write(func.numeroaulas);
                }
                if(func.subtotal>0) {
                    mywindow.document.write('</td></tr><tr style="border-top: 2px black solid;font-weight:bold;font-size: 14px;"><td style="padding-top:5px;">Subtotal:</td><td style="padding-top:5px">');
                    mywindow.document.write($scope.formatBR(func.subtotal));
                }
                mywindow.document.write('</td></tr><tr><td>DSR:</td><td>');
                mywindow.document.write($scope.formatBR(func.dsr));
                mywindow.document.write('</td></tr><tr><td>INSS:</td><td>');
                mywindow.document.write($scope.formatBR(func.inss));
                mywindow.document.write('</td></tr><tr><td>Vale:</td><td>');
                mywindow.document.write($scope.formatBR(func.vale));
                mywindow.document.write('</td></tr><tr><td>Extra:</td><td>');
                mywindow.document.write($scope.formatBR(func.extra));
                mywindow.document.write('</td></tr><tr><td>V. Trans:</td><td>');
                mywindow.document.write($scope.formatBR(func.transporte));
                mywindow.document.write('</td></tr><tr style="font-weight: bold"><td>Total:</td><td>');
                mywindow.document.write($scope.formatBR(func.total));
                mywindow.document.write('</td></tr></tr></table></td></tr>');
                mywindow.document.write('<tr><td>&nbsp;</td></tr><tr><td>Referente: </td>');
                mywindow.document.write('<td>_____________________________________ </td></tr><tr>');
                mywindow.document.write('<td>Curitiba, ');
                mywindow.document.write(d.getDate());
                mywindow.document.write(' de ' + nomeMes(d));
                mywindow.document.write(' de ' + d.getFullYear());
                mywindow.document.write('</td><td>&nbsp;&nbsp;&nbsp;&nbsp; Ass: ____________________________________ </td>');
                mywindow.document.write('</tr></table>');

            }

            mywindow.document.write('</div></body></html>');

            mywindow.document.write('<script type="text/javascript">window.print();window.close();</script>')
        
            return true;
        }

        function nomeMes(d) {
            var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho","Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

            return meses[d.getMonth()];
        }
    }
]);