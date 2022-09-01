import {sanitize} from "./sanitize";

describe('sanitize plugin', function () {

  it('should exist', function () {

    expect(sanitize).not.toBeNull();
  });

  it('should pass through simple, well-formed markup', function () {
    expect(sanitize('<div><p>Hello <b>there</b></p></div>'))
      .toEqual('<div><p>Hello <b>there</b></p></div>');
  });

  it('should reject markup not allowlisted without destroying its text', function() {
    expect(sanitize('<div><wiggly>Hello</wiggly></div>')).toEqual('<div>Hello</div>');
  });
});