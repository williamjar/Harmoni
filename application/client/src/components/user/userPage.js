import React from 'react';
import {Button, Card, Col, Form, Row, Table, Accordion, Spinner, Modal} from 'react-bootstrap'
import {OrganizerStore} from "../../store/organizerStore";
import {CookieStore} from "../../store/cookieStore";
import {PictureService} from "../../store/pictureService";
import {MegaValidator} from "../../megaValidator";
import {createHashHistory} from "history";
import {Alert} from "../alerts";
import {hashService} from "../../store/hashService";

let history = createHashHistory();

/**
 * @class UserPage
 * @classdesc Component for editing a user profile, profile picture and deleting user.
 */
export class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            newUsername: '',
            email: '',
            oldPassword: '',
            firstNewPassword: '',
            secondNewPassword: '',
            phonenumber: '',
            newPhonenumber: '',
            profilePicture: '',
            newProfilePicture: '',
            savingInformation: false,
            showPasswordAlert: false,
            mode: 1,
            link: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.updateInfo();
    }

    render() {
        return (
            <Card className={"border-0"}>
                <Modal show={this.state.showPasswordAlert}>
                    <Modal.Header closeButton>
                        <Modal.Title>Passordet er endret</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Passordet ditt er endret. Du kan nå logge på med ditt nye passord.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.hideModal()}>
                            Lukk
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="justify-content-md-center m-5">

                    <Row>
                        <Col xs={12} md={6}>
                            <Card className={"p-2 card border-0"}>
                                <Card.Title>Brukerprofil</Card.Title>
                                <Table borderless>
                                    <tbody>
                                    <tr>
                                        <td>E-postaddresse</td>
                                        <td>{this.state.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Brukernavn</td>
                                        <td>{this.state.username}</td>
                                    </tr>
                                    <tr>
                                        <td>Telefonnummer</td>
                                        <td>{this.state.phonenumber}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Card>
                            <ProfilePictureForm changeProfilePicture={this.props.changeProfilePicture}/>
                        </Col>
                        <Col>
                            <Card className={"p-2 card border-0"}>
                                <Card.Title>Innstillinger</Card.Title>
                                <Accordion>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    Rediger brukernavn
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <Form.Group>
                                                        <Form.Control type="text" name="newUsername"
                                                                      placeholder={this.state.username}
                                                                      value={this.state.newUsername}
                                                                      onChange={this.handleInputChange}/>
                                                        <Form.Text className={"text-danger"}
                                                                   hidden={!(this.state.newUsername.toLowerCase() === "geir")}>Geir
                                                            er ikke et gydlig brukernavn</Form.Text>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <SubmitButton loading={this.state.savingInformation}
                                                                      stop={!MegaValidator.validateUsername(this.state.username, this.state.newUsername)}/>
                                                    </Form.Group>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Form>

                                    <Form onSubmit={this.handleSubmit}>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                    Oppdater telefonnummer
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                                <Card.Body>
                                                    <Form.Group>
                                                        <Form.Control maxLength="8" type="tel" name="newPhonenumber"
                                                                      placeholder={this.state.phonenumber}
                                                                      value={this.state.newPhonenumber}
                                                                      onChange={this.handleInputChange}/>
                                                        <Form.Text className={"text-danger"}
                                                                   hidden={MegaValidator.validatePhoneNumberLength(this.state.phonenumber)}>Telefonnummeret
                                                            må være 8 siffer</Form.Text>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <SubmitButton loading={this.state.savingInformation}
                                                                      stop={!MegaValidator.validatePhoneNumber(this.state.phonenumber, this.state.newPhonenumber)}/>
                                                    </Form.Group>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Form>

                                    <Form onSubmit={this.handleSubmit}>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                                    Endre passord
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="2">
                                                <Card.Body>
                                                    <Form.Group>
                                                        <Form.Control type="password" name="oldPassword"
                                                                      placeholder="Gammelt passord"
                                                                      value={this.state.oldPassword}
                                                                      onChange={this.handleInputChange}/>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Control type="password" name="firstNewPassword"
                                                                      placeholder="Nytt passord"
                                                                      value={this.state.firstNewPassword}
                                                                      onChange={this.handleInputChange}/>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Control type="password" name="secondNewPassword"
                                                                      placeholder="Gjenta nytt passord"
                                                                      value={this.state.secondNewPassword}
                                                                      onChange={this.handleInputChange}/>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <SubmitButton loading={this.state.savingInformation}
                                                                      stop={!MegaValidator.validatePassword(this.state.password, this.state.firstNewPassword, this.state.secondNewPassword)}/>
                                                    </Form.Group>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Form>
                                    <DeleteUserForm/>
                                </Accordion>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>
        )
    }

    handleInputChange(event) {
        this.setState({savingInformation: false});
        const target = event.target;
        if (target.name === 'newProfilePicture') {
            this.setState({newProfilePicture: target.files[0]});
            this.setState({profilePictureUploaded: true});
        } else {
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            this.setState({[name]: value,});
        }

    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }


    hideModal() {
        this.setState({showPasswordAlert: false});
    }


    updateInfo(callback) {
        OrganizerStore.getOrganizer(CookieStore.currentUserID, statusCode => {
            if (statusCode === 200) {

                let databaseUsername = OrganizerStore.currentOrganizer.username;
                let dataBaseEmail = OrganizerStore.currentOrganizer.email;
                let databasePhone = OrganizerStore.currentOrganizer.phone;
                let databaseImage = OrganizerStore.currentOrganizer.pictureLink;

                let image = null;
                if (databaseImage == null) {
                    image = 'http://www.jacqueslacoupe.com/images/sample-user.png'
                } else {
                    image = databaseImage;
                }

                this.setState(this.setState({
                    username: databaseUsername,
                    email: dataBaseEmail,
                    phonenumber: databasePhone,
                    profilePicture: databaseImage
                }));
                callback(databaseImage);
            } else {
                //console.log("We have an error!");
            }
        });
    }

    submitForm() {
        this.setState({savingInformation: true});

        if (MegaValidator.validateUsername(this.state.username, this.state.newUsername)) {
            OrganizerStore.changeUsername(CookieStore.currentUserID, this.state.newUsername).then(r => {
                this.setState({savingInformation: false});
                this.setState({username: this.state.newUsername});
            });
        }


        if (MegaValidator.validatePhoneNumber(this.state.phonenumber, this.state.newPhonenumber)) {
            OrganizerStore.changePhoneNumber(this.state.newPhonenumber).then(r => {
                this.setState({savingInformation: false});
                this.setState({phonenumber: this.state.newPhonenumber});
            });
        }


        if (MegaValidator.validatePassword(this.state.password, this.state.firstNewPassword, this.state.secondNewPassword)) {
            OrganizerStore.changePassword(CookieStore.currentUserID, this.state.oldPassword, this.state.firstNewPassword, status => {
                this.setState({savingInformation: false});
                this.setState({
                    oldPassword: '',
                    firstNewPassword: '',
                    secondNewPassword: ''
                });
                this.setState({showPasswordAlert: true});
            });
        }
    }
}

export class SubmitButton extends React.Component {
    render() {
        if (this.props.loading) {
            return (<Button type="submit" variant="success" disabled>
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                /> Lagrer</Button>)
        } else {
            return (<Button type="submit" variant="success" disabled={this.props.stop}>Lagre</Button>)
        }
    }

}

export class DeleteUserForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            savingInformation: false,
            confirmDeleteUser: false,
            errorDeleting: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} className="text-danger" variant="link" eventKey="3">
                            Slett brukerprofil (GDPR)
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="3">
                        <Card.Body>
                            <Form.Group>
                                <Form.Control type="password" name="password"
                                              placeholder="Bekfreft med passord"
                                              value={this.state.password}
                                              onChange={this.handleInputChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Check name="confirmDeleteUser" value={this.state.confirmDeleteUser}
                                            onChange={this.handleInputChange} type="checkbox" id="custom-switch"
                                            label="Bekreft at du ønsker å slette denne brukerprofilen (ikke reverserbart)"/>
                            </Form.Group>
                            <Form.Group>
                                <Button type="submit" variant="danger" disabled={!this.state.confirmDeleteUser}>Slett
                                    brukerprofil</Button>
                            </Form.Group>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Form>
        )
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }

    handleInputChange(event) {
        this.setState({savingInformation: false});
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value,});

    }

    submitForm() {
        if (this.checkPasswordAndDeleteCurrentUser()) {

        } else {
        }
    }

    checkPasswordAndDeleteCurrentUser() {

        hashService.verifyPassword(OrganizerStore.currentOrganizer.organizerID, this.state.password, res => {
            if (res) {
                OrganizerStore.deleteCurrentOrganizer();
                sessionStorage.setItem('token', null);
                sessionStorage.setItem('currentEvent', null);
                sessionStorage.removeItem('loggedIn');
                CookieStore.setCurrentToken(null);
                CookieStore.setCurrentUserID(-1);
                history.push("/");
                window.location.reload();
            } else {
                this.setState({errorDeleting: true});
                return false;
            }
        });
    }
}

export class ProfilePictureForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            savingInformation: false,
            profilePicture: '',
            link: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);

    }


    componentDidMount() {
        this.updateInfoPicture((profilePicture) => {
            if(profilePicture !== null){
                PictureService.previewPicture(profilePicture, (url) => {
                    this.setState({link: url});
                });
            }
        })
    }

    updateInfoPicture(callback) {
        OrganizerStore.getOrganizer(CookieStore.currentUserID, statusCode => {
            if (statusCode === 200) {
                let databaseImage = OrganizerStore.currentOrganizer.pictureLink;
                callback(databaseImage);
            } else {
            }
        });
    }


    checkIfUserHasPicture(){
        if(this.state.link !== ''){
            return(<img width={"200px"} src = {this.state.link} alt={"Bildet kunne ikke lastes inn"}/>);
        }else {
            return(<img width={"200px"} src={require('./profile.png')} alt={"Standard bildet kunne ikke lastes inn"}/>);
        }
    }


    render() {
        return (
                <Card className={"border-0"}>
                    <Form>
                        {this.checkIfUserHasPicture()}
                        <Form.Group>

                            <div className="padding-top-30">
                                <span className="btn btn-secondary btn-file"> Legg til bilde
                                <input type="file" name="newProfilePicture" onChange={this.handleInputChange} className="btn btn-secondary btn-file" />
                                </span>
                                <Button onClick = {this.upload} hidden={this.state.savingInformation} variant="success" type="submit" className="margin-left-10">Last opp profilbilde</Button>
                            </div>
                        </Form.Group>
                        <Form.Group>
                        </Form.Group>
                    </Form>
                    <section id = {"error"} className={"text-info col padding-top-10"}/>
                </Card>
        )
    }

    upload = (event) => {
        event.preventDefault();
        this.submitForm(() => {
            this.updateInfoPicture((profilePicture) => {
                if(profilePicture !== null && profilePicture !== ''){
                    PictureService.previewPicture(profilePicture, (url) => {
                        this.setState({link: url});
                        this.props.changeProfilePicture(profilePicture);
                    });
                }
            })
        });
    };


    handleInputChange(event) {

        this.setState({savingInformation: false});

        if(event.target.name === "newProfilePicture"){
            this.setState({newProfilePicture: event.target.files[0]});
        } else {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            this.setState({[name]: value,});
        }
    }

    submitForm(callback) {
        if (MegaValidator.validateFile(this.state.newProfilePicture)) {
            let formData = new FormData();
            formData.append('description', this.state.newProfilePicture.name);
            formData.append('selectedFile', this.state.newProfilePicture);
            PictureService.insertProfilePicture(OrganizerStore.currentOrganizer.organizerID, formData, (statusCode, link) => {
                this.setState({savingInformation: false});
                if (statusCode === 200 && link) {
                    const totalPath = __dirname + '../../../../server/' + link;
                    this.setState({profilePicture: totalPath});
                }
                document.getElementById("error").innerHTML = "";
                callback()
            });
        } else {
            this.setState({savingInformation: false});
            Alert.danger("Du har lastet opp en tom eller ugyldig filtype");
            document.getElementById("error").innerHTML = "Godkjente filtyper .png .jpg .jpeg";
        }
    }
}


