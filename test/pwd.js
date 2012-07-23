
var pass = require('..');

describe('.hash(pass, fn)', function(){
  it('should generate a salt and hash', function(done){
    pass.hash('foobar', function(err, salt, hash){
      if (err) return done(err);
      salt.should.be.a('string');
      hash.should.be.a('string');
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

describe('.length(n)', function(){
  it('should set length', function(){
    pass.length(256);
    pass.length().should.equal(256);
  })
})