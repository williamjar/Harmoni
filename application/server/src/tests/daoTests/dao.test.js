import runSQLFile from "../../../../runsqlfile";
const mysql = require('mysql');
const databaseConfig = require("../../databaseConfig");
let assert = require('assert');
const mocha = require('mocha');

import ArtistDao from "../../dao/artistDao";
import BugDao from "../../dao/bugDao";
import ContactDao from "../../dao/contactDao";

const pool = mysql.createPool(databaseConfig.testConfig);

const artistDao = new ArtistDao(pool);
const bugDao = new BugDao(pool);
const contactDao = new ContactDao(pool);

mocha.before(done => {
    runSQLFile('../create.sql', pool, () => {
        runSQLFile('../testData.sql', pool, () => {
            done();
        });
    });
});

mocha.describe('Starting DAO test', () => {

    //ArtistDao
    mocha.describe('Artist', () => {
        mocha.describe('getAll()', () => {
            mocha.it('should return more than one artist', () => {
                artistDao.getAll((status, data) => {
                    assert.notEqual(data.length, 0);
                })
            })
        });

        mocha.describe('getAllForOrganizer()', () => {
            mocha.it('should return all for organizer', () => {
                artistDao.getAllForOrganizer((status,data) => {
                    assert.equal(data.length, 1)
                }, 1)
            });
        });

        mocha.describe('getAllForEvent()', () => {
            mocha.it('should return all for event', () => {
                artistDao.getAllForEvent((status, data) => {
                    assert.equal(data.length, 1);
                } , 1)
            })
        });

        mocha.describe('getOne()', () => {
            mocha.it('should return one artist', () => {
                artistDao.getOne((status, data) => {
                    assert.equal(data.length, 1);
                } , 1)
            })
        });

        mocha.describe('createOne()', () => {
            mocha.it('should create one artist', () => {
                let list = [2,2,2];
                artistDao.createOne((status, data) => {
                    assert.equal(data.insertId, 3);
                }, list);
            })
        });

        mocha.describe('updateOne()', () => {
            mocha.it('should update an exsisting artist', () => {
                let list = [2,2,2];
                artistDao.updateOne((status, data) => {
                    assert.equal(data.affectedRows, 1);
                }, list);
            })
        });
        //TODO make deleteOne work()
        /*
        mocha.describe('deleteOne()', () => {
            mocha.it('should delete an exsisting artist', () => {
                artistDao.deleteOne((status, data) => {
                    console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, 1);
            })
        });

         */

        mocha.describe('addDocument()', () => {
            mocha.it('should add a document to artist', () => {
                let list = [1, 'Dokument', 'link', 1, 1];
                artistDao.addDocument((status, data) => {
                    assert.equal(data.affectedRows, 1);
                }, list);
            })
        });

        mocha.describe('assignOne()', () => {
            mocha.it('should assign artist to event.', () => {
                let list = [1,2];
                artistDao.assignOne((status, data) => {
                    assert.equal(data.affectedRows, 1);
                }, list);
            })
        });
        mocha.describe('unAssignOne()', () => {
            mocha.it('should unassign an artist from event.', () => {
                let list = [1,1];
                artistDao.unAssignOne((status, data) => {
                    assert.equal(data.affectedRows, 1);
                }, list);
            })
        });

        mocha.describe('getAllGenres()', () => {
            mocha.it('should return all genres', () => {
                artistDao.getAllGenres((status, data) => {
                    assert.equal(data.length, 4);
                });
            })
        });
        mocha.describe('getArtistEventInfo()', () => {
            mocha.it('should return artist event info for one event.', () => {
                let list = [1,2];
                artistDao.getArtistEventInfo((status, data) => {
                    assert.equal(data.length, 1);
                }, list);
            })
        });

        mocha.describe('updateArtistEventInfo()', () => {
            mocha.it('should unassign an artist from event.', () => {
                let list = [2,2,1,2];
                artistDao.updateArtistEventInfo((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, list);
            })
        });
    });

    //BugDao
    mocha.describe('BugDao', () => {
        mocha.describe('getOneBug()', () => {
            mocha.it('should return one bug', () => {
                bugDao.getOneBug((status, data) => {
                    assert.equal(data.length, 1);
                }, 1)
            })
        });
        mocha.describe('getAllBugsFromOrganizer()', () => {
            mocha.it('should return all bugs from one organizer', () => {
                bugDao.getAllBugsFromOrganizer((status, data) => {
                    assert.equal(data.length, 2);
                }, 1)
            });
        });

        mocha.describe('registerBug()', () => {
            mocha.it('should register a new bug', () => {
                let list = ['Heihei', 1];
                bugDao.registerBug((status, data) => {
                    //console.log(data);
                    assert.equal(data.insertId, 3);
                }, list)
            });
        });

        mocha.describe('deleteBug()', () => {
            mocha.it('should delete one reported bug', () => {
                bugDao.deleteBug((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, 1)
            });
        });
    });

    //ContectDao
    mocha.describe('ContactDao', () => {
        mocha.describe('getOne()', () => {
            mocha.it('should return one contact', () => {
                contactDao.getOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 1);
                }, 1)
            })
        });
        mocha.describe('getOne()', () => {
            mocha.it('should return one contact', () => {
                contactDao.getOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 1);
                }, 1)
            })
        });
        mocha.describe('createOne()', () => {
            mocha.it('should create one contact', () => {
                let list = ['Jonas', 45678456, 'epost@me.com'];
                contactDao.createOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, list)
            })
        });

        mocha.describe('updateOne()', () => {
            mocha.it('should create one contact', () => {
                let list = ['Jonas', 45678456, 'epost@me.com', 2];
                contactDao.updateOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, list)
            })
        });

        mocha.describe('changePhoneNumber()', () => {
            mocha.it('should create one contact', () => {
                let list = ['33334455', 1, 1];
                contactDao.changePhoneNumber((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, list)
            })
        });
        //Todo fix deleteOne()
        /*
        mocha.describe('deleteOne()', () => {
            mocha.it('should create one contact', () => {
                contactDao.deleteOne((status, data) => {
                    console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, 1)
            })
        });

         */
    });

});







