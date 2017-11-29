angular.module('starter.controllers', [])

.controller('ContactsCtrl', function($scope, ContactsServices,$ionicScrollDelegate) {
  $scope.contacts = [];
  $scope.start = 0;
  $scope.formsearch = {search:null};

  $scope.$on('$ionicView.enter', function(){
    var totalContacts = ContactsServices.countall();
    if($scope.contacts.length != totalContacts){
      $scope.contacts = ContactsServices.getContacts();
    } 
  });
 
  function successCallBack(contacts){
    $scope.contacts = contacts;
  }

  function addMoreContacts(contacts){
    var log = [];
    angular.forEach(contacts, function(value, key) {
      $scope.contacts.push(value); 
    });
  }

  function removeFromScope (contactId){
      for(var i = $scope.contacts.length - 1; i >= 0; i--) {
          if($scope.contacts[i].id === contactId) {
             $scope.contacts.splice(i, 1);
          }
      }
  }

  ContactsServices.all(successCallBack); 

  $scope.remove = function(contactId) {
    ContactsServices.delete(contactId, removeFromScope);
  }

  $scope.doRefresh = function(formsearch, searchForm){
    $scope.start = 0;
    for (var elem in formsearch) {
      formsearch[elem] = null;
    }
    searchForm.$setPristine();
    ContactsServices.all(successCallBack);
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.loadMore = function() {
    $scope.start += 10;
    ContactsServices.getLimit($scope.start,addMoreContacts);
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.moreDataCanBeLoaded = function(){
    var count = ContactsServices.countall();
    if($scope.start >= count){
      return false;
    }else{
      return true;
    }
  }

  $scope.searchBy = function(query){
    ContactsServices.getByQuery(query,successCallBack); 
  }

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });

})

.controller('ContactCtrl', function($scope, $stateParams, ContactsServices,$state) {

  $scope.contact = ContactsServices.get($stateParams.contactId);

})

.controller('CrearCtrl', function($scope, $stateParams, ContactsServices) {
  //Init Vars
  $scope.contact = {};

  $scope.createUser = function(contact){
    contact.type = [];
    if(contact.client === true){
      contact.type.push("client");
    }

    if(contact.provider === true){
      contact.type.push("provider");
    }

    ContactsServices.create(contact);
  }
});
