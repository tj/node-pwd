
var pass = require('..');

describe('.hash(pass, fn)', function(){
  it('should generate a salt and hash', function(done){
    pass.hash('foobar', function(err, salt, hash){
      if (err) return done(err);
      salt.should.be.a.String;
      hash.should.be.a.String;
      done();
    })
  })

  describe('when pass is missing', function(){
    it('should pass an error', function(done){
      pass.hash(null, function(err, salt, hash){
        err.message.should.include('password missing');
        done();
      })
    })
  })
})

describe('.hash(pass, salt, fn)', function(){
  it('should generate a hash', function(done){
    pass.hash('foobar', function(err, salt, hash){
      pass.hash('foobar', salt, function(err, cpm){
        cpm.should.equal(hash);
        done();
      })
    })
  })

  describe('when pass is missing', function(){
    it('should pass an error', function(done){
      pass.hash(null, 'asdf', function(err, salt, hash){
        err.message.should.include('password missing');
        done();
      })
    })
  })

  describe('when salt is missing', function(){
    it('should pass an error', function(done){
      pass.hash('asdf', null, function(err, salt, hash){
        err.message.should.include('salt missing');
        done();
      })
    })
  })
})

describe('.iterations(n)', function(){
  it('should set iterations', function(){
    pass.iterations(10);
    pass.iterations().should.equal(10);
  })

  it('should still work', function(done){
    pass.hash('foobar', function(err, salt, hash){
      pass.hash('foobar', salt, function(err, cpm){
        cpm.should.equal(hash);
        done();
      })
    })
  })
})

describe('.digest(hash)', function(){
  it('should set hash algorithm', function(){
    pass.digest('sha256');
    pass.digest().should.equal('sha256');
  })

  it('should still work', function(done){
    pass.hash('foobar', function(err, salt, hash){
      pass.hash('foobar', salt, function(err, cpm){
        cpm.should.equal(hash);
        done();
      })
    })
  })
  describe('when set invalid hash algorithm', function(){
    it('should throw an error', function(){
      try {
        pass.digest('Donald Trump');
      } catch(e) {
        e.message.should.include('invalid hash algorithm');
      }
    })
  })
})

describe('.length(n)', function(){
  it('should set length', function(){
    pass.length(256);
    pass.length().should.equal(256);
  })
})

// the promise section had to be done a little oddly...
// due to the way that should is required into the test (instead of with require('should'))
// it doesn't seem to be patching the Promise object, 
// so we can't use `(promise function).should.be.rejected()` for example.
describe('Promise', function() {
  
  it('should support promises', function() {
    var finished = false;
    return pass.hash('foobar')
    .then(function() {
      finished = true;
    })
    .then(function() {
      finished.should.equal(true);
    })
  })

  it('should reject promises when the hash is not successful', function() {
    var failed = false;
    return new Promise(function(resolve, reject) { // this promise is for the overall test completion
      return pass.hash(null, 'asdf') // this throws an error
      .catch(function(err) { // we catch the error here
        failed = true // we mark that we caught an error,
        resolve() // then we resolve the test promise so we can move on to the next test
      })
    })
    .then(function() {
      failed.should.equal(true) // ensure that we did catch an error inside.
    })
  })

  it('should return an object with the keys "hash" and "salt" when run as a promise', function() {
    return pass.hash('foobar')
    .then(function(result) {
      result.should.have.keys('hash', 'salt')
    })
  })

  it('should support passing salt', function() {
    var finished = false;
    var salt = 'abcd';
    return pass.hash('foobar', salt)
    .then(function(result) {
      result.should.have.keys('hash', 'salt');
      result.salt.should.equal(salt);
      finished = true;
    })
    .then(function() {
      finished.should.equal(true);
    })
  })

})