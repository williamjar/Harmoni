import runSQLFile from "../../../../runsqlfile";
const mysql = require('mysql');
const databaseConfig = require("../../databaseConfig");
let assert = require('assert');
const mocha = require('mocha');

import ArtistDao from "../../dao/artistDao";
import BugDao from "../../dao/bugDao";
import ContactDao from "../../dao/contactDao";
import OrganizerDao from "../../dao/organizerDao";
import PicturDao from "../../dao/pictureDao";
import RiderDao from "../../dao/riderDao"
import TicketDao from   "../../dao/ticketDao";

const pool = mysql.createPool(databaseConfig.testConfig);

const artistDao = new ArtistDao(pool);
const bugDao = new BugDao(pool);
const contactDao = new ContactDao(pool);
const organizerDao = new OrganizerDao(pool)
const pictureDao = new PicturDao(pool);
const riderDao = new RiderDao(pool);
const ticketDao = new TicketDao(pool);

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
    //CrewDao
    //DocumentationDao
    //DocumentDao
    //EventDao
    //LoginDao


    //OrganizerDao
        mocha.describe('OrganizerDao', () => {
            mocha.describe('getOne()', () => {
                mocha.it('should return one organizer', () => {
                    organizerDao.getOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 1);
                },  1)
            })
        });
        mocha.describe('createOne()', () => {
            mocha.it('should create a new  organizer', () => {

                let list = ['Jonas', 'passord', 1, 1, "Jonas", 23457890, 'mail@me.com', 'link'
                ];
                organizerDao.createOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                },  list)
            })
        });

        mocha.describe('changePassword()', () => {
            mocha.it('should change an organizers password', () => {
                let list = ['passord', 1];
                organizerDao.changePassword((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                },  list)
            })
        });
        mocha.describe('getAllDouments()', () => {
            mocha.it('should return all documents', () => {;
                organizerDao.getAllDocuments((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 1);
                },  1)
            })
        });

        mocha.describe('getAllEvents()', () => {
            mocha.it('should return all of an organizers events', () => {
                organizerDao.getAllEvents((status, data) => {
                   //console.log(data);
                    assert.equal(data.length, 1);
                },  1)
            })
        });
        mocha.describe('changeusername()', () => {
            mocha.it('should change an organizers username', () => {
                let list = ['Username', 1];
                organizerDao.changeUsername(list, (status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                })
            })
        });
        mocha.describe('changePicture()', () => {
            mocha.it('should change an organizers profile picture', () => {
                organizerDao.changePicture(  1,1, (status, data) => {
                    console.log(data);
                    assert.equal(data.affectedRows, 1);
                })
            })
        });
        /*
        //Todo: fix getOrganizerFromEmail()
        mocha.describe('getOrganizerFromEmail()', () => {
            mocha.it('should return the   organizers email', () => {
                organizerDao.getOrganizerFromEmail(  'geir@lillelondon.no', (status, data) => {
                    console.log(data);
                    assert.equal(data.length, 'geir@lillelondon.no');
                })
            })
        });

         */
        });

    /*
        getOrganizerFromEmail
        changeOrganizerProfilePicture????
     */

    //PictureDao
    mocha.describe('PictureDao', () => {
        mocha.describe('updateOne()', () => {
            mocha.it('should update a picture', () => {
                pictureDao.updateOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, 'DetteErEnlink', 1)
            })
        });
        mocha.describe('insertPicture()', () => {
            mocha.it('should insert a picture', () => {
                pictureDao.insertPicture('Dette er en path', (status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, )
            })
        });
        mocha.describe('createOne()', () => {
            mocha.it('should create a picture', () => {
                pictureDao.createOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, 'Dette er et nytt bilde ')
            })
        });
        mocha.describe('deleteOne()', () => {
            mocha.it('should delete a picture', () => {
                pictureDao.deleteOne((status, data) => {
                   // console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, 2)
            })
        });


        mocha.describe('getPicture()', () => {
            mocha.it('should return a picture', () => {
                pictureDao.getPicture((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 1);
                }, 1)
            })
        });

    });


    //RiderDao
    mocha.describe('RiderDao', () => {
        mocha.describe('getOne()', () => {
            mocha.it('should return one rider', () => {
                riderDao.getOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 1);
                }, 2)
            })
        });

        mocha.describe('getAllRiderForArtist()', () => {
            mocha.it('should return all riders for artist', () => {
                riderDao.getAllRidersForArtist((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 2);
                }, 1)
            })
        });

        //Todo fix later
        /*
        mocha.describe('getAllRidersForArtistForEvent()', () => {
            mocha.it('should return full rider for an artist in one event', () => {
                ticketDao.getAllRidersForArtistForEvent((status, data) => {
                    console.log(data);
                    assert.equal(data.length, 1);
                }, 1, 1)
            })
        });

         */
        mocha.describe('getAllRiderForEvent()', () => {
            mocha.it('should return all riders for an event', () => {
                riderDao.getAllRidersForEvent((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 2);
                }, 1)
            })
        });

        mocha.describe('createOne()', () => {
            mocha.it('should create a new rider', () => {
                let list = [1,1,'Ny rider'];
                riderDao.createOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, list)
            })
        });

        mocha.describe('updateOne()', () => {
            mocha.it('should update an exsisting rider', () => {
                let list = ['status', 0, 'En klase bananer', 1,2,2];
                riderDao.updateOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, list)
            })
        });

        mocha.describe('deleteOne()', () => {
            mocha.it('should delete an exsisting rider', () => {
                riderDao.deleteOne((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, 1, 2,2)
            })
        });

    });

    //TicketDao
    mocha.describe('TicketDao', () => {
        mocha.describe('getOneTicket()', () => {
            mocha.it('should return one ticket', () => {
                ticketDao.getOneTicket((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 1);
                }, 1)
            })
        });
        mocha.describe('getAllTicketsForEvent()', () => {
            mocha.it('should return all tickets for an event', () => {
                ticketDao.getAllTicketsForEvent((status, data) => {
                    //console.log(data);
                    assert.equal(data.length, 1);
                }, 1)
            })
        });
        mocha.describe('getAllTicketsForEvent()', () => {
            mocha.it('should add one ticket', () => {

                let list = [
                    1,
                    "NyBillett",
                    1000, 100,
                    "2020-01-23",
                    "15:00",
                    1,
                    "2020-01-23",
                    "00:00",
                    "Jeg er en ny billett"
                ];

                ticketDao.addTicket((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, list)
            })
        });

        mocha.describe('updateTicket()', () => {
            mocha.it('should update a ticket', () => {
                let list = [
                    "NyBillett",
                    1000,
                    100,
                    "2020-01-23",
                    "15:00",
                    "2020-01-23",
                    "00:00",
                    "Jeg er en ny billett",
                    1
                ];
                ticketDao.updateTicket((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, list)
            })
        });

        mocha.describe('deleteTicket()', () => {
            mocha.it('should delete a ticket', () => {
                ticketDao.deleteTicket((status, data) => {
                    //console.log(data);
                    assert.equal(data.affectedRows, 1);
                }, 1, 1)
            })
        });

    });
});






