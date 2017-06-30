import requestParser from '../../src/util/request-parser';
import path from 'path';
import httpRequest from '../mocks/httpRequestMock';
import httpResponse from '../mocks/httpResponseMock';
const expect = require('chai').expect;

describe("Request Parser", function () {
  it("GET: Parses requests correctly", function () {
    let request = httpRequest;
    request.url = "/apnpm";
    requestParser(request, null, function () {
    });
    expect(request.body._packageName, "apnpm");
  });

  it("GET: Parses scoped requests correctly", function () {
    let request = httpRequest;
    request.url = "/@apnpm/apnpm";
    requestParser(request, null, function () {
    });
    expect(request.body._packageName, "apnpm");
    expect(request.body._scope, "@apnpm");


    // let putUrl = "/apnpm";
    // let putScopeUrl = "/@apnpm/apnpm";
    //
    // let getUrl = "/apnpm";
    // let getPackageUrl = "/apnpm/apnpm-1.0.0.tgz";
    //
    // let getScopeUrl = "/@apnpm/apnpm";
    // let getPackageScopeUrl = "/@apnpm/apnpm/-/@apnpm/apnpm-1.0.0.tgz";

  });

  it("GET: Parses pkg download requests correctly", function () {
    let request = httpRequest;
    request.url = "/apnpm/apnpm-1.0.0.tgz";
    requestParser(request, null, function () {
    });

    expect(request.body._packageName, "apnpm");
    expect(request.body._scope, null);
    expect(request.body._scopedName, "apnpm");
    expect(request.body._requestedFile, "apnpm-1.0.0.tgz");
  });

  it("GET: Parses scoped pkg download requests correctly", function () {
    let request = httpRequest;
    request.url = "/@apnpm/apnpm/-/@apnpm/apnpm-1.0.0.tgz";
    requestParser(request, null, function () {
    });

    expect(request.body._packageName, "apnpm");
    expect(request.body._scope, "@apnpm");
    expect(request.body._scopedName, "@apnpm/apnpm");
    expect(request.body._requestedFile, "apnpm-1.0.0.tgz");
  });

  it("PUT: Parses requests correctly", function () {
    let request = httpRequest;
    request.url = "/apnpm";
    expect(request.body._packageName, "apnpm");
  });

  it("PUT: Parses scoped requests correctly", function () {
    let request = httpRequest;
    request.url = "/@apnpm/apnpm";
    expect(request.body._packageName, "apnpm");
    expect(request.body._scope, "@apnpm");
  })
});