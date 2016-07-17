
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

describe('Promise', function() {
  
  it('should support promises', function() {
    pass.hash('foobar').should.be.a.Promise();
  })

  it('should fulfill promises when hash is successful', function() {
    return pass.hash('foobar').should.be.fulfilled();
  })

  it('should reject promises when the hash is not successful', function() {
    return pass.hash(null, 'asdf').should.be.rejected();
  })

  it('should return an object with the keys "hash" and "salt" when run as a promise', function() {
    return pass.hash('foobar').then(function(result) {
      result.should.have.keys('hash', 'salt')
    })
  })

})