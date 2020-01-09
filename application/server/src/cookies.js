//TODO: Add content to server.js after merge

let express = require('express');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');

let app = express();
app.use(bodyParser.json());

let publicKey;
let privateKey = (publicKey = 'readFromConfigLater');

app.use(express.static(path.join(__dirname, '/../../client/public')));

//Talk to Joakim about this one
function loginOK(username){
    return username === 'admin';
}

//Handle login and send JWT-token back as JSON
app.post("/login", (req, res) => {
    if (loginOK(req.body.username, req.body.password)){
        console.log('Login OK');
        let token = jwt.sign({username: req.body.username}, privateKey, {expiresIn: 3600});
        res.json({jwt: token});
    }
    else{
        console.log('Login not OK');
        res.status(401);
        res.json({error: 'Not authorized'});
    }
});

app.use('/api', (req, res, next) => {
    let token = req.headers['x-access-token'];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err){
            console.log('Token not OK');
            res.status(401);
            res.json({error: 'Not authorized'});
        }
        else{
            console.log('Token OK: ' + decoded.username);
            next();
        }
    })
});