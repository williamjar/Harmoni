import {Bug} from "../../classes/bug";

test('Bug constructor', () => {
    expect(Bug.getTestBugs()[0].bugID).toBe(0);
    expect(Bug.getTestBugs()[0].bugDate).toBe('20200108');
    expect(Bug.getTestBugs()[0].description).toBe('Stuff gone \'rong');
});