import {Document} from '../../classes/document';
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Document constructor', () => {
    mocha.it('Should have an id', () => {
        assert.equal(Document.getTestDocuments()[0].documentID, 0);
    });
    mocha.it('Should have a link', () => {
        assert.equal(Document.getTestDocuments()[0].documentLink, 'Link here');
    });
    mocha.it('Should have a category', () => {
        assert.notEqual(Document.getTestDocuments()[0].documentCategoryID, -1);
    });
});