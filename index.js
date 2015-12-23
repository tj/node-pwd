
/**
 * Module dependencies.
 */

var crypto = require('crypto');

/**
 * Bytesize.
 */

var len = 128;

/**
 * Iterations. ~300ms
 */

var iterations = 12000;

/**
 * Set length to `n`.
 *
 * @param {Number} n
 * @api public
 */

exports.length = function(n){
  if (0 == arguments.length) return len;
  len = n;
};

/**
 * Set iterations to `n`.
 *
 * @param {Number} n
 * @api public
 */

exports.iterations = function(n){
  if (0 == arguments.length) return iterations;
  iterations = n;
};

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api public
 */

exports.hash = function(pwd, salt, fn){
  if (3 == arguments.length) {
    if (!pwd) return fn(new Error('password missing'));
    if (!salt) return fn(new Error('salt missing'));
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
      if (err) return fn(err);
      fn(null, hash.toString('base64'));
    });
  } else {
    fn = salt;
    if (!pwd) return fn(new Error('password missing'));
    crypto.randomBytes(len, function(err, salt){
      if (err) return fn(err);
      salt = salt.toString('base64');
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, hash.toString('base64'));
      });
    });
  }

  return function(done){
    fn = done;
  }
  
/**
 * Hashes asynchronously a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api public
 */
exports.hashAsync = function(pwd, salt, fn){
    var Promise = require('bluebird');
  	return new Promise(function(resolve, reject){
  		exports.hash(pwd, salt, function(err, hash)
  		{
  			fn(err, hash);
  			
  			if(err)
  				reject();
  			else
  				resolve();
  		});
  	});
  };
};
