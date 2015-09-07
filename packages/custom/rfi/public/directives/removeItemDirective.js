'use strict';

angular.module('mean.rfi')
.directive('removeitem', function($compile) {
  return {
    replace: true,
    template: '<div></div>',
    link: function (scope, element, attrs) {
      //remove rows on template
      scope.remove = function(rowNumber) {

        //element to be removed
        var el = document.getElementById('item'+rowNumber)
        el.remove();

        //clear variable so model get empty value for deleted row
        //console.log(scope["item"+rowNumber]);
        scope["item"+rowNumber] = {};
      };
    }
  }
});