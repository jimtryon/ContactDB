var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

EmployeeProvider = function(host, port) {
		this.db = new Db('node-mongo-contact', new Server(host, port, {
				safe: false
		}, {
				auto_reconnect: true
		}, {}));
		this.db.open(function() {});
};


EmployeeProvider.prototype.getCollection = function(callback) {
		this.db.collection('contacts', function(error, contacts_collection) {
				if (error) callback(error);
				else callback(null, contacts_collection);
		});
};

//find all employees
EmployeeProvider.prototype.findAll = function(callback) {
		this.getCollection(function(error, contacts_collection) {
				if (error) callback(error)
				else {
						contacts_collection.find().toArray(function(error, results) {
								if (error) callback(error)
								else callback(null, results)
						});
				}
		});
};

//save new employee
EmployeeProvider.prototype.save = function(contacts, callback) {
		this.getCollection(function(error, contacts_collection) {
				if (error) callback(error)
				else {
						if (typeof(contacts.length) == "undefined")
								contacts = [contacts];

						for (var i = 0; i < contacts.length; i++) {
								contacts = contacts[i];
								contacts.datemet = new Date('03/20/2015');
						}

						contacts_collection.insert(contacts, function() {
								callback(null, contacts);
						});
				}
		});
};

//find an employee by ID
EmployeeProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, contacts_collection) {
      if( error ) callback(error)
      else {
        contacts_collection.findOne({_id: contacts_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

// update an employee
EmployeeProvider.prototype.update = function(employeeId, employees, callback) {
		this.getCollection(function(error, contacts_collection) {
				if (error) callback(error);
				else {
						contacts_collection.update({
										_id: contacts_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)
								},
								employees,
								function(error, employees) {
										if (error) callback(error);
										else callback(null, employees)
								});
				}
		});
};

//delete employee
EmployeeProvider.prototype.delete = function(employeeId, callback) {
		this.getCollection(function(error, contacts_collection) {
				if (error) callback(error);
				else {
						contacts_collection.remove({
										_id: contacts_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)
								},
								function(error, employee) {
										if (error) callback(error);
										else callback(null, employee)
								});
				}
		});
};



exports.EmployeeProvider = EmployeeProvider;
