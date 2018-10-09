const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let directory = `${exports.dataDir}/${id}.txt`;
    fs.writeFile(directory, text, function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  // var data = [];
  let directory = `${exports.dataDir}`;
  fs.readdir(directory, (err, data) => {
    if (err) {
      callback(err);
    } else {
      var dataOfObj = data.map(name => ({
        'id': name.slice(0, 5),
        'text': name.slice(0, 5),
      }));
      callback(null, dataOfObj);
    }
  });
};

exports.readOne = (id, callback) => {
  let directory = `${exports.dataDir}/${id}.txt`;
  fs.readFile(directory, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        'id': id,
        'text': data.toString()
      });
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  let directory = `${exports.dataDir}/${id}.txt`;
  fs.readFile(directory, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(directory, text, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  let directory = `${exports.dataDir}/${id}.txt`;
  fs.unlink(directory, (err) => {
    if (err) {
      callback(err);
    } else {
      callback('deleted successfully');
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
