import {
    app,
    documentationDao,
    pictureDao,
    documentDao,
    organizerDao,
    multer,
    path,
    fs,
    uuidv4,
    artistDao
} from "./server";




function deleteFile(path) {
    try {
        fs.unlink(path, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    } catch (e) {
        console.log("Error, could not delete file:" + e);
    }
}

function deleteAllFilesInFolder(path, callback) {
    fs.readdir(path, (err, files) => {
        if (err) console.log(err);
        for (const file of files) {
            fs.unlink(path + '/' + file, err => {
                if (err) console.log(err);
            });
        }
    });
    callback();
}

function ensureFolderExists(path, mask, callback) {
    if (typeof mask == 'function') {
        callback = mask;
        mask = 0o777;
    }
    fs.mkdir(path, mask, function (err) {
        if (err) {
            if (err.code === 'EEXIST') {
                callback(null);
            } else {
                callback(err);
            }
        } else {
            callback(err);
        }
    })
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const eventID = req.params.eventID;
        const documentCategoryID = req.params.documentCategoryID;

        ensureFolderExists("./resources", 0o744, err => {
            if (err){
                console.log("Could now create resource folder for user");
            }
            else{
                ensureFolderExists('./resources/' + eventID, 0o744, err => {
                    if (err) {
                        console.log("Could not create resource folder for event " + eventID);
                        console.log(err);
                    } else {
                        ensureFolderExists('./resources/' + eventID + '/' + documentCategoryID, 0o744, err => {
                            if (err) {
                                console.log("Could not create folder for event " + eventID + " - category " + documentCategoryID);
                            } else {
                                console.log("Destination set for ./resources/" + eventID + "/" + documentCategoryID);
                                cb(null, './resources/' + eventID + '/' + documentCategoryID);
                            }
                        })
                    }
                });
            }
        });
    },

    filename: (req, file, cb) => {
        const newFilename = uuidv4(path.extname(file.originalname)) + "_" + file.originalname;
        console.log("Creating new file " + newFilename);
        cb(null, newFilename);
    }
});

const pictureStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        ensureFolderExists('./resources/', 0o744, err => {
            if (err) {
                console.log("Could not create folder for resources");
            } else {
                ensureFolderExists('./resources/profilePictures', 0o744, err => {
                    if (err) {
                        console.log("Could not create folder for profile pictures");
                    } else {
                        console.log("Destination set for ./resources/profilePictures");
                        cb(null, './resources/profilePictures');
                    }
                });
            }
        });
    },
    filename: (req, file, cb) => {
        const newFilename = uuidv4(path.extname(file.originalname)) + "_" + file.originalname;
        console.log("Creating new file " + newFilename);
        cb(null, newFilename);
    }
});


//init upload
const uploadUserPicture = multer({
    storage: pictureStorage,
    limits: {fileSize: 5000000000},
    fileFilter: (req, file, cb) => {
        console.log("Checking file filter");
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
            cb(null, true);
        } else {
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
        }
    }
});

const fileUpload = multer({storage: fileStorage});

// PICTURE


//Save picture to server
app.post("/api/file/picture", uploadUserPicture.single('selectedFile'), (req, res) => {
    try {
        res.send({name: req.file.filename, path: req.file.path});
    } catch (err) {
        res.send(400);
    }
});

app.post("/api/organizer/picture", (request, response) => {
    console.log("Request to add a picture");
    pictureDao.insertPicture(request.body.path, (status, data) => {
        response.status(status);
        response.json(data);
    });
});

//Delete picture
app.delete("/api/organizer/picture/delete/:pictureID", (request, response) => {
    console.log("Request to delete a picture");
    pictureDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.pictureID);
});

//Update picture
app.put("/api/organizer/picture/update/:pictureID", (request, response) => {
    console.log("Request to update a picture");
    pictureDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.body.pictureLink, request.params.pictureID);
});

//Update the picture on the organizer
app.put("/api/organizer/picture/:organizerID", (request, response) => {
    console.log("Request to update a picture for an organizer");
    organizerDao.changePicture(request.body.pictureID, request.params.organizerID, (status, data) => {
        response.status(status);
        response.json(data);
    });
});

//Get one picture
app.get("/api/organizer/picture/:pictureID", (require, response) => {
    console.log("Request to get the picture of an organizer");
    pictureDao.getPicture((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.pictureID);
});

//Upload document
app.post("/api/file/document/:eventID/:documentCategoryID", fileUpload.single('selectedFile'), (req, res) => {
    console.log("Request to create document");
    console.log(req.file);
    res.send({name: req.file.filename, path: req.file.path});
});


app.get("/api/:eventID/documents/category", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getAllDocumentCategories((status, data) => {
        res.status(status);
        res.json(data);
    });
});


app.get("/api/:eventID/documents", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getAllDocuments(req.params.eventID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/api/:eventID/documents/:documentID", (req, res) => {
    documentationDao.getOneDocument(req.params.eventID, req.params.documentID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});


app.delete("/api/:eventID/documents/:documentCategory/:fileName", (req, res) => {
    documentationDao.deleteDocument(req.params.eventID, req.params.documentID, (status, data) => {
        res.status(status);
        res.json(data);
        //Server stops if file dont exists
        deleteFile(resource_path + req.params.eventID + "/" + req.params.documentCategory + "/" + req.params.fileName)
    });
});

app.get("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    documentationDao.getDocumentsByCategory(req.params.eventID, req.params.documentCategoryID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    documentationDao.getDocumentsByCategory(req.params.eventID, req.params.documentCategoryID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.put("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    documentationDao.changeDocumentCategory(req.params.eventID, req.params.documentCategoryID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/:eventID/documents/create", (req, res) => {
    documentationDao.insertDocument(req.params.eventID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/:eventID/documents/create/artist", (req, res) => {
    documentationDao.insertDocumentArtist(req.params.eventID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/:eventID/documents/create/crew", (req, res) => {
    documentationDao.insertDocumentCrew(req.params.eventID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});


app.get("/api/event/:eventID/documents/categories", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getAllDocumentCategoriesForEvent(req.params.eventID, (status, data) => {
        console.log(data);
        res.status(status);
        res.json(data);
    });
});

app.get("/api/document/info/artist/:documentID", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getArtistInfoConnectedToDocument(req.params.documentID, (status, data) => {
        console.log(data);
        res.status(status);
        res.json(data);
    });
});

app.get("/api/document/info/crew/:documentID", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getCrewInfoConnectedToDocument(req.params.documentID, (status, data) => {
        console.log(data);
        res.status(status);
        res.json(data);
    });
});

app.get("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getAllDocumentsByCategoryForEvent(req.params.eventID,req.params.documentCategoryID, (status, data) => {
        console.log(data);
        res.status(status);
        res.json(data);
    });
});

app.get("/document/preview/:path*", (req, res) => {
    console.log("PATH: " + req.params.path + req.params['0']);
    var file = fs.createReadStream("./" + req.params.path + req.params['0']);
    file.pipe(res);
});
/*
app.get("/document/preview", (req, res) => {
    console.log("TEST");
    var file = fs.createReadStream("./resources/Formelark2018.pdf");
    file.pipe(res);
});
 */

app.get("/api/document/download/:path*", (req, res) => {
    var file = req.params.path + req.params['0'];
    fs.readFile(file, function(err, data){
        //jpg/jpeg image
    if((/\.(jpeg)$/i).test(req.params.path + req.params['0']) || (/\.(jpg)$/i).test(req.params.path + req.params['0'])){
        res.contentType("image/jpeg");
    }
    //Png image
    else if((/\.(png)$/i).test(req.params.path + req.params['0'])){
        res.contentType("image/png");
    }

    //Postscript
    else if((/\.(ai)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/postscript");
    }

    //PDF
    else if((/\.(pdf)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/pdf");
    }
    //Microsoft Powerpoint
    else if((/\.(pptx)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/vnd.openxmlformats-officedocument.presentationml.presentation");
    }
    else if((/\.(ppt)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/vnd.ms-powerpoint");
    }
    //Microsoft Excel
    else if((/\.(xlsx)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    else if((/\.(xls)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/vnd.ms-excel");
    }
    //Microsoft Word
    else if((/\.(docx)$/i).test(req.params.path + req.params['0'])){
        console.log(".docx registered");
        res.contentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }

    else if((/\.(doc)$/i).test(req.params.path + req.params['0'])){
        console.log(".doc registered");
        res.contentType("application/msword");
    }
    //Compressed File
    else if((/\.(rar)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/x-rar-compressed");
    }

    else if((/\.(7z)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/x-7z-compressed");
    }

    else if((/\.(zip)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/zip");
    }
    //Plaint text file
    else if((/\.(txt)$/i).test(req.params.path + req.params['0'])){
        res.contentType("text/plain");
    }
    //Rich text format
    else if((/\.(rtf)$/i).test(req.params.path + req.params['0'])){
        res.contentType("application/rtf");
    }
    else if((/\.(rtx)$/i).test(req.params.path + req.params['0'])){
        res.contentType("text/richtext");
    }
    else {
        console.log("There are no MIME support to " + req.params.path + req.params['0']);
        res.contentType("");
    }
        res.send(data)
    })
});

app.get("/api/document/categories", (request, response) => {
    console.log("Request for all document categories");
    documentationDao.getAllDocumentCategories((status, data) => {
        response.status(status);
        response.json(data);
    });
});

// TODO Her er det sikkert noe duplikat
//DOCUMENT

app.post("/api/document", (request, response) => {
    console.log("Express: Request to add a document");
    documentationDao.insertDocument(request.body.eventID,
        request.body.documentName,
        request.body.documentLink,
        request.body.artistID,
        request.body.crewID,
        request.body.documentCategoryID,
        (status, data) => {
            response.status(status);
            response.json(data);
        });
});

app.put("/api/document/:documentID", (request, response) => {
    console.log("Express: Request to change document " + request.params.documentID);
    let val = [
        request.body.eventID,
        request.body.documentName,
        request.body.documentLink,
        request.body.artistID,
        request.body.crewID,
        request.body.documentCategoryID
    ];
    documentDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val, request.params.documentID);
});

app.delete("/api/document/:documentID", (request, response) => {
    console.log("Express: Request to delete document " + request.params.documentID);
    documentDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.documentID);
});
