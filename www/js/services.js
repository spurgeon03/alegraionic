angular.module('starter.services', [])

.factory('ContactsServices', function($http,$ionicLoading,$state) {
  var contacts = [];
  /*
    En el header Authorization se debe poner el correo y el token del usuario separado por dos puntos (:), todo en base64.

    Por ejemplo, si el correo del usuario es ejemploapi@alegra.com y el token es tokenejemploapi12345 el header Authorization debe quedar así :

    Authorization: Basic ZWplbXBsb2FwaUBhbGVncmEuY29tOnRva2VuZWplbXBsb2FwaTEyMzQ1
    Donde ZWplbXBsb2FwaUBhbGVncmEuY29tOnRva2VuZWplbXBsb2FwaTEyMzQ1 es base_64('ejemploapi@alegra.com:tokenejemploapi12345')
   */
  var basicAuth = '';

  return {
    all: function(addMoreContacts) {
      $ionicLoading.show();
      $http({ 
          method : "GET",
          url : "https://app.alegra.com/api/v1/contacts/?order_field=id",   
          headers: {'Authorization': 'Basic '+basicAuth}
      }).then(function mySuccess(response) {
          $ionicLoading.hide();
          contacts = response.data; 
          addMoreContacts(contacts.slice(0,5));
      }, function myError(response) {
          $ionicLoading.hide();
          return null;
      }); 
      return null;
    },
    getLimit: function(start,addMoreContacts){
      addMoreContacts(contacts.slice(start,start+5));
    },
    get: function(contactId) {
      for (var i = 0; i < contacts.length; i++) {
        if (parseInt(contacts[i].id) === parseInt(contactId)) {
          return contacts[i];
        }
      }
      return null;
    },
    delete: function(contactId, removeFromScope){
      $ionicLoading.show();
      $http({ 
          method : "DELETE",
          url : "https://app.alegra.com/api/v1/contacts/"+contactId,   
          headers: {'Authorization': 'Basic '+basicAuth}
      }).then(function mySuccess(response) { 
          $ionicLoading.hide();
          removeFromScope(contactId);
      }, function myError(response) {
          $ionicLoading.hide();
          return null;
      });
      return null;
    },
    create: function(contact){
      $ionicLoading.show();
      $http({ 
          method : "POST",
          url : "https://app.alegra.com/api/v1/contacts/",   
          headers: {'Authorization': 'Basic '+basicAuth},
          data: contact
      }).then(function mySuccess(response) { 
          $ionicLoading.hide();
          contacts.push(response.data);
          alert("El contacto ha sido creado exitosamente.");
          $state.go('tab.contacts');
      }, function myError(response) {
          $ionicLoading.hide();
          return null;
      });
      return null;
    },
    countall: function(){
      return contacts.length;
    }
  };
});