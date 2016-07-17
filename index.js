
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
 * Digest.
 */
var digest = 'sha1';

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
 * Set digest to hash algorithm `hash`.
 *
 * @param  {String} hash
 * @api public
 */
exports.digest = function(hash) {
  if (0 === arguments.length) return digest;
  if( -1 === crypto.getHashes().indexOf(hash)) throw new Error('invalid hash algorithm');
  digest = hash;
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
  // decide what to do based on argument length
  switch(arguments.length) {
    
    case 3: // all three args passed, this is obviously a callback run
      if (!pwd) return fn(new Error('password missing'));
      if (!salt) return fn(new Error('salt missing'));
      generateHash(pwd, salt).then(function(result) { fn(null, result.hash) }).catch(fn)
      break;
    
    case 2: // two args passed. decide what to do based on the type passed for salt
      if (isString(salt)) { // salt was a string and no callback passed, so caller expects a promise
        return generateHash(pwd, salt)
      } else { // salt is not a string, so assume it's a function.
        fn = salt;
        if (!pwd) return fn(new Error('password missing'));
        generateHash(pwd).then(function(result) { fn(null, result.salt, result.hash) }).catch(fn)
        break;
      }

    case 1: // just the password was passed, so caller expects a promise
      return generateHash(pwd)

    default: // nothing was passed, complain
      throw new Error('No password provided') 
  }

  return function(done){
    fn = done;
  }
};

function isString(s) {
  return typeof s === 'string'
}

// generate a hash from the given password and salt, returning a promise for its generation.
// variables 'iterations', 'len', and 'digest' are file scoped.
// if 'salt' is not passed, it will be automatically generated.
function generateHash(pwd, salt) {
  return Promise.resolve()
  .then(function() { return salt ? salt : generateSalt() })
  .then(function(salt) {
    return new Promise(function(resolve, reject) {
      crypto.pbkdf2(pwd, salt, iterations, len, digest, function(err, hash){
        if (err) { return reject(err); }
        resolve({ salt, hash: hash.toString('base64') })
      });
    })
  })
}

// generate a random salt, returning a promise for its generation.
// uses the file scoped 'len' variable.
function generateSalt() {
  return new Promise(function(resolve, reject) {
    crypto.randomBytes(len, function(err, salt) {
      if (err) { return reject(err); }
      resolve(salt.toString('base64'))
    })
  })
}