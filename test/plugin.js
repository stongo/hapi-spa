// Load modules

var Lab = require('lab');
var Hapi = require('hapi');


// Declare internals

var internals = {};


// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;


describe('hapi-spa', function () {

    var table;

    it('can be added as a plugin to hapi', function (done) {

        var server = new Hapi.Server({ files: { relativeTo: process.cwd() } });
        server.pack.require('../', { folder: 'test/spa/'}, function (err) {

            expect(err).to.not.exist;
            table = server.table();
            done();
        });
    });

    it('should have a route handler', function (done) {

        var server = new Hapi.Server({ files: { relativeTo: process.cwd() } });
        server.pack.require('../', { path: '/spa' }, function (err) {

        expect(err).to.not.exist;
        table = server.table();
        table.filter(function (route) {
            expect(route.settings.handler).to.be.an('function');
        });

        done();
        });
    });

    it('can use plugin options', function (done) {

        var server = new Hapi.Server({ files: { relativeTo: process.cwd() } });
        server.pack.require('../', { path: '/test', index: 'index.htm', folder: 'test/spa/', hash: '#' }, function (err) {

        expect(err).to.not.exist;
        table = server.table();
        var found = table.filter(function (route) {
            return (route.method === 'get' && route.path === '/test/{file*}' && route.params[0] === 'file');
        });
        expect(found).to.have.length(1);

        done();
        });
    });

    it('returns an index file', function(done) {

        var server = new Hapi.Server({ files: { relativeTo: process.cwd() } });
        server.pack.require('../', { folder: 'test/spa/' }, function (err) {

            expect(err).to.not.exist;
            server.inject('/index.html', function(res) {
                expect(res.statusCode).to.equal(200);
                done();
            });

        });
    });

    it('returns a static asset', function(done) {

        var server = new Hapi.Server({ files: { relativeTo: process.cwd() } });
        server.pack.require('../', { folder: 'test/spa/' }, function (err) {

            expect(err).to.not.exist;
            server.inject('/assets/test.txt', function(res) {
                expect(res.statusCode).to.equal(200);
                done();
            });

        });
    });

    it('returns a 404 if index file not found', function(done) {

        var server = new Hapi.Server({ files: { relativeTo: process.cwd() } });
        server.pack.require('../', { folder: 'test/' }, function (err) {

            expect(err).to.not.exist;
            server.inject('/index.html', function(res) {
                expect(res.statusCode).to.equal(404);
                done();
            });

        });
    });

    it('tries an index file before returning 404', function(done) {

        var server = new Hapi.Server({ files: { relativeTo: process.cwd() } });
        server.pack.require('../', { folder: 'test/spa/' }, function (err) {

            expect(err).to.not.exist;
            server.inject('/spa/path', function(res) {
                expect(res.statusCode).to.equal(302);
                done();
            });

        });
    });

});