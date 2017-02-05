

angular.module('starter.controllers', [])

.directive('resize',['$window',function($window){
    return{
        link:link,
        restrict:'A',
    };
    function link(scope,element,attrs){
        scope.width = $window.innerWidth;
        scope.height = $window.innerHeight;
         scope.marginleft_dev;
        scope.margintop_dev;
         if(scope.css.width >= scope.css.height){    
                     if(scope.css.height > 800){
                         scope.css.width = 800;
                         scope.css.height = 800;
                     }
                     else{
                          scope.css.width = $window.innerHeight;
                          scope.css.height = $window.innerHeight;
                     }
                }
                if(scope.css.height > scope.css.width){
                    if($window.innerWidth > 800){
                         scope.css.width = 800;
                         scope.css.height = 800;
                    }
                    else{
                         scope.css.width = $window.innerWidth;
                         scope.css.height = $window.innerWidth;                   
                    }                  
                } 
                scope.marginleft_dev = ($window.innerWidth-scope.css.width)/2;
        function onResize(){
            {
                 scope.css.width = $window.innerWidth;
                 scope.css.height = $window.innerHeight;
                if(scope.css.width >= scope.css.height){
                    
                    
                     if(scope.css.height > 800){
                         scope.css.width = 800;
                         scope.css.height = 800;
                     }
                     else{
                          scope.css.width = $window.innerHeight;
                          scope.css.height = $window.innerHeight;
                     }
                }
                if(scope.css.height > scope.css.width){
                    if($window.innerWidth > 800){
                         scope.css.width = 800;
                         scope.css.height = 800;
                    }
                    else{
                         scope.css.width = $window.innerWidth;
                         scope.css.height = $window.innerWidth;                   
                    }
                } 
                scope.marginleft_dev = ($window.innerWidth-scope.css.width)/2;             
                scope.$apply();
            }
        }
        function cleanUp(){
            angular.element($window).off('resize',onResize);
        }
        angular.element($window).on('resize',onResize);
          scope.$on('$destroy',cleanUp);
       
    }
}])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
// ************** splash screen part ************ //
.controller('splashctrl', function ($scope,$window, $timeout, $state, UserService) {
    $scope.css = {width: $window.innerWidth, height: $window.innerHeight};
    $scope.$watch('css.width', function(val) {
        $scope.css.cusCss = 'width: ' + val +'px;' + ' height:' + val + 'px';    
    }, true);
    
    $scope.$on('$ionicView.beforeEnter', function() {
         $timeout($scope.nextScreen, 5000)
    });
    
    $scope.init = function (){
        //  $timeout($scope.nextScreen, 5000)
    }
     
    $scope.nextScreen = function () {
        var isLogged = UserService.getUser();
        if (isLogged != null && UserService.getUser().isLogged) {
            $state.go('tab.mainboard')
        }else {
            $state.go('signinandsignupscreen');
        }
    }
})   
//***************************
// signinandsignup view part
// **************************
.controller('signinandsignup',function($scope,$state,$window,$document, $timeout, UserService)
{
    $scope.css = {width: $window.innerWidth, height: $window.innerHeight};
    $scope.$watch('css.width', function(val) {
        console.log('Sign up screen');
        $scope.css.cusCss = 'width: ' + val +'px;' + ' height:' + val + 'px';    
    }, true);
    
    
    $scope.loginscreen = function(){
        $state.go('login')
    }
     $scope.signupscreen = function(){
        $state.go('signupscreen')
    }
    $scope.goBack = function(){
         $state.go('splash');
    }
})
// ***************************************
// signup screen
// ***************************************
.controller('signupscreenctrl',function($scope,$state)
{
    $scope.signandsignupscreen = function(){
        $state.go('signinandsignupscreen')
    }
    $scope.goBack = function(){
        $state.go('signinandsignupscreen')
    }
})        
.controller('ChatDetailCtrl', function($scope,$state, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
  $scope.goback = function(){
      console.log('backbuttonclick!!!');
      $state.go('tab.chats');
  }
})
// ********** loginview part **********
.controller('LoginCtrl',function($scope,$state,$window,$document,
$rootScope, $ionicPopup, $location, $http, UserService, APIService)
{
    
    $scope.css = {width: $window.innerWidth, height: $window.innerHeight};
    $scope.$watch('css.width', function(val) {
        $scope.css.cusCss = 'width: ' + val +'px;' + ' height:' + val + 'px';    
    }, true);
    
    $scope.goBack = function(){
        $state.go('signinandsignupscreen')
    }
    $scope.loginselecteduserid = {
        userid:'',
    }
    $scope.user = {
        username: '',
        password: ''
    }
    
    $scope.nextPage = function(){
               
        console.log($scope.user.username);
        console.log($scope.user.password);
        
        var data = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
               
            'checkPassword':1,
            'email':$scope.user.username,
            'pwd':$scope.user.password,
            
            // 'checkPassword':1,
            // 'setPostStatus': 'deleted',
            // 'pwd': "test",
           }
        };
        
        $http(data)
        .then(function(response) {
            // console.log(response.data);
            // if(response.data.success == 16) {
               if(response.data.success > 0) {
                
                UserService.userId = response.data.userId;
              
                 $scope.loginselecteduserid= response.data.userId;
                UserService.saveData(response.data.userId);
                
               
                $rootScope.logineduserID = response.data.userId;
               
                console.log('Selected userId:'+response.data.userId);
                $scope.userInfo = {'isLogged': true};
                UserService.setUser($scope.userInfo);
                
                
                // UserService.setuserid($rootScope.logineduserID);
                
                
                $state.go('tab.mainboard');
                
            }
            else if(response.data.success == 'false') {
                alert('wrong credential');
            }
        }, function(error) {
            console.log(error);
        });
        // $state.go('tab.mainboard');
    }
    $scope.dialogshow = function()
    {
        // $state.go('signinandsignupscreen');
            $scope.data = {};
            var settingPopup = $ionicPopup.show({
                templateUrl:'templates/popup.html',
                cssClass:'popup popup-head',
                scope:$scope
            });
            
            // Go profile Page when user click the profile button        
            $scope.goFBProfile = function(){
                settingPopup.close();
                $location.path('/profile-edit');
            };
            
            // Go Friend Page when user click the friends button        
            $scope.goFriends = function(){
                settingPopup.close();
            //   $location.path('/login');
    
            };
            
            // Go familie Page when user click the familie button        
            $scope.goFamilie = function(){
                settingPopup.close();
                $location.path('/familie');
            };
            
            settingPopup.then(function(res) {
                // console.log('tapped!', res);
            });
            
            // // Close popupview        
            // IonicClosePopupService.register(settingPopup);

    }
    
})

// ****************** mainboard view part ********
.filter('orderobjectby',function(){
    return function(input,attribute){
        
        var array = [];
       // console.log('orderBy');
        for(var ObjectKey in input){
            array.push(input[ObjectKey]);
        }
        array.sort(function(a,b){
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return b-a;
        });
        return array;
    }
})
.controller('mainboardctrl',function($scope,$timeout,$state,$http, $rootScope, Mainboarddata)
{
    
    var mainpostdatacount;
        mainpostdatacount = 0;
    var maincommentdatacount;
        maincommentdatacount = 0;
    $scope.maincommentnum = {
        commentnumber:'',
    }
    $scope.maindata1 = {
        
    }
    $scope.maincommentnum = {
        counter:'',
    }
    $scope.$on('$ionicView.beforeEnter', function() {
         $scope.celldata = $rootScope.chat;
         console.log("mainboard start1");
//****************** get post data part ****************     
           var getpostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
              'getPost':1,
           }
        };
         $http(getpostdata)
         .then(function(response){
            console.log(response.data);
             $scope.postDatas = response.data;
             $scope.mainpostdata = response.data;
             
             
             console.log(response.data[68]['attachedFile']);
            counter1 = Object.keys(response.data).length;        
            for(var i=0; i<counter1 ;i++ ){
                if($scope.postDatas[i].time > 86400){
                    
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/86400);
                            var daytext = ' Days ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext; 
                }
                 if(3600 < $scope.postDatas[i].time && $scope.postDatas[i].time < 86400){
                     
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/3600);
                            var daytext = ' Hours ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                    day_flag = 0;hour_flag = 1; minute_flag = 0;
                    $scope.dayflag = 0;$scope.hourflag = 1;$scope.minuteflag = 0;
                }
                if(60 < $scope.postDatas[i].time && $scope.postDatas[i].time < 3600){
                        $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/60);
                            var daytext = ' Minutes ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                        day_flag = 0;hour_flag = 0;minute_flag =1; 
                        $scope.dayflag = 0; $scope.hourflag = 0;$scope.minuteflag = 1;
                }
                // if(0 < $scope.postDatas[i].time && $scope.postDatas[i].time < 60){
                //     $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/60);
                //             var daytext = ' Minutes ago';
                //             var timenum =  '';
                //             var timestr = timenum.toString();
                //     $scope.postDatas[i].times = timestr + daytext;
                    
                // }
                // $scope.maindatapostid[i].postid = $scope.postDatas[i].postid;
                // console.log($scope.maindatapostid[i].postid);
            }
            // console.log($scope.maindatapostid);
         }, function(error) {
             console.log(error);
         });   
      
//******************** get comment count part *********
    //        var getcommentdata = {
    //          method:'POST',
    //          url:'http://ambo2.serenit.com.au/database.php',
    //          headers:{
    //              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //          },
    //         transformRequest: function(obj) {
    //             var str = [];
    //             for(var p in obj)
    //             str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    //             return str.join("&");
    //         },
    //         data:{
    //             'getcommentdata':1,
    //         }
    //      };
    //      $http(getcommentdata)
    //      .then(function(response){
            
    //         $scope.maincommentdata = response.data;
    //         var commentdatacount = 0;
    //         mainpostdatacount = Object.keys($scope.mainpostdata).length;
    //         maincommentdatacount = Object.keys($scope.maincommentdata).length;
    //         console.log('commentdatastart!');
    //         console.log($scope.miancommentdata1);
    //         console.log('postdata number'+mainpostdatacount);
    //         console.log('commentdata number'+maincommentdatacount);
    //         for(var i = 0; i < mainpostdatacount;i++){//post for function
    //              for(var j = 0;j < commentdatacount ; j++){//comment for function
    //                  if($scope.mainpostdata[i].postid == $scope.maincommentdata1[j].postId){
               
                         
    //                      $scope.maincommentnum[i].commentnumber++;
    //                     console.log($scope.maincommentnum[i].commentnumber);
    //                  }
                      
                    
    //              }
    //         }
            
    //      }, function(error){
    //          console.log(error);
    //      });
     });
    
    $scope.getBeforeDay = function(input){
        var currentDay = new Date();
        var currentTime = currentDay.getTime();
        var currentHour = currentDay.getHours();
        
        var tempDayMili = currentTime-input;
        var tempDayName = new Date(tempDayMili);
        var temp = currentHour-tempDayName.getHours();
    }
    
    
    $scope.mainboarddata = Mainboarddata.all();
    $scope.remove = function(data) {
    Mainboarddata.remove(data);
    };
     $scope.goBack = function(){
        console.log('side manu showbuton clicked!');
        $state.go('splash');
    }
    
    $scope.goProfile = function(){
        console.log('mainboardgotoprofile button clicked!');
    }
    
    $scope.postbuttonclick = function(){
        console.log('post1buttonclicked!!!');
         $state.go('postview');
    }
    
    $scope.Processbuttonclick = function(){
        console.log('Processbuttonclicked!!!');
        $state.go('processview');
    }
    
    $scope.Leapbuttonclick = function(){
        console.log('Leapbuttonclicked!!!');
        $state.go('Leapview1');
    }
    
    $scope.Bottombuttonclick = function(){
        console.log('Bottombuttonclicked!!!');
         $state.go('Bottomview');
    }
    
    $scope.goto2 = function(params) {
        $rootScope.chat = params;
        console.log($rootScope.chat);
        //  $state.go('mainboardlistcellpostview');
    }
    $scope.goto1 = function(params){
         $rootScope.chat = params;
       // $scope.chat = params;
        console.log($rootScope.chat);
        
        
    }
    $scope.gotopostdetailview = function(params){
        $rootScope.chat = params;
        console.log($rootScope.chat.level);
        // $scope.chat = params;
        // $state.go('postdetailview');
    }
    $scope.buttonlikeclick = function(){
        console.log('likebuttonclick!!!');
    }
    $scope.buttonloveclick = function(){
        console.log('lovebuttonclick!!');
    }
    $scope.buttoneyeclick = function(){
        console.log('eyebuttonclick!!!');
    }
    $scope.buttonamasteclick = function(){
        console.log('namastebuttonclick!!!');
    }
    $scope.commentbuttonclick = function(params){
        $rootScope.chat = params;
        console.log($rootScope.chat);
        $state.go('postdetailview');
    }
    $scope.likebuttonclicked = function(params){
        $rootScope.chat = params;
        console.log($rootScope.chat);
    }
   
     $scope.responseview_on = function(params){
         $scope.response_view = params;
          
     }
     $scope.responseview_off = function(params){
         $scope.response_view = false;
     }
    $scope.mouseover1 = function(params){
        $scope.response_view = params;
        console.log(params);
      $timeout($scope.hidden_responseview, 10000);
        
    }
    $scope.mouseout1 = function(params){
        console.log('hidden'); 
    }
     $scope.hidden_responseview = function(){
        
         $scope.response_view = false;
     }

})
.controller('mainboardlistcellpostviewctrl',function($scope,$state, $rootScope)
{
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.celldata = $rootScope.chat;
    });
    
    console.log($rootScope.chat);
    $scope.goBack = function(){
    $state.go('tab.mainboard');
    
    }
    $scope.increasecommitnumber = function() {
        console.log($scope.celldata.commentstxt);
        var numComment = parseInt($scope.celldata.commentstxt) + 1;
        $scope.celldata.commentstxt = numComment;
    }
})

.controller('ChatsCtrl',function($scope,$state, Chats, UserService)
 {
    $scope.chats = Chats.all();
          console.log("lets go out!1!");
     
      $scope.goProfile = function(){
        console.log('chatgotoprofile button clicked!');
    }
    
     
    $scope.postbuttonclick = function(){
        console.log('chatpost1buttonclicked!!!');
        $state.go('postview');
    }
    
    $scope.Processbuttonclick = function(){
        console.log('chatProcessbuttonclicked!!!');
         $state.go('processview');
    }
    
    $scope.Leapbuttonclick = function(){
        console.log('chatLeapbuttonclicked!!!');
          $state.go('Leapview1');
    }
    
    $scope.Bottombuttonclick = function(){
        console.log('chatBottombuttonclicked!!!');
         $state.go('Bottomview');
        
    }
 })
 // profile view part=============
 .controller('AccountCtrl', function($scope,$state,$http,
  Chats, UserService,$rootScope, Mainboarddata) {
     $scope.$on('$ionicView.beforeEnter', function() {
        //************** get user information part *******************************************
         
          $scope.saveduserId = UserService.retrieveData();
           console.log('profile user ID'+ $scope.saveduserId);
          
         var datagetuserinfo = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
             'getUserInfo':1,
             'idToView': $scope.saveduserId,
           }
        };
        $http(datagetuserinfo)
        .then(function(response){
              console.log(response.data[0]);
             $scope.userinfo = response.data[0];
              console.log('userinfo email'+ $scope.userinfo);
        }, function(error) {
             console.log(error);
        });
    
         
         
         
        //$timeout($scope.nextScreen, 5000)
        
        //  icon_editinfo_click.style.backgroundImage='url(img/iconeditoff1.png)'; 
        //  iconpoint_id.style.backgroundImage = 'url(img/iconpointoff1.png)';
        //  iconevolution_id.style.backgroundImage = 'url(img/iconevolotionoff1.png)';
        // iconsort_id.style.backgroundImage = 'url(img/iconsortoff1.png)';
        
        
         console.log('hidden');
         $scope.neweditinfoview_show = false;
         $scope.editinfo_show = false;
         $scope.points_show = false;
         $scope.evolution_show = false;
         $scope.filter_show = false;
         
        $scope.profile_firstview_show = true;
        $scope.editinfo_show = false;
        $scope.points_show = false;
        $scope.evolution_show = false;
        $scope.filter_show = false;
        
       
    });
    
    
    
    
    $scope.settings = {
        enableFriends: true
    };
   $scope.mainboarddata = Mainboarddata.all();
    $scope.remove = function(data) {
    Mainboarddata.remove(data);
  };
  $scope.goProfile = function(){
        console.log('Notificationgotoprofile button clicked!');
    }
    
  
  $scope.postbuttonclick = function(){
        console.log('notificationpost1buttonclicked!!!');
        $state.go('postview');
    }
    
    $scope.Processbuttonclick = function(){
        console.log('notificationPr 0magerocessbuttonclicked!!!');
         $state.go('processview');
    }
    
    $scope.Leapbuttonclick = function(){
        console.log('notificationLeapbuttonclicked!!!');
         $state.go('Leapview1');
        
    }
    
    $scope.Bottombuttonclick = function(){
        console.log('notificationBottombuttonclicked!!!');
        $state.go('Bottomview');
    }
    //************** Editbar part **************** 
    var iconeditinfo_id =  document.getElementById("icon_editinfo_click");
    var iconpoint_id = document.getElementById("icon_point_click");
    var iconevolution_id = document.getElementById("icon_evolution_click");
    // var iconsort_id = document.getElementById("icon_sort_click");
    
       
        
        
    $scope.editbuttonclick = function(){
         console.log('profile_editinfobuttonclicked!!!');
        iconeditinfo_id.style.backgroundImage='url(img/iconeditoff1.png)'; 
        iconpoint_id.style.backgroundImage = 'url(img/iconpointoff1.png)';
        iconevolution_id.style.backgroundImage = 'url(img/iconevolotionoff1.png)';
      
        // $scope.neweditinfoview_show = true;
        // $scope.editinfo_show = false;
        // $scope.points_show = false;
        // $scope.evolution_show = false;
        // $scope.filter_show = false;
        // $scope.profile_firstview_show = false;
        $state.go('profile_aboutscreen');
   }
    $scope.pointbuttonclick = function(){
         console.log('profilepointbuttonclick!!!');
        // iconeditinfo_id.style.backgroundImage='url(img/iconeditoff1.png)'; 
        // iconpoint_id.style.backgroundImage = 'url(img/iconpointon1.png)';
        // iconevolution_id.style.backgroundImage = 'url(img/iconevolotionoff1.png)';
        // iconsort_id.style.backgroundImage = 'url(img/iconsortoff1.png)';
        
        // $scope.neweditinfoview_show = false;
        // $scope.editinfo_show = false;
        // $scope.points_show = true;
        // $scope.evolution_show = false;
        // $scope.filter_show = false;
        // $scope.profile_firstview_show = false;
        
       $state.go('profile_pointscreen');
        
    }
    
    $scope.evolutionbuttonclick = function(){
        // console.log('profileevolutionbuttonclick!!!');
        // iconevolution_id.style.backgroundImage =  'url(img/iconevolotionon1.png)';
        // iconpoint_id.style.backgroundImage = 'url(img/iconpointoff1.png)';
        // iconeditinfo_id.style.backgroundImage ='url(img/iconeditoff1.png)'; 
        // iconsort_id.style.backgroundImage = 'url(img/iconsortoff1.png)';
        
        
        //   $scope.neweditinfoview_show = false;
        //   $scope.editinfo_show = false;
        //   $scope.points_show = false; 
        //   $scope.evolution_show = true; 
        //   $scope.filter_show = false;
        //   $scope.profile_firstview_show = false;
         $state.go('profile_evolutionscreen');
    }
    
    $scope.filterbuttonclick = function(){
        // console.log('profilefilterbuttonclick!!!');
    //   iconsort_id.style.backgroundImage = 'url(img/iconsorton1.png)';
      iconpoint_id.style.backgroundImage = 'url(img/iconpointoff1.png)';
      iconeditinfo_id.style.backgroundImage='url(img/iconeditoff1.png)'; 
      iconevolution_id.style.backgroundImage = 'url(img/iconevolotionoff1.png)';
      
      
      
      
          $scope.neweditinfoview_show = false;
          $scope.editinfo_show = false;
          $scope.points_show = false; 
          $scope.evolution_show = false; 
          $scope.filter_show = true;
          $scope.profile_firstview_show = false;
      
    }
    $scope.allpostload = function(){
        console.log('all button click!!');
        var getpostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
              'getPost':1,
           }
        };
         $http(getpostdata)
         .then(function(response){
            console.log(response.data);
             $scope.postDatas = response.data;
             $scope.mainpostdata = response.data;
             
            counter1 = Object.keys(response.data).length;        
            for(var i=0; i<counter1 ;i++ ){
                if($scope.postDatas[i].time > 86400){
                    
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/86400);
                            var daytext = ' Days ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext; 
                }
                 if(3600 < $scope.postDatas[i].time && $scope.postDatas[i].time < 86400){
                     
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/3600);
                            var daytext = ' Hours ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                    day_flag = 0;hour_flag = 1; minute_flag = 0;
                    $scope.dayflag = 0;$scope.hourflag = 1;$scope.minuteflag = 0;
                }
                if(60 < $scope.postDatas[i].time && $scope.postDatas[i].time < 3600){
                        $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/60);
                            var daytext = ' Minutes ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                        day_flag = 0;hour_flag = 0;minute_flag =1; 
                        $scope.dayflag = 0; $scope.hourflag = 0;$scope.minuteflag = 1;
                }
            }
            console.log($scope.maindatapostid);
         }, function(error) {
             console.log(error);
         });   
    }
    $scope.normalpostload = function(){
        console.log('normalpostdata load');
        delete $scope.postDatas;
        var datalogout = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
             'getnormalpost':1,
           }
        };
        $http(datalogout)
        .then(function(response){
           console.log(response.data)
            $scope.postDatas = response.data;
             $scope.mainpostdata = response.data;
             
            counter1 = Object.keys(response.data).length;        
            for(var i=0; i<counter1 ;i++ ){
                if($scope.postDatas[i].time > 86400){
                    
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/86400);
                            var daytext = ' Days ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext; 
                }
                 if(3600 < $scope.postDatas[i].time && $scope.postDatas[i].time < 86400){
                     
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/3600);
                            var daytext = ' Hours ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                    day_flag = 0;hour_flag = 1; minute_flag = 0;
                    $scope.dayflag = 0;$scope.hourflag = 1;$scope.minuteflag = 0;
                }
                if(60 < $scope.postDatas[i].time && $scope.postDatas[i].time < 3600){
                        $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/60);
                            var daytext = ' Minutes ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                        day_flag = 0;hour_flag = 0;minute_flag =1; 
                        $scope.dayflag = 0; $scope.hourflag = 0;$scope.minuteflag = 1;
                }
            }
        }, function(error) {
            console.log(error);
        });
    }
    $scope.processpostload = function(){
        console.log('processpost load');
         console.log('normalpostdata load');
        delete $scope.postDatas;
        var getprocesspostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
             'getprocesspost':1,
           }
        };
        $http(getprocesspostdata)
        .then(function(response){
           console.log(response.data)
            $scope.postDatas = response.data;
             $scope.mainpostdata = response.data;
             
            counter1 = Object.keys(response.data).length;        
            for(var i=0; i<counter1 ;i++ ){
                if($scope.postDatas[i].time > 86400){
                    
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/86400);
                            var daytext = ' Days ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext; 
                }
                 if(3600 < $scope.postDatas[i].time && $scope.postDatas[i].time < 86400){
                     
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/3600);
                            var daytext = ' Hours ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                    day_flag = 0;hour_flag = 1; minute_flag = 0;
                    $scope.dayflag = 0;$scope.hourflag = 1;$scope.minuteflag = 0;
                }
                if(60 < $scope.postDatas[i].time && $scope.postDatas[i].time < 3600){
                        $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/60);
                            var daytext = ' Minutes ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                        day_flag = 0;hour_flag = 0;minute_flag =1; 
                        $scope.dayflag = 0; $scope.hourflag = 0;$scope.minuteflag = 1;
                }
            }
        }, function(error) {
            console.log(error);
        });
    }
    
    $scope.leappostload = function(){
         console.log('leappostdata load');
        delete $scope.postDatas;
        var getleappostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
             'getleappost':1,
           }
        };
        $http(getleappostdata)
        .then(function(response){
           console.log(response.data)
            $scope.postDatas = response.data;
             $scope.mainpostdata = response.data;
             
            counter1 = Object.keys(response.data).length;        
            for(var i=0; i<counter1 ;i++ ){
                if($scope.postDatas[i].time > 86400){
                    
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/86400);
                            var daytext = ' Days ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext; 
                }
                 if(3600 < $scope.postDatas[i].time && $scope.postDatas[i].time < 86400){
                     
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/3600);
                            var daytext = ' Hours ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                    day_flag = 0;hour_flag = 1; minute_flag = 0;
                    $scope.dayflag = 0;$scope.hourflag = 1;$scope.minuteflag = 0;
                }
                if(60 < $scope.postDatas[i].time && $scope.postDatas[i].time < 3600){
                        $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/60);
                            var daytext = ' Minutes ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                        day_flag = 0;hour_flag = 0;minute_flag =1; 
                        $scope.dayflag = 0; $scope.hourflag = 0;$scope.minuteflag = 1;
                }
            }
        }, function(error) {
            console.log(error);
        });
    }
    
    $scope.boompostload = function(){
        delete $scope.postDatas;
        var getboompostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
             'getboompost':1,
           }
        };
        $http(getboompostdata)
        .then(function(response){
           console.log(response.data)
            $scope.postDatas = response.data;
             $scope.mainpostdata = response.data;
             
            counter1 = Object.keys(response.data).length;        
            for(var i=0; i<counter1 ;i++ ){
                if($scope.postDatas[i].time > 86400){
                    
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/86400);
                            var daytext = ' Days ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext; 
                }
                 if(3600 < $scope.postDatas[i].time && $scope.postDatas[i].time < 86400){
                     
                    $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/3600);
                            var daytext = ' Hours ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                    day_flag = 0;hour_flag = 1; minute_flag = 0;
                    $scope.dayflag = 0;$scope.hourflag = 1;$scope.minuteflag = 0;
                }
                if(60 < $scope.postDatas[i].time && $scope.postDatas[i].time < 3600){
                        $scope.postDatas[i].time = Math.round($scope.postDatas[i].time/60);
                            var daytext = ' Minutes ago';
                            var timenum =  $scope.postDatas[i].time;
                            var timestr = timenum.toString();
                    $scope.postDatas[i].times = timestr + daytext;
                        day_flag = 0;hour_flag = 0;minute_flag =1; 
                        $scope.dayflag = 0; $scope.hourflag = 0;$scope.minuteflag = 1;
                }
            }
        }, function(error) {
            console.log(error);
        });
    }
    
     $scope.chats = Chats.all(); 
       
     $scope.gologout = function(){        
         var datalogout = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
             'logout':1,
           }
        };
        $http(datalogout)
        .then(function(response){
            $scope.userInfo = {};
            UserService.setUser($scope.userInfo);
            console.log(UserService.getUser());
           console.log(response.data)
           $state.go('splash');
           
            
        }, function(error) {
            console.log(error);
        });
    }
})

// ************** profile_abouttabctrl **********************
.controller('profile_aboutscreen_ctrl',function($scope,UserService,$state,$http,$ionicViewService)
{
    $scope.goBack = function(){
    console.log('back button!!!');
    $state.go('tab.account');
    }
})
// *********** profile_pointfunctionctrl *****************************


.controller('profile_pointscreen_ctrl',function($scope,$state,$http)
{
    
    var testvalue;
    testvalue = 0;
 
    var getnormalpostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
              'getnormalpost':1,
           }
        };
            $http(getnormalpostdata)
            .then(function(response){
                $scope.normalpostnum = Object.keys(response.data).length; 
                testvalue = Object.keys(response.data).length;
                console.log($scope.normalpostnum);
            },function(error){
                
            });
        
        var getprocesspostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
              'getprocesspost':1,
           }
        };
            $http(getprocesspostdata)
            .then(function(response){
                $scope.processpostdata = Object.keys(response.data).length;   
                console.log($scope.processpostdata);
            },function(error){
                
            });
            
             var getleappost = {
                                method:'POST',
                                url: 'http://ambo2.serenit.com.au/database.php',
                                headers:{
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                },
                                transformRequest: function(obj) {
                                        var str = [];
                                        for(var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                        return str.join("&");
                                    },
                                data: {
                                    'getleappost':1,
                                }
                          };
            $http(getleappost)
            .then(function(response){
                 $scope.leappostdata = Object.keys(response.data).length;   
                console.log($scope.leappostdata);
            },function(error){
                
            });
            
            
            var getboompost = {
                                method:'POST',
                                url: 'http://ambo2.serenit.com.au/database.php',
                                headers:{
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                },
                                transformRequest: function(obj) {
                                        var str = [];
                                        for(var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                        return str.join("&");
                                    },
                                data: {
                                    'getboompost':1,
                                }
                          };
            $http(getboompost)
            .then(function(response){
                 $scope.boompostdata = Object.keys(response.data).length;   
                console.log($scope.boompostdata);
            },function(error){
                
            });
        
        
    
    
    
    $scope.myDataSourcepie = {
    width: '20%',
    chart: {
        caption: "MadeUpof",
        subcaption: "Last Year",
        startingangle: "120",
        showlabels: "0",
        showlegend: "1",
        enablemultislicing: "0",
        slicingdistance: "15",
        showpercentvalues: "1",
        showpercentintooltip: "0",
        plottooltext: "Age group : $label Total visit : $datavalue",
        theme: "fint"
    },
    data: [
        {
            label: "Teenage",
            value: 'testvalue',
        },
        {
            label: "Adult",
            value: 34,
        },
        {
            label: "Mid-age",
            value: 24,
        },
        {
            label: "Senior",
            value: 35,
        }
    ]
  }
    
     $scope.myDataSource  = {
    chart: {
        caption: "Total Points",
        subCaption: "Average, Yours,Theirs",
         numberPrefix: "Visit",
        theme: "ocean"
    },
    data:[{
        label: "Yours",
        value: 8,
    },
    {
        label: "Average",
        value: 3,
    },
    {
        label: "Thires",
        value: 1,
    }]
   };
    
    $scope.goBack = function(){
        console.log('start point view');
         $state.go('tab.account');
         
    }
})
// ************** profile evolution ************
.controller('profile_evolutionscreen_ctrl',function($scope,$state)
{
    console.log($scope.attrs);
    $scope.attrs = {
    "caption": "Your journey",
    "numberprefix": "",
    "plotgradientcolor": "",
    "bgcolor": "ff1493",
    "showalternatehgridcolor": "0",
    "divlinecolor": "FF00FF",
    "showvalues": "0",
    "showcanvasborder": "0",
    "canvasborderalpha": "0",
    "canvasbordercolor": "FF00FF",
    "canvasborderthickness": "1",
    // "yaxismaxvalue": "30000",
    // "captionpadding": "30",
    // "linethickness": "5",
    // "yaxisvaluespadding": "15",
    // "legendshadow": "0",
    "legendborderalpha": "3",
    "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
    "showborder": "0"
};

$scope.categories = [
    {
        "category": [
            {"label": "Jan"},
            {"label": "Feb"},
            {"label": "Mar"},
            {"label": "Apr"},
            {"label": "May"},
            {"label": "Jun"},
            {"label": "Jul"},
            {"label": "Aug"},
            {"label": "Sep"},
            {"label": "Oct"},
            {"label": "Nov"},
            {"label": "Dec"}
        ]
    }
];

$scope.dataset = [
    {
        "seriesname": "Commitment",
        "data": [
            {"value": "10"},
            {"value": "2"},
            {"value": "14"},
            {"value": "20"},
            {"value": "13"},
            {"value": "5"},
            {"value": "8"},
            {"value": "1"},
            {"value": "5"},
            { "value": "0"},
            {"value": "6"},
            {"value": "12"}
        ]
    },
    {
        "seriesname": "CVS",
        "data": [
            {"value": "20"},
            {"value": "24"},
            {"value": "12"},
            {"value": "15"},
            {"value": "16"},
            {"value": "17"},
            {"value": "18"},
            {"value": "18"},
            {"value": "20"},
            {"value": "19"},
            {"value": "22"},
            {"value": "20"}
        ]
    },
    {
        "seriesname": "Potency measure",
        "data": [
            {"value": "30"},
            {"value": "14"},
            {"value": "1"},
            {"value": "5"},
            {"value": "8"},
            {"value": "7"},
            {"value": "3"},
            {"value": "1"},
            {"value": "20"},
            {"value": "1"},
            {"value": "5"},
            {"value": "8"}
        ]
    }
];

    
    
    
     $scope.myDataSource  = {
    chart: {
        caption: "Makeup of:",
        subCaption: "Potency",
        startingangle: "120",
        showlabels: "0",
        showlegend: "1",
        enablemultislicing: "0",
        slicingdistance: "15",
        showpercentvalues: "1",
        showpercentintooltip: "0",
        plottooltext: "Age group : $label Total visit : $datavalue",
        theme: "fint"
      
    },
    data:[{
        label: "Gratitudes",
        value: "10"
    },
    {
        label: "Favourites",
        value: "12"
    },
    {
        label: "CVS",
        value: "15"
    },
    {
        label: "Likes",
        value: "20"
    },
    {
        label: "Chat post",
        value: "40"
    },
    {
        label: "Wisdom pops",
        value: "12"
    },
    {
        label: "Leaps",
        value: "8"
    },
    {
        label: "Booms",
        value: "18"
    },
    {
        label: "Comments",
        value: "33"
    }]
   };
    
 
              
     $scope.goBack = function(){
        console.log('start point view');
         $state.go('tab.account');
     }
})
// **************postview part *************
.controller('postviewctrl',['$scope', 'Upload', 'UserService', '$timeout', '$rootScope', '$state', '$http', '$ionicViewService', 
function($scope,Upload,UserService,$timeout,$rootScope, $state,$http, $ionicViewService)
{
    
    
    var uploadedfile_url;
    var uploadedfile_name;
    
    
    $scope.user = {
        picFile:'',
    }
    
    
    $scope.uploadPic = function (file) {
            $scope.formUpload = true;
            if (file != null) {
                    $scope.upload(file);
                }
            
            
       
                
                
        };
        
    $scope.upload = function(file, resumable) {

            uploadFile(file);
            console.log(file);
    }
    
        function uploadFile(file) {
            file.upload = Upload.upload({
            url: 'http://ambo2.serenit.com.au/uploadfile.php',
            
            data: {file: file, username: 'test'}
            });
            
            file.upload.then(function (response) {
            file.result = response.data;
             console.log(response);
            
            var url1 = 'http://ambo2.serenit.com.au/';
            var url2;
            url2 = response.data;
            uploadedfile_url =url1 + response.data.destination;
            uploadedfile_name = response.data.filename;
            
            $scope.atachedfile_url = url1 + response.data.destination;
            $scope.attachedfile_name = response.data.filename;
            console.log($scope.atachedfile_url);      
            console.log(uploadedfile_url);
            
            
            
                     //------------ normal post part------------------
                 var setpostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
              'addnormalpost':1,
              'type':0,
              'title':'testuserid',
              'description':$scope.user.descriptiontxt, 
              'pop':'testpop',
              'emotion':2,
              'trig':1,
              'youtubeUrl':$scope.user.youtebeurltxt,
              'attachedFile':$scope.atachedfile_url,
              'attachedFilename':$scope.attachedfile_name,
              'userId':16,
              'visibility':0,
            //   'status':'teststatus',              
           }
        };
        
         $http(setpostdata)
            .then(function(response){
                 console.log(response.data);
                $state.go('tab.mainboard');
            },function(error){
                console.log(error);
            }
         ) 
            
            
        
            }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            });
        }
        
    $scope.user = {
        youtebeurltxt:'',
        descriptiontxt:'',
    }
    
    $scope.goBack = function(){
        console.log('back button!!!');
        $state.go('tab.mainboard');
        // $ionicViewService.getBackView().go();
    }
    $scope.cancelbuttonclick = function(){
        $state.go('tab.mainboard');
    }
    $scope.postbuttonclick = function(){
       // userId = UserService.userId;
         console.log($scope.user.youtebeurltxt);
    }
}])
.controller('processviewctrl',function($scope,$state,$http,$ionicViewService)
{
    $scope.sadnessOption = [{'value':'Social', 'isSelected': false},
                            {'value':'Environment', 'isSelected': true},
                            {'value':'Personal', 'isSelected': false}];
    var emotionvalue,triggervalue;
            emotionvalue = 0;triggervalue = 0;
    // var indexPath = document.getElementById('selectedSadness').selectedIndex;
    //  console.log($scope.sadnessOption[indexPath].value);
       
    $scope.goBack = function(){
        console.log('back button!!!');
        // $ionicViewService.getBackView().go();
        $state.go('tab.mainboard');
    }
    $scope.cancelbuttonclick = function(){
        $state.go('tab.mainboard');
    }
    $scope.trigger = {
        selecter:'',
    }
    $scope.emotion = {
        selecter:'',
    }
    $scope.process = {
        poptext:'',
        createdtext:'',
    }
    $scope.postbuttonclick = function(){
        console.log('processbutton click!');
        if ($scope.trigger.selecter == 0){
            triggervalue = 0;
        }
        else if($scope.trigger.selecter == 1){
            triggervalue = 1;
        }
        else if($scope.trigger.selecter == 2){
            triggervalue = 2;
        }
        if($scope.emotion.selecter == 0){
            emotionvalue = 0;
        }
        else if($scope.emotion.selecter == 1){
            emotionvalue = 1;
        }
        else if($scope.emotion.selecter == 2){
            emotionvalue = 2; 
        }
        else if($scope.emotion.selecter == 3){
            emotionvalue = 3;
        }
        console.log(emotionvalue);
       
       
       
       var setpostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
              'addprocesspost':1,
              'type':1,
              'title':'testuserid',
              'description':$scope.process.createdtext, 
              'pop':$scope.process.poptext,
              'emotion':emotionvalue,
              'trig':triggervalue,
              'youtubeUrl':'processyoutubeUrl',
              'attachedFile':'testattachFile',
              'attachedFilename':'testfilename',
              'userId':16,
              'visibility':0,
            //   'userId':userId,
            //   'visivility':'testvi',
            //   'status':'teststatus',              
           }
        };
        
         $http(setpostdata)
            .then(function(response){
                console.log(response.data);
                $state.go('tab.mainboard');
            },function(error){
                console.log(error);
            }
         )
       
       
       
       
       
       
    }
})
.controller('Leapview1ctrl',function($scope,$state,$http, $ionicViewService)
{
    $scope.user = {
         leapdescriptiontxt:'',        
    }
    $scope.goBack = function(){
        console.log('back button!!!');
        // $ionicViewService.getBackView().go();
        $state.go('tab.mainboard');
    }
    $scope.cancelclick = function(){
        $state.go('tab.mainboard');
    }
    $scope.postclick = function(){
        console.log('postbuttonclick!!!!');
        
        
         var setpostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
              'addleappost':1,
              'type':2,
              'title':'testuserid',
              'description':$scope.user.leapdescriptiontxt, 
              'pop':'testpop',
              'emotion':2,
              'trig':1,
              'youtubeUrl':'',
              'attachedFile':'',
              'attachedFilename':'',
              'userId':16,
              'visibility':0,
            //   'userId':userId,
            //   'visivility':'testvi',
            //   'status':'teststatus',              
           }
        };
        
         $http(setpostdata)
            .then(function(response){
                console.log(response.data);
                 $state.go('tab.mainboard');
               
            },function(error){
                console.log(error);
            }
         )
        
    }
    
})

.controller('Bottomviewctrl',function($scope,$state,$http, $ionicViewService)
{
    $scope.user = {
        bottomdescriptiontxt:'',
    }
    $scope.goBack = function(){
        console.log('back button!!!');
        // $ionicViewService.getBackView().go();
        $state.go('tab.mainboard');
    }
    $scope.cancelbuttonclick = function(){
        $state.go('tab.mainboard');
    }
    $scope.postbuttonclick = function(){
        console.log('postbuttonclick!!!!');
        
        var setpostdata = {
           method:'POST',
           url: 'http://ambo2.serenit.com.au/database.php',
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
              'addbottompost':1,
              'type':3,
              'title':'testuserid',
              'description':$scope.user.bottomdescriptiontxt, 
              'pop':'testpop',
              'emotion':2,
              'trig':1,
              'youtubeUrl':'',
              'attachedFile':'',
              'attachedFilename':'',
              'userId':16,
              'visibility':0,
            //   'userId':userId,
            //   'visivility':'testvi',
            //   'status':'teststatus',              
           }
        };
        
         $http(setpostdata)
            .then(function(response){
                console.log(response.data);
                 $state.go('tab.mainboard');
               
            },function(error){
                console.log(error);
            }
         )
        
        
    }
})
.controller('NavCtrl', function ($scope, $ionicLoading, $location, $state, $ionicSideMenuDelegate, $rootScope, $ionicSlideBoxDelegate, $ionicPopup) {
    
    // Side menu init Method
    $scope.init = function() {

    }
    
    // Side menu toggleLeft method
    $rootScope.showMenu = function() {
        
        $ionicSideMenuDelegate.toggleLeft();
    };
    
    // Side menu toggleRight method
    $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
})

      
// ****************************
// User Create view part
// ****************************
.controller('usercreatectrl',function($scope,$state)
{
    $scope.goBack = function(){
    console.log('back button!!!');
    $state.go('tab.account');
    }
})
// ******************************
// Postdetailview
// ******************************
.controller('postdetailviewctrl',function($scope,$state,$http,$rootScope)
{
    
    
         var seledtduserid,selectedpostid;
                    selectedpostid = 0;
                    seledtduserid = 0;
                    commentnum = 0;
     $scope.commentdata = {
         counter:'',
     }
     $scope.selecteddata = {
        
     }
     $scope.$on('$ionicView.beforeEnter', function() {
         
         $rootScope.celldata = $rootScope.chat;
        
                    seledtduserid = $rootScope.celldata.userId;
                    selectedpostid = $rootScope.celldata.postid;
         console.log(selectedpostid);
         
         var getcommentdata = {
             method:'POST',
             url:'http://ambo2.serenit.com.au/database.php',
             headers:{
                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
             },
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data:{
                'getcommentdata':1,
            }
         };
         $http(getcommentdata)
           .then(function(response){
               
               $scope.getcommentdata = response.data;
               
//******************* detail time set part *******************
                             
               var datacounter = 0;
               datacounter = Object.keys(response.data).length;
               console.log('responsedata number'+ datacounter);
               for(var i = 0;i<datacounter;i++){
                   if($scope.getcommentdata[i].postId == selectedpostid){
                       commentnum++;
                       
                       console.log('in this case' + commentnum);
                   }
                   
               }
               for(var j=0;j< datacounter;j++){
                   if($scope.getcommentdata[j].postId == selectedpostid){
                        $scope.selecteddata[j] =  $scope.getcommentdata[j]; 
                        
                      if($scope.selecteddata[j].time > 86400){
                                console.log('more than 8600'+$scope.selecteddata[j].time);
                                $scope.selecteddata[j].time = Math.round($scope.selecteddata[j].time/86400);
                                var daytext = ' Days ago';
                                var timenum = $scope.selecteddata[j].time;
                                var timestr = timenum.toString();
                                $scope.selecteddata[j].commenttime = timestr + daytext;
                       }
                       if(3600 < $scope.selecteddata[j].time && $scope.selecteddata[j].time < 86400){
                           console.log('more than 3600 and less than 86400'+$scope.selecteddata[j].time);
                            $scope.selecteddata[j].time = Math.round($scope.selecteddata[j].time/3600);
                            var daytext = ' Hours ago';
                            var timenum = $scope.selecteddata[j].time;
                            var timestr = timenum.toString();
                            $scope.selecteddata[j].commenttime = timestr + daytext;
                       }
                       if(60 < $scope.selecteddata[j].time && $scope.selecteddata[j].time < 3600){
                           console.log('more than 3600 and less than 86400'+$scope.selecteddata[j].time);
                            $scope.selecteddata[j].time = Math.round($scope.selecteddata[j].time/60);
                            var daytext = ' Minutes ago';
                            var timenum = $scope.selecteddata[j].time;
                            var timestr = timenum.toString();
                            $scope.selecteddata[j].commenttime = timestr + daytext;
                       }
                   }
                           
               }  
               console.log($scope.selecteddata.length);
               $scope.commentdata.counter = commentnum;
               
           }, function(error){
               console.log(error);
           });
    });
    
   
    var userid,postId,commentlevel;
    userid = 0;postId = 0;commentlevel = 0;
     $scope.$on('$ionicView.beforeEnter', function() {
         
         
          userid = $rootScope.celldata.userId;
          postId = $rootScope.celldata.postid;
      
     });
    
     $scope.goBack = function(){
            commentnum = 0;
            $scope.selecteddata = {
                      }
     $state.go('tab.mainboard');
     }
     
     $scope.user = {
         commenttext:'',
     }
     
     $scope.likebuttonclick = function()
     {
         console.log('likeclick!');
         var numlike = parseInt($scope.celldata.likenumber) +1;
         $scope.celldata.likenumber = numlike;
     }
     $scope.commentbuttonclick = function()
     {
         console.log('commentbuttonclick!');
         var numcomment =  parseInt($scope.celldata.level) +1;
         $scope.celldata.level = numcomment;
         commentlevel = $scope.celldata.level;
     }
     
     $scope.Loadbuttonclick = function()
     {
         
     }
     $scope.postbuttonclick = function()
     {
         console.log($scope.user.commenttext);
         console.log('postbuttonclick!!');
         
         
           var setcommentdata = {
                        method:'POST',
                        url: 'http://ambo2.serenit.com.au/database.php',
                        headers:{
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
           transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {
              'addPostComment':1,
              'comment':$scope.user.commenttext,
              'userId':userid,
              'postId':postId,
              'status':'report',
              'level':commentlevel,
             
              
                  }
         };
           $http(setcommentdata)
             .then(function(response){
                  console.log('comment post success');
                  $state.reload();
                  commentnum = 0;
                  $scope.selecteddata = {
                      }
                //   $state.go('tab.mainboard');
             }, function(error){
                 console.log(error);
           });
     }
})
