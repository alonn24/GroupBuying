'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.factory('userService', ['$rootScope', '$resource', '$q', function ($rootScope, $resource, $q) {
  return {
      model: {
          userName: '',
          password: '',
          role: '',
          authorized: false,
          email: '',
          profile: ''
      },
      LogIn: function (_userName, _password) {
          // Return promise
          var deferred = $q.defer();

          // Log in to the server
          var ServerLogIn = function(model) {
              // Set up resource
              var UserResource = $resource('/Services/GeneralServices.svc/GetUserData/:username/:password');
              UserResource.get({username: encodeURI(_userName), password: encodeURI(_password)},
                  // Success
                  function(data, responseHeaders) {
                      if(data.Authorized) {
                          // Save data to model
                          model.userName = data.UserName;
                          model.password = _password;
                          model.role = data.Role;
                          model.authorized = data.Authorized;
                          model.email = data.Email;
                          model.profile = data.Profile;
                          deferred.resolve();
                          //userService.LogIn(data.UserName, $scope.password, data.Role, data.Authorized, data.Email, data.Profile);
                          //$scope.LoadUserOrders();
                      } else {
                          deferred.reject('The user is not authorized.');
                      }
                  }
                  // Error
                  ,function(responseHeaders){
                      deferred.reject('Error occurred in GetUserData.');
                      console.error('Error occurred in GetUserData.');
                  });
          }
          ServerLogIn(this.model);

          // return promise
          return deferred.promise;
      },
      LogOut: function () {
          this.model.authorized = false;
          this.model.userName = '';
          this.model.password = '';
          this.model.role = '';
          this.model.email = '';
          this.model.profile = '';
      },
      GetUserOrders: function() {
          // Return promise
          var deferred = $q.defer();

          // Get orders from the server
          var OrdersResource = $resource('/Services/GeneralServices.svc/GetUserOrders/:username/:password');
          OrdersResource.query({username: encodeURI(this.model.userName),
                  password: encodeURI(this.model.password)},
              // Success
              function(data, responseHeaders) {
                  // Format date
                  for(var i=0; i < data.length; i++) {
                      var date = new Date(parseInt(data[i].Date.substr(6)));
                      data[i].Date = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                  }
                  deferred.resolve(data);
              }
              // Error
              ,function(responseHeaders){
                  deferred.reject('Error occurred in GetUserOrders.');
                  console.error('Error occurred in GetUserOrders.');
              });

          // Return promise
          return deferred.promise;
      },
      RegisterUser: function(_username, _password, _role, _email, _profile) {
          // Return promise
          var deferred = $q.defer();
          var RegisterUser = function(model) {
              // Register to the server
              var Register = $resource('/Services/GeneralServices.svc/RegisterUser/:username/:password/:role/:email/:profile');
              Register.get({username: _username, password: _password,
                      role: _role, email: _email, profile: _profile},
                  // Success
                  function(data, responseHeaders) {
                      // Set user data and advance to next page
                      if(data && data.Succeed == true) {
                          // Save data to model
                          model.userName = _username;
                          model.password = _password;
                          model.role = _role;
                          model.authorized = true;
                          model.email = _email;
                          model.profile = _profile.url;
                          deferred.resolve();
                      } else {
                          deferred.reject(data.Message);
                      }
                  }
                  // Error
                  ,function(responseHeaders){
                      deferred.reject('Error occurred in RegisterUser.');
                      console.error('Error occurred in RegisterUser.');
                  });
          }
          RegisterUser(this.model);

          // Return promise
          return deferred.promise;
      }
  };
}])
.factory('productService', ['$rootScope', '$resource', '$q', 'userService', function ($rootScope, $resource, $q, userService) {
    return {
        GetProducts: function(userName) {
            // Return promise
            var deferred = $q.defer();

            // Set user products if exist
            var url = '/Services/GeneralServices.svc/GetProducts';
            var parameters = {};
            if (userName) {
                url += '/:userName';
                parameters.userName = userName;
            }

            // Get products from server
            var ProductsResource = $resource(url);
            ProductsResource.query(parameters,
                // Success
                function(data, responseHeaders){
                    deferred.resolve(data);
                },
                // Error
                function(responseHeaders){
                    deferred.reject('Error occurred in RegisterUser.');
                    console.error('Error occurred in RegisterUser.');
                });

            // Return promise
            return deferred.promise;
        },
        OrderProducts: function(products) {
            // Return promise
            var deferred = $q.defer();

            // Build orders string - id,quantity,shipping...
            var orders = "";
            for(var i=0; i < products.length; i++) {
                if (i > 0) orders += ",";
                // Id
                orders += products[i].ProductId;
                // Quantity
                if(products[i].quantity)
                    orders += "," + products[i].quantity;
                else
                    orders += ",1";
                // Shipping
                if(products[i].shipping == true)
                    orders += ",1";
                else
                    orders += ",0";
            }

            // Order to server
            var OrderResource = $resource('/Services/GeneralServices.svc/OrderProducts/:username/:password/:orders');
            OrderResource.get({
                    username: encodeURI(userService.model.userName),
                    password: encodeURI(userService.model.password),
                    orders: orders},
                // Success
                function(data, responseHeaders) {
                    if(data && data.Succeed == true) {
                        deferred.resolve();
                    } else {
                        deferred.reject(data.Message);
                    }
                }
                // Error
                ,function(responseHeaders){
                    deferred.reject('Error occurred in OrderProducts.');
                    console.error('Error occurred in OrderProducts.');
                });

            // Return promise
            return deferred.promise;
        },
        GetProductDetails: function(productId) {
            // Return promise
            var deferred = $q.defer();

            var ProductResource = $resource('/Services/GeneralServices.svc/GetProductDetails/:productId');
            ProductResource.get({productId: productId},
                // Success
                function(data, responseHeaders){
                    // Format date and calculate total quantity
                    data.TotalQuantity = 0;
                    for(var i=0; i<data.Orders.length; i++) {
                        data.TotalQuantity += (data.Orders[i].Quantity*1);    // Add total quantity
                        var date = new Date(parseInt(data.Orders[i].Date.substr(6)));
                        data.Orders[i].Date = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    }
                    if(data.Product.DatePosted) {
                        var date = new Date(parseInt(data.Product.DatePosted.substr(6)));
                        data.Product.DatePosted = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    }
                    if (data.DateEnd) {
                        var date = new Date(parseInt(data.DateEnd.substr(6)));
                        data.DateEnd = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    }
                    deferred.resolve(data);
                },
                // Error
                function(responseHeaders){
                    deferred.reject('Error occurred in GetProductDetails.');
                    console.error("Error occurred in GetProductDetails.");
                });

            // Return promise
            return deferred.promise;
        },
        UpdateProductDetails: function(product) {
            // Return promise
            var deferred = $q.defer();

            var UpdateProductResource = $resource('/Services/GeneralServices.svc/UpdateProductDetails' +
                '/:username/:password/:productId/:title/:minPrice/:maxPrice/:requiredOrders');
            UpdateProductResource.get(
                {
                    username: encodeURI(userService.model.userName),
                    password: encodeURI(userService.model.password),
                    productId: product.ProductId,
                    title: product.Title,
                    minPrice: product.MinPrice,
                    maxPrice: product.MaxPrice,
                    requiredOrders: product.RequiredOrders
                },
                // Success
                function(data, responseHeaders) {
                    if(data && data.Succeed == true) {
                        deferred.resolve();
                    } else {
                        deferred.reject(data.Message);
                    }
                }
                // Error
                ,function(responseHeaders){
                    deferred.reject('Error occurred in UpdateProduct.');
                    console.error('Error occurred in UpdateProduct.');
                });

            // Return promise
            return deferred.promise;
        },
        CreateProduct: function(newProduct) {
            // Return promise
            var deferred = $q.defer();

            var CreateProductResource = $resource('/Services/GeneralServices.svc/CreateProduct' +
                '/:username/:password/:title/:minPrice/:maxPrice/:requiredOrders');
            CreateProductResource.get(
                {
                    username: encodeURI(userService.model.userName),
                    password: encodeURI(userService.model.password),
                    title: newProduct.Title,
                    minPrice: newProduct.MinPrice,
                    maxPrice: newProduct.MaxPrice,
                    requiredOrders: newProduct.RequiredOrders
                },
                // Success
                function(data, responseHeaders) {
                    if(data && data.Succeed == true) {
                        deferred.resolve();
                    } else {
                        deferred.reject(data.Message);
                    }
                }
                // Error
                ,function(responseHeaders){
                    deferred.reject('Error occurred in CreateProduct.');
                    console.error('Error occurred in CreateProduct.');
                });

            // Return promise
            return deferred.promise;
        },
        RemoveProduct: function(productId) {
            // Return promise
            var deferred = $q.defer();

            var RemoveProductResource = $resource('/Services/GeneralServices.svc/RemoveProduct' +
                '/:username/:password/:productId');
            RemoveProductResource.get(
                {
                    username: encodeURI(userService.model.userName),
                    password: encodeURI(userService.model.password),
                    productId: productId
                },
                // Success
                function(data, responseHeaders) {
                    if(data && data.Succeed == true) {
                        deferred.resolve();
                    } else {
                        deferred.reject(data.Message);
                    }
                }
                // Error
                ,function(responseHeaders){
                    deferred.reject('Error occurred in RemoveProduct.');
                    console.error('Error occurred in RemoveProduct.');
                });

            // Return promise
            return deferred.promise;
        }
    }
}]);