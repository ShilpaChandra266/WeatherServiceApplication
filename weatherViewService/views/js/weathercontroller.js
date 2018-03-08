var app = angular.module('WeatherServices',[])

app.controller('WeatherServicesController', function($scope, $https){
    $scope.data='';
    $scope.getWeather=function(){
    var loc=document.getElementById("autocomplete").value;
    $https.get('/weatherData',{
    params: { loc: loc }}).success(function(results){
    	$scope.data=results;
    })
}});