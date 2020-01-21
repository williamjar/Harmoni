import React from 'react';
import {Button, Card, Col, Form, Row, Table, Image, Accordion, FormControl, Spinner, Modal} from 'react-bootstrap'
import {OrganizerStore} from "../../store/organizerStore";
import {CookieStore} from "../../store/cookieStore";
import {PictureService} from "../../store/pictureService";
import {MegaValidator} from "../../megaValidator";
import {LoginService} from "../../store/loginService";

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
            mode: 1
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
                        <Col>
                            <Card className={"p-2 card border-0"}>
                                <Image width={"140px"} roundedCircle fluid thumbnail p-5 src={this.state.profilePicture} />

                                <Form onSubmit={this.handleSubmit}>

                                    <Form.Group>
                                        <FormControl name="newProfilePicture" type="file"
                                                     onChange={this.handleInputChange}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Button hidden={this.state.savingInformation}  variant="secondary" type="submit">Last opp profilbilde</Button>
                                        <Button hidden={!this.state.savingInformation} disabled variant="secondary" type="submit"><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>Laster opp profilbilde</Button>
                                    </Form.Group>
                                </Form>
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


    updateInfo() {
        OrganizerStore.getOrganizer(CookieStore.currentUserID, statusCode => {
            if (statusCode === 200) {
                console.log("User is here:" + OrganizerStore.currentOrganizer.username);

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

                console.log(databaseImage);
                console.log(image);

                this.setState(this.setState({
                    username: databaseUsername,
                    email: dataBaseEmail,
                    phonenumber: databasePhone,
                    profilePicture: databaseImage
                }));
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

        if (MegaValidator.validateFile(this.state.newProfilePicture)) {
            console.log("Image validated");
            let formData = new FormData();
            formData.append('description', this.state.newProfilePicture.name);
            formData.append('selectedFile', this.state.newProfilePicture);
            PictureService.insertPicture(OrganizerStore.currentOrganizer.organizerID, formData, (statusCode, link) => {
                console.log("Image uploaded with status " + statusCode);
                this.setState({savingInformation: false});
                if (statusCode === 200 && link) {
                    const totalPath = __dirname + '../../../../server/' + link;
                    this.state.profilePicture = totalPath;
                }
            });
        } else {
            console.log("Image not validated");
            this.setState({savingInformation: false});
        }
        // code for submitting profile picture here, you can access it with this.state.new.profilePicture
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

    constructor(props){
        super(props);
        this.state = {
            password : '',
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
                            <Form.Check name="confirmDeleteUser" value={this.state.confirmDeleteUser}  onChange={this.handleInputChange} type="checkbox" id="custom-switch" label="Bekreft at du ønsker å slette denne brukerprofilen (ikke reverserbart)"/>
                            </Form.Group>
                            <Form.Group>
                                <Button type="submit" variant="danger" disabled={!this.state.confirmDeleteUser}>Slett brukerprofil</Button>
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
        console.log(this.state.confirmDeleteUser);
        this.setState({[name]: value,});

    }

    submitForm(){
        if(this.checkPassword()){

            alert("Brukeren er slettet");
        }  else {
            alert("feil passord");
        }
    }


    checkPassword(){
        LoginService.loginOrganizer(OrganizerStore.currentOrganizer.email, this.state.password, status => {

            if (status===200) {
                OrganizerStore.deleteCurrentOrganizer();

            } else {
                this.setState({errorDeleting: true});
                return false;
            }

        });
    }

}

