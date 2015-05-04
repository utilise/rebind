var expect = require('chai').expect
  , rebind = require('./')

describe('rebind', function() {

  it("source function always has source as context", function() {
    var target = {}, source = {method: function() { that = this }}, that
    rebind(target, source, "method")
    expect((target.method(), that)).to.be.eql(source)
    expect((target.method.call({}), that)).to.be.eql(source)
  })

  it("source function receives target function's arguments", function() {
    var target = {}, source = {method: function() { those = Array.prototype.slice.call(arguments) }}, those
    rebind(target, source, "method")
    expect((target.method(), those)).to.be.eql([])
    expect((target.method(1), those)).to.be.eql([1])
    expect((target.method(null), those)).to.be.eql([null])
    expect((target.method(source, source, 1), those)).to.be.eql([source, source, 1])
  })

  it("target function returns target if source function returns source", function() {
    var target = {}, source = {method: function(value) { return value ? source : 42 }}
    rebind(target, source, "method")
    expect(target.method(true)).to.be.eql(target)
    expect(target.method(false)).to.be.eql(42)
  })

  it("can bind multiple methods", function() {
    var target = {}, source = {
      foo: function() { return 1 }
    , bar: function() { return 2 }
    }
    rebind(target, source, "foo", "bar")
    expect(target.foo()).to.be.eql(1)
    expect(target.bar()).to.be.eql(2)
  })

  it("returns the target object", function() {
    var target = {}, source = { foo: String }
    expect(rebind(target, source, "foo")).to.be.eql(target)
  })

})