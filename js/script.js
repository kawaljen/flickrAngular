    // potato module include ngRoute for all routing
    var potato = angular.module('potato', ['ngRoute', 'ngSanitize']);

	//----------------------------------------------------------------------------------------------------------------------------------
	//														     ROUTES
	//----------------------------------------------------------------------------------------------------------------------------------
    potato.config(function($routeProvider) {
        $routeProvider

            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            .when('/detail/:param1/:param2', {
                templateUrl : 'pages/detail.html',
                controller  : 'detailController'
            })
            .otherwise({redirectTo: '/'});

    });

	//----------------------------------------------------------------------------------------------------------------------------------
	//														     CONTROLLERS
	//----------------------------------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------home---------------------------------------------------------------
    potato.controller('mainController', function($scope, $http) {
		var url = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json',
			paramters = {jsoncallback: 'JSON_CALLBACK'};			
		$scope.showLoadMore = true;
		$scope.limit= 0;
		
		// get posts
		 $http.jsonp(url , {params : paramters } ).
			success(function(data, status, headers, config) {
			  $scope.posts = data.items;   
			  $scope.limit= 5;
			}).
			error(function(data, status, headers, config) {
			  $scope.posts = status;
			});       
		 
		// loadMore function
		$scope.loadMore = function() {
		  $scope.limit = $scope.limit + 5;
		}
    });

	//---------------------------------------------------------------detail---------------------------------------------------------------
    potato.controller('detailController', function($scope, $http, $routeParams) {
		var url = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json',
			paramters = {jsoncallback: 'JSON_CALLBACK'};
			
			$http.jsonp(url , {params : paramters } ).
				success(function(data, status, headers, config) {
				  $scope.posts = data.items;
				}).
				error(function(data, status, headers, config) {
				  $scope.posts = status;
				}); 
			$scope.titlepost = $routeParams.param1; 
			$scope.datepost = $routeParams.param2; 
    });    
 
 
 	//----------------------------------------------------------------------------------------------------------------------------------
	//														     DIRECTIVES
	//----------------------------------------------------------------------------------------------------------------------------------   
    potato.directive('whenScrollEnds', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var visibleHeight = element.height();
                var threshold = 50;

                element.scroll(function() {
                    var scrollableHeight = element.prop('scrollHeight');
                    var hiddenContentHeight = scrollableHeight - visibleHeight;

                    if (hiddenContentHeight - element.scrollTop() <= threshold) {
                        // Scroll is almost at the bottom. Loading more rows
                        scope.$apply(attrs.whenScrollEnds);
                    }
                });
            }
        };
    });
    
 	//----------------------------------------------------------------------------------------------------------------------------------
	//														     FILTERS
	//----------------------------------------------------------------------------------------------------------------------------------      
    potato.filter('to_trusted', ['$sce', function($sce) {
      return function(text) {
        return $sce.trustAsHtml(text);
      };
    }]);
    
    
