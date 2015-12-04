'use strict';

angular.module('mean.rfi')
.directive('additem', function($compile) {
  return {
    restrict: 'E',
    replace: false,
    template: '<div></div>',
    link: function (scope, element, attrs) {
      //add new rows on template
      scope.addRow = function() {
        //used for model name
        var flag = scope.count;

        //adds more rows to page with diffrent model name
        var contentTr = angular.element(
          '<div class="clearfix" id="item'+flag+'">' +
            '<input type="text" class="col-md-2" ng-model="item'+flag+'.number" placeholder="Item Number"/>' + 
            '<input type="text" class="col-md-6" ng-model="item'+flag+'.detail" placeholder="Item Details"/>' +
            '<input type="text" class="col-md-3" ng-model="item'+flag+'.quantity" placeholder="Quantity"/>' +
            '<span ng-click="remove('+flag+'); removeItem()" style="cursor: pointer;" class="glyphicon glyphicon-trash icon col-md-1" ></span>' +
          '</div>'
        );

        contentTr.insertBefore(element);
        $compile(contentTr)(scope);
      }
    }
  }
});