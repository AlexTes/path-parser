'use strict';

var Path = require('../');
var should = require('should');

require('mocha');

describe('Path', function () {
    it('should throw an error when instanciated without parameter', function () {
        (function () {
            new Path()
        }).should.throw();
    });

    it('should match and build paths with url parameters', function () {
        var path = new Path('/users/profile/:id-:id2.html');
        // Successful match & partial match
        path.match('/users/profile/123-abc.html').should.eql({ id: '123', id2: 'abc' });
        path.partialMatch('/users/profile/123-abc.html?what').should.eql({ id: '123', id2: 'abc' });
        // Unsuccessful match
        path.match('/users/details/123-abc').should.be.false;
        path.match('/users/details/123-abc.html').should.be.false;
        path.match('/users/profile/123-abc.html?what').should.be.false;

        path.build({ id: '123', id2: 'abc' }).should.equal('/users/profile/123-abc.html')
    });

    it('should match build paths with url and query parameters', function () {
        var path = new Path('/users/profile/:id-:id2?:id3');
        // Successful match & partial match
        path.match('/users/profile/123-456?id3=789').should.eql({ id: '123', id2: '456', id3: '789' });
        path.partialMatch('/users/profile/123-456').should.eql({ id: '123', id2: '456' });
        // Unsuccessful match
        path.match('/users/details/123-456').should.be.false;
        path.match('/users/profile/123-456?id3=789&id4=000').should.be.false;

        path.build({ id: '123', id2: '456', id3: '789' }).should.equal('/users/profile/123-456?id3=789')
    });

    it('should match build paths with splat parameters', function () {
        var path = new Path('/users/*splat/:id');

        path.match('/users/profile/view/123').should.eql({ splat: 'profile/view', id: '123' });
    });
});
