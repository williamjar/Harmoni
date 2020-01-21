import {Document} from '../../classes/document';
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Document constructor', () => {
    mocha.it('Should have an id', () => {
        assert.equal(Document.getTestDocuments()[0].documentID, 0);
    });
    mocha.it('Should have a link', () => {
        assert.equal(Document.getTestDocuments()[0].documentLink, 'artistContract.pdf');
    });
    mocha.it('Should have a category', () => {
        assert.equal(Document.getTestDocuments()[0].documentCategory, 'Contracts');
    });
});