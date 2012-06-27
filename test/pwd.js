
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
})

describe('.iterations(n)', function(){
  it('should set iterations', function(){
    pass.iterations(1000);
    pass.iterations().should.equal(1000);
  })
})

describe('.length(n)', function(){
  it('should set length', function(){
    pass.length(256);
    pass.length().should.equal(256);
  })
})