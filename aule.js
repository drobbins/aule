Collections = new Meteor.Collection("collections");

Aule = {
    _collection: Collections,
    addCollection: function (collectionName) {
        Meteor.call("addCollection", collectionName, function (error, response) {
            if (response) {
                Aule._initCollection(collectionName);
            }
        });
    },
    initializeCollections: function () {
        Collections.find().forEach( function (collection) {
            Aule._initCollection(collection.name);
        });
    },
    _initCollection: function _initCollection(name) {
        console.log("Initializing Collection:", name);
        Aule[name] = new Meteor.Collection(name);
        eval("window[name] = Aule[name];");
    }
};

if (Meteor.isClient) {

    Template.collectionList.collections = function () {
        return Collections.find();
    }

    Template.collectionList.events({
        "click .initializeCollections": function () {
            Aule.initializeCollections();
        }
    });

    Template.addCollection.events({
        "submit form": function (e) {
            e.preventDefault();
            collectionName = $(e.target).find("[name=collectionName]").val();
            Aule.addCollection(collectionName);
        }
    });
}

if (Meteor.isServer) {
    Meteor.methods({
        addCollection: function (collectionName) {
            alwaysAllow = function () { return true; };
            Collections.insert({name: collectionName});
            newCollection = new Meteor.Collection(collectionName);
            return true;
        }
    });

    Meteor.startup(function () {
        Collections.find().forEach(function (collection) {
            new Meteor.Collection(collection.name);
        });
    });
}

