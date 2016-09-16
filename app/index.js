require('angular');
// require('socket.io');

var app = angular.module('tutorApp',['LocalStorageModule']);
var URL = 'http://localhost:3000';

app.config(function(localStorageServiceProvider) {
	localStorageServiceProvider.setPrefix('tutorApp');
});

app.factory('myFactory',['localStorageService', function(localStorageService) {
	var fac = {};

	fac.setToken = function(token) {
		var token = localStorageService.set('token', token);
		return token;
	};

	fac.getToken = function() {
		var token = localStorageService.get('token');
		return token;
	};

	fac.clearToken = function() {
		var token = localStorageService.set('token', '');
		return token;
	};

	fac.objectify = function (listOfStr) {
		// console.log(listOfStr);
		var result = [];
		for (var i = 0; i < listOfStr.length; i++) {
				result.push({name:listOfStr[i]});
			}
		return result;
	};

	fac.listify = function (arrayOfObj) {
		// [{name:'blah1'},{name:'blah2'},{name:'blah3'}] --> "'blah1', 'blah2', 'blah2'"
		var result = [];
		for (var i = 0; i < arrayOfObj.length; i++) {
				result.push(arrayOfObj[i].name);
			}
		return result.join();
	};


	fac.objectify = function(arr){
		// ['blah1', 'blah2', 'blah2'] --> [{name:'blah1'},{name:'blah2'},{name:'blah3'}]
			var objArray = [];
			for (var i = 0; i < arr.length; i++){
				objArray.push({name:arr[i]});
			}
			return objArray;
	};

	return fac;

}]);


app.controller('optionsController', ['$http', 'myFactory','localStorageService', function($http, myFactory, localStorageService) {
	var vm = this;
	vm.header = 'Request';
	vm.subjects = [];
	vm.tables = [];

	vm.users = [];
	vm.mysubject = '';
	vm.mytable = '';
	vm.message = '';
	vm.currSessionID = '';
	vm.subjList = [];
	vm.tableList = [];
	vm.username = '';
	vm.password = '';
	vm.admin = false;

	vm.getOptions = function(name) {

		$http({
			method:'GET',
			url: URL + '/tables',
			headers: {
				'content-type':'application/json'
			}
		}).then(function success(res) {
			// console.dir(res);
			if (res.data.length > 0) {
				console.log('TABLES!')
				vm.tables = myFactory.objectify(res.data[0].tables);
				// console.dir(vm.tables);
			}// if
		}, function error(res) {
			alert('There was an error');
			console.log(res);
			}// error
		);// then

		$http({
			method:'GET',
			url: URL + '/subjects',
			headers: {
				'content-type':'application/json'
			}
		}).then(function success(res) {
			// console.dir(res);
			if (res.data.length > 0) {
				vm.subjects = myFactory.objectify(res.data[0].subjects);
				// vm.subjList = listify.makeList(vm.subjects);
				// console.dir(vm.subjects);
			}// if
		}, function error(res) {
			alert('There was an error');
			console.log(res);
			}// error
		);// then
	};// getOptions

	vm.createSession = function(data) {
		if (!vm.currSessionID) {
			$http({
				method:'POST',
				url: URL + '/sessions',
				headers: {
					'content-type':'application/json'
				},
				data: {
					subject:data.mysubject.name,
					table:data.mytable.name,
				}
			}).then(function success(res) {
				console.dir(res);
				if (res.status == 200) {
					vm.message = res.data.message;
					vm.currSessionID = res.data.data._id;
				}// if
			}, function error(res) {
				alert('There was an error');
				console.log(res);
				}// error
			);// then
		};// if
	};// createUser

	vm.deleteSession = function(sessionID) {
		console.log(URL + '/sessions/' + sessionID);
		if (!!sessionID) {
			$http({
				method:'DELETE',
				url: URL + '/sessions/' + sessionID,
				headers: {
					'content-type':'application/json'
				}
			}).then(function success(res) {
				console.dir(res);
				vm.currSessionID = '';
				vm.message = res.data.message;	
			}, function error(res) {
				alert('There was an error');
				console.log(res);
				}// error
			);// then
		};// if
	};// deleteSession

	vm.amIDeleted = function(ID) {
		console.log('IAMHERE');
		if (ID == vm.currSessionID) {
			vm.message = 'Your session is complete.';
			vm.currSessionID = '';			
		}
	};
	
	// *****************SUBJECTS*******************

	vm.createSubjects = function() {

		var token = myFactory.getToken();
		console.log('create!');

		var array = vm.subjList.split(',');
			$http({
				method:'POST',
				url: URL + '/admin/subjects',
				headers: {
					'content-type':'application/json',
					'Authorization': token
				},
				data: {
					subjects:array
				}
			}).then(function success(res) {
				console.dir('res.data.subjects:' + res.data.subjects);
				if (res.status == 200) {
					vm.subjects = myFactory.objectify(res.data.subjects);
					console.dir(res);
				}// if
			}, function error(res) {
				alert('There was an error');
				console.dir(res);
				}// error
			);// then
	};

	// vm.cancelSubjects = function() {
	// };

	vm.deleteSubjects = function() {
		var token = myFactory.getToken();
			$http({
				method:'DELETE',
				url: URL + '/admin/subjects',
				headers: {
					'content-type':'application/json',
					'Authorization': token
				}
			}).then(function success(res) {
				console.dir('res.data.subjects:' + res.data.subjects);
				if (res.status == 200) {
					vm.subjects = [];
					vm.subjList = [];
					console.dir(res);
				}// if
			}, function error(res) {
				alert('There was an error');
				console.dir(res);
				}// error
			);// then
	};

	// }

	// *****************TABLES*******************


	vm.createTables = function() {

		var token = myFactory.getToken();
		console.log('create!');

		var array = vm.tableList.split(',');
			$http({
				method:'POST',
				url: URL + '/admin/tables',
				headers: {
					'content-type':'application/json',
					'Authorization': token
				},
				data: {
					tables:array
				}
			}).then(function success(res) {
				console.dir('res.data.tables:' + res.data.tables);
				if (res.status == 200) {
					vm.tables = myFactory.objectify(res.data.tables);
					console.dir(res);
				}// if
			}, function error(res) {
				alert('There was an error');
				console.dir(res);
				}// error
			);// then
	};

	// vm.cancelSubjects = function() {
	// };

	vm.deleteTables = function() {
		var token = myFactory.getToken();
			$http({
				method:'DELETE',
				url: URL + '/admin/tables',
				headers: {
					'content-type':'application/json',
					'Authorization': token
				}
			}).then(function success(res) {
				console.dir('res.data.tables:' + res.data.tables);
				if (res.status == 200) {
					vm.tables = [];
					vm.tableList = [];
					console.dir(res);
				}// if
			}, function error(res) {
				alert('There was an error');
				console.dir(res);
				}// error
			);// then
	};

	//******************USERS*********************

	vm.createUsers = function() {
		console.log('create user!');
		console.dir(vm);
		var token = myFactory.getToken();

			$http({
				method:'POST',
				url: URL + '/admin/users',
				headers: {
					'content-type':'application/json',
					'Authorization': token
				},
				data: {
					name:vm.username,
					password:vm.password,
					admin:vm.admin
				}				
			}).then(function success(res) {
				console.dir('res.data.users:' + res.data.users);
				if (res.status == 200) {
					// vm.users = myFactory.objectify(res.data.users);
					vm.username = '';
					vm.password = '';
					vm.admin = false;
					console.dir(res);
				}// if
			}, function error(res) {
				alert('There was an error');
				console.dir(res);
				}// error
			);// then
	};

	vm.getUsers = function() {
		// console.log('getting users!');
		var token = myFactory.getToken();

			$http({
				method:'GET',
				url: URL + '/admin/users',
				headers: {
					'content-type':'application/json',
					'Authorization': token
				}
			}).then(function success(res) {
				// console.dir('res.data.users:' + res.data.users);
				if (res.status == 200) {
					vm.users = [];
					for (i = 0; i < res.data.length;i++) {
						vm.users.push({name:res.data[i].name, id:res.data[i]._id});
					}
					//vm.users = myFactory.objectify(res.data.users);
					// console.dir(res);
				}// if
			}, function error(res) {
				alert('There was an error');
				console.dir(res);
				}// error
			);// then
	};

	vm.deleteUser = function(userID) {
		console.dir('vm.users ' + vm.users);
		console.dir('userID:  ' + userID);
		var token = myFactory.getToken();

			$http({
				method:'DELETE',
				url: URL + '/admin/users/' + userID,
				headers: {
					'content-type':'application/json',
					'Authorization': token
				}
			}).then(function success(res) {
				console.dir('res.data.users:' + res.data.users);
				if (res.status == 200) {
					console.dir(res);
				}// if
			}, function error(res) {
				alert('There was an error');
				console.dir(res);
				}// error
			);// then
	};
}]);// controller


app.controller('sessionsController', ['$http',function($http) {
	var vm = this;
	vm.header = 'Queue';
	vm.sessions = [{
		subject:'',
		table:'',
		timeIn:'',
		id:''
	}];
	vm.mysubject = '';
	vm.mytable = '';
	vm.message = '';
	vm.currSessionID = '';

	vm.getSessions = function() {
		$http({
			method:'GET',
			url: URL + '/sessions',
			headers: {
				'content-type':'application/json'
			}
		}).then(function success(res) {
			vm.sessions = res.data;
            for (var i=0; i < vm.sessions.length;i++) {// convert to hh:mm:ss
            	var d = new Date(vm.sessions[i].timeIn);
                var time = d.toTimeString().split(' ')[0];
				vm.sessions[i].timeIn = time;
            };
		}, function error(res) {
			alert('There was an error');
			console.log(res);
			}// error
		);// then
	};


    vm.completeSession = function(sessionID) {
        console.log("Put:" + sessionID);
        if (!!sessionID) {
            $http({
                method:'PUT',
                url: URL + '/sessions/' + sessionID,
                headers: {
                    'content-type':'application/json'
                }
            }).then(function success(res) {
                console.dir("res:" + res);
                vm.currSessionID = '';
                vm.message = res.data.message;  
            }, function error(res) {
                alert('There was an error');
                console.log(res);
                }// error
            );// then
        };// if
    };// putSession

	vm.deleteSession = function(sessionID) {
		console.log("Delete:" + sessionID);
		if (!!sessionID) {
			$http({
				method:'DELETE',
				url: URL + '/sessions/' + sessionID,
				headers: {
					'content-type':'application/json'
				}
			}).then(function success(res) {
				console.dir("res:" + res);
				vm.currSessionID = '';
				vm.message = res.data.message;	
			}, function error(res) {
				alert('There was an error');
				console.log(res);
				}// error
			);// then
		};// if
	};// deleteSession
}]);// controller

app.controller('loginController', ['$http', 'myFactory', function($http, myFactory) {
	console.log("login called");
	var vm = this;
    vm.username = '';
    vm.password = '';
    vm.loggedBool = false;
    vm.message = '';

    vm.login = function(){
    	$http({
				method:'POST',
				url: URL + '/login',
				headers: {
					'content-type':'application/json',
            		'Authorization': 'Basic ' + btoa(vm.username + ':' + vm.password)
				}
			}).then(function success(res) {
				if (res.status == 200) {
					myFactory.setToken(res.data.token);
					vm.loggedIn();
					console.dir(res.data.token);
				}// if
			}, function error(res) {
				// vm.message = res.data
				alert(res.data);
				console.log(res);
				}// error
			);// then
    };
  

  	vm.logout = function(){
		myFactory.clearToken();
	    vm.username = '';
	    vm.password = '';
  		vm.loggedBool = false;
  	}

  	vm.loggedIn = function(){
  		vm.loggedBool= true;
  	}
  	vm.loggedOut = function(){
  		vm.loggedBool = false;
  	}
}]);

app.controller('exportController', ['$http', 'myFactory', function($http, myFactory) {
	var vm = this;
    vm.email = '';

    vm.exportEmail = function(email){
    	console.log("export called");
		var token = myFactory.getToken();
    	$http({
				method:'POST',
				url: URL + '/admin/email',
				headers: {
					'content-type':'application/json',
            		'Authorization': token
				},
				data:{
					email:email
				}
			}).then(function success(res) {
				if (res.status == 200) {					
					console.dir('email sent');
				}// if
			}, function error(res) {
				// vm.message = res.data
				alert(res.data);
				console.log(res);
				}// error
			);// then
    };
  
    vm.exportDownload = function() {
    	console.log("download called");
		var token = myFactory.getToken();
    	$http({
				method:'GET',
				url: URL + '/admin/downloads',
				headers: {
					'content-type':'application/json',
            		'Authorization': token
				},
			}).then(function success(res) {
				if (res.status == 200) {					
					console.dir(res);
				}// if
			}, function error(res) {
				// vm.message = res.data
				alert(res.data);
				console.log(res);
				}// error
			);// then

    };
}]);

app.controller('messageController', ['$http', 'myFactory', function($http, myFactory) {
	var msg = this;
    msg.test = 'test';

    msg.test = function(){
    	console.log('HERE!');
    };
}]);