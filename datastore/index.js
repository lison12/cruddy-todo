const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
var readdirAsync = Promise.promisify(fs.readdir);
var readFileAsync = Promise.promisify(fs.readFile);


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

// Callback way
// exports.readAll = (callback) => {
//   // var data = [];
//   let directory = `${exports.dataDir}`;
//   fs.readdir(directory, (err, data) => {
//     if (err) {
//       callback(err);
//     } else {
//       var dataOfObj = data.map(name => ({
//         'id': name.slice(0, 5),
//         'text': name.slice(0, 5),
//       }));
//       callback(null, dataOfObj);
//     }
//   });
// };


// Using Promise
exports.readAll = (callback) => {
  // use the promisified readdir to read through the directory -> a list of names of files inside the dir
  // on data array, we map each file's name to readFile and convert the list of names of files into the list of buffers of the files -> then make into an object containing id as title, and contents as text
  // buffers -> 
  return readdirAsync(exports.dataDir)
    .then((names) => {
      var data = names.map((name) => {
        let filepath = path.join(exports.dataDir, name);
        return readFileAsync(filepath)
          .then((buffer) => {
            return {
              'id': name.slice(0, 5),
              'text': buffer.toString()
            };
          });
      });
      Promise.all(data)
        .then((files) => {
          callback(null, files);
        });
    });

};



exports.readOne = (id, callback) => {
  let directory = path.join(exports.dataDir, `${id}.txt`);
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
