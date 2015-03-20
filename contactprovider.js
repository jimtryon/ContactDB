var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ContactProvider = function(host, port) {
    this.db = new Db('contact', new Server(host, port, {
        safe: false
    }, {
        auto_reconnect: true
    }, {}));
    this.db.open(function() {});
};


ContactProvider.prototype.getCollection = function(callback) {
    this.db.collection('contacts', function(error, contacts-collection) {
        if (error) callback(error);
        else callback(null, contacts-collection);
    });
};

//find all employees
ContactProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, contacts-collection) {
        if (error) callback(error)
        else {
            contacts-collection.find().toArray(function(error, results) {
                if (error) callback(error)
                else callback(null, results)
            });
        }
    });
};

//save new contact
ContactProvider.prototype.save = function(employees, callback) {
    this.getCollection(function(error, contacts-collection) {
        if (error) callback(error)
        else {
            if (typeof(contacts.length) == "undefined")
                contacts = [contacts];

            for (var i = 0; i < contacts.length; i++) {
                contacts = contacts[i];
                contacts.created_at = new Date();
            }

            contacts-collection.insert(contacts, function() {
                callback(null, contacts);
            });
        }
    });
};

//find an employee by ID
ContactProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, contacts-collection) {
      if( error ) callback(error)
      else {
        contacts-collection.findOne({_id: contacts-collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
  };

// update an contact
ContactProvider.prototype.update = function(contactId, contacts, callback) {
    this.getCollection(function(error, contacts-collection) {
        if (error) callback(error);
        else {
            contacts-collection.update({
                    _id: contacts-collection.db.bson_serializer.ObjectID.createFromHexString(contactId)},
                contacts,
                function(error, contacts) {
                    if (error) callback(error);
                    else callback(null, contacts)
                });
        }
    });
};

//delete contact
ContactProvider.prototype.delete = function(contactId, callback) {
    this.getCollection(function(error, contacts-collection) {
        if (error) callback(error);
        else {
            contacts-collection.remove({
                    _id: contacts-collection.db.bson_serializer.ObjectID.createFromHexString(contactId)},
                function(error, contact) {
                    if (error) callback(error);
                    else callback(null, contact)
                });
        }
    });
};

exports.ContactProvider = ContactProvider;
