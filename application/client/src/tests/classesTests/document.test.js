import {Document} from '../../classes/document';

test('Document constructor test', () => {
    expect(Document.getTestDocuments()[0].documentID).toBe(0);
    expect(Document.getTestDocuments()[0].documentLink).toBe('artistContract.pdf');
    expect(Document.getTestDocuments()[0].documentCategory).toBe('Contracts');
});