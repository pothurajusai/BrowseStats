var app = angular.module('myApp', ['nvd3'])
          .controller('MainController', function($scope,$timeout){

  $scope.visits = [];
  $scope.titles = [];
  $scope.graphData = [];
  var graphNumItems = 0;
  var graphData = [];
  var list = [];

  var microsecondsInADay = 1000 * 60 * 60 * 24;
  var oneDay = (new Date).getTime() - microsecondsInADay;

  chrome.history.search({text: '', startTime: oneDay}, function(historicalData) {
      for(var i = 0; i < historicalData.length; i++){
          var domain = extractDomain(historicalData[i].url);
          var visits = historicalData[i].visitCount;
            if($scope.titles.indexOf(domain) == -1){
                $scope.visits.push(visits);
                $scope.titles.push(domain);
              }else{
                var currentDomain = $scope.titles.indexOf(domain);
                $scope.visits[currentDomain] = $scope.visits[currentDomain] + visits;
    	    }
  	}

      for (var j = 0; j< $scope.titles.length; j++) {
        list.push({'title': $scope.titles[j] , 'visitCount' : $scope.visits[j] });
      }

      list.sort(function(a, b) {
        return ((a.visitCount > b.visitCount) ? -1 : ((a.visitCount == b.visitCount) ? 0 : 1));
      })

    $scope.stats = list;
    list.length > 5 ? graphNumItems = 5 : graphNumItems = list.length;
    for (var i = 0; i < graphNumItems; i++) {
        graphData.push(list[i]);
    };
      generateChart();
 });


function generateChart(){
        $scope.Pieoptions = {
            chart: {
                type: 'pieChart',
                height: 600,
                x: function(d){return d.title;},
                y: function(d){return d.visitCount;},
                legend: {
                        margin: {
                        top: 5,
                        right: 35,
                        bottom: 50,
                        left: 0
                    }
            },
                  transitionDuration: 500
        }
    };
  $scope.PieData = graphData;
}

 function extractDomain(url) {
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    domain = domain.replace("www.", "");
    return domain;
}

	var updateTime = function(){
	$scope.date = new Date();
	$timeout(updateTime, 1000);
	 }
	updateTime();

});
