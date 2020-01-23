import {app, loginDao, organizerDao, SECRET, jwt} from "./server";
import {CookieStore} from "../../client/src/store/cookieStore";
import {EventStore} from "../../client/src/store/eventStore";

let privateKey = SECRET.privateKey;
let publicKey = SECRET.publicKey;

//Seconds
let TOKEN_LENGTH = 3600;

//Handle login and send JWT-token back as JSON
app.post("/login", (req, res) => {
    console.log("Logging in serverside...");
    loginDao.checkLogin(req.body.email, req.body.password, (status, data) => {
        console.log(status);
        console.log(data);
        if (status === 200 && data.length > 0) {
            console.log('Login OK');
            let token = jwt.sign(
                {
                    email: req.body.email,
                    exp: Math.floor(Date.now() / 1000) + (TOKEN_LENGTH)
                }, privateKey, {
                    algorithm: "RS512",
                });
            console.log("Token signed");
            jwt.verify(token, publicKey, (err, decoded) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(decoded);
                }
            });
            console.log("Token verified");
            res.status(status);
            res.json({jwt: token});
        } else {
            console.log('Login not OK');
            res.status(status);
            res.json({error: 'Not authorized'});
        }
    });
});

app.get("/organizer/username/:username", (req, res) => {
    loginDao.checkUserExists(req.params.username, (status, data) => {
        res.status(status);
        res.json(data);
    })
});

//Returns organizerID by email. Needed for login, thus not part of /api/
app.get("/organizer/by-email/:email", (req, res) => {
    organizerDao.getOrganizerFromEmail(req.params.email, (status, data) => {
        res.status(status);
        res.json(data);
    })
});

//Update the token on the server, and "returns" it in the res.json().jwt
app.post("/token", (req, res) => {
    let token = req.headers['x-access-token'];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            console.log("Token not OK / Expired / User no longer logged in");
            res.json({error: err});
        } else {
            console.log("Token accepted. Updating token clientside");
            let newToken = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + (TOKEN_LENGTH),
                    email: req.body.email
                }, privateKey, {
                    algorithm: "RS512",
                });
            res.json({jwt: newToken, for: decoded.email});
        }
    })
});

app.post("/api/artist/personalLink", (req, res) => {
    const artistID = req.body.artistID;
    const eventID = req.body.eventID;
    try{
        let token = jwt.sign(
            {
                artistID: artistID,
                eventID: eventID
            },
            privateKey,
            {
                algorithm: "RS512"
            });
        jwt.verify(token, publicKey);
        console.log("Here we go");
        console.log(token);
        res.send({jwt: token});
    }
    catch (e) {
        console.log(e);
        res.json({err: e});
    }
});

app.use('/api', (req, res, next) => {
    let token;
    if (req.headers["x-access-token"]) {
        token = req.headers["x-access-token"];
        try {
            jwt.verify(token, publicKey);
            let email = jwt.decode(token, publicKey).email;
            console.log('Token OK for: ' + email);
            let newToken = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + (TOKEN_LENGTH),
                    email: email
                }, privateKey, {
                    algorithm: "RS512",
                });
            jwt.verify(newToken, publicKey);
            CookieStore.setCurrentToken(newToken);
            next();
        } catch (e) {
            console.log('Token not OK');
            res.status(401);
            res.json({error: e});
        }
    } else {
        res.json({error: "No token given for /api"});
    }
});

app.get('/api/test', () => {
    console.log("Testing /api/test");
});