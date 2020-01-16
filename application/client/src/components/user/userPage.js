import React from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Row,
    Table,
    Image,
    Accordion,
    CardColumns,
    FormControl,
    ListGroup,
    CardDeck,
    Spinner,
    Modal
} from 'react-bootstrap'
import {CardText} from "react-bootstrap/Card";
import {OrganizerStore} from "../../store/organizerStore";
import {CookieStore} from "../../store/cookieStore";
import {StandardAlert} from "../widgets/alert";
import {PictureService} from "../../store/pictureService";

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
            phonenumber : '',
            newPhonenumber: '',
            profilePicture: 'http://www.jacqueslacoupe.com/images/sample-user.png',
            newProfilePicture: '',
            savingInformation: false,
            showPasswordAlert: false,
            mode: 1
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event){
        this.setState({savingInformation:false});
        const target = event.target;
        if (target.name === 'newProfilePicture'){
            this.setState({newProfilePicture: target.files[0]});
        }
        else{
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            this.setState({[name]: value,});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }

    componentDidMount() {
        this.updateInfo();
    }

    // Functions to verify the contents in the form.
    render() {
        return(
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
                                <Image width={"140px"} roundedCircle fluid thumbnail p-5 src={this.state.profilePicture} rounded />

                                <Form onSubmit={this.handleSubmit}>

                                    <Form.Group>
                                        <FormControl name="newProfilePicture" type="file" onChange={this.handleInputChange}/>
                                    </Form.Group>

                                    <Form.Group>
                                        <Button variant="secondary" type="submit">Last opp profilbilde</Button>
                                    </Form.Group>


                                </Form>
                                <Card.Title>Brukerprofil</Card.Title>
                                <Table borderless>
                                    <tbody>
                                    <tr><td>E-postaddresse</td><td>{this.state.email}</td></tr>
                                    <tr><td>Brukernavn</td><td>{this.state.username}</td></tr>
                                    <tr><td>Telefonnummer</td><td>{this.state.phonenumber}</td></tr>
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
                                                        <Form.Control type="text" name="newUsername" placeholder={this.state.username} value={this.state.newUsername} onChange={this.handleInputChange}/>
                                                        <Form.Text className={"text-danger"} hidden={!(this.state.newUsername.toLowerCase()==="geir")}>Geir er ikke et gydlig brukernavn</Form.Text>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <SubmitButton loading={this.state.savingInformation} stop={!this.validateUsername()}/>
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
                                                        <Form.Control maxLength="8" type="number"  name="newPhonenumber" placeholder={this.state.phonenumber} value={this.state.newPhonenumber} onChange={this.handleInputChange}/>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <SubmitButton loading={this.state.savingInformation} stop={!this.validatePhoneNumber()}/>
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
                                                        <Form.Control type="password" name="oldPassword" placeholder="Gammelt passord" value={this.state.oldPassword} onChange={this.handleInputChange}/>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Control type="password" name="firstNewPassword" placeholder="Nytt passord" value={this.state.firstNewPassword} onChange={this.handleInputChange}/>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Control type="password" name="secondNewPassword" placeholder="Gjenta nytt passord" value={this.state.secondNewPassword} onChange={this.handleInputChange}/>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <SubmitButton loading={this.state.savingInformation} stop={!this.validatePassword()}/>
                                                    </Form.Group>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Form>
                                </Accordion>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>
        )}



    validateUsername(){
        let  illegalCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(illegalCharacters.test(this.state.newUsername)){
            return false;
        }else{
            return (this.state.username !== this.state.newUsername) && (this.state.newUsername.length > 0) && !(this.state.newUsername.toLowerCase()==="geir");
        }
    }

    validatePhoneNumber(){
        return (this.state.newPhonenumber !== this.state.phonenumber) && (this.state.newPhonenumber.length === 8);
    }

    validatePassword(){
        return (this.state.firstNewPassword === this.state.secondNewPassword) && (this.state.firstNewPassword.length > 0) && (this.state.firstNewPassword  !== this.state.oldPassword);
    }

    hideModal(){
        this.setState({showPasswordAlert: false});
    }
    validateFile(){
        console.log(this.state.newProfilePicture);
        return (/\.(gif|jpeg|jpg|tiff|png)$/i).test(this.state.newProfilePicture.name);
    }

    updateInfo(){
       OrganizerStore.getOrganizer(CookieStore.currentUserID, statusCode => {
            if (statusCode === 200){
                console.log("User is here:" + OrganizerStore.currentOrganizer.username);

                var databaseUsername = OrganizerStore.currentOrganizer.username;
                var dataBbaseEmail = OrganizerStore.currentOrganizer.email;
                var databasePhone = OrganizerStore.currentOrganizer.phone;
                let databaseImage = OrganizerStore.currentOrganizer.pictureLink;

                let image = null;
                if (databaseImage == null){
                    image = 'http://www.jacqueslacoupe.com/images/sample-user.png'
                }
                else{
                    image = databaseImage;
                }

                console.log(databaseImage);
                console.log(image);

                this.setState(this.setState({
                    username: databaseUsername,
                    email: dataBbaseEmail,
                    phonenumber: databasePhone,
                    profilePicture: image
                }));
            }
            else{
                //console.log("We have an error!");
            }
        });
    }

    submitForm(){
        this.setState({savingInformation: true});
        if(this.validateUsername()) {
            OrganizerStore.changeUsername(CookieStore.currentUserID, this.state.newUsername).then(r => {
                this.setState({savingInformation: false});
                this.setState({username: this.state.newUsername});
            });}


        if(this.validatePhoneNumber()){
            OrganizerStore.changePhoneNumber(this.state.newPhonenumber).then(r =>{
                this.setState({savingInformation: false});
                this.setState({phonenumber: this.state.newPhonenumber});
            });
        }


        if (this.validatePassword()) {
            OrganizerStore.changePassword(CookieStore.currentUserID, this.state.oldPassword, this.state.firstNewPassword, status => {
                console.log(status);
                this.setState({savingInformation: false});
                this.setState({
                    oldPassword: '',
                    firstNewPassword: '',
                    secondNewPassword: ''
                });
                this.setState({showPasswordAlert: true});
            });
        }

        // code for submitting profile picture here, you can access it with this.state.newprofilePicture
        if (this.validateFile()){
            console.log("Image validated");
            let formData = new FormData();
            formData.append('description', this.state.newProfilePicture.name);
            formData.append('selectedFile', this.state.newProfilePicture);
            PictureService.insertPicture(OrganizerStore.currentOrganizer.organizerID, formData, (statusCode, link) => {
                console.log("Image uploaded with status " + statusCode);
                if (statusCode === 200 && link){
                    const totalPath = __dirname + '../../../../server/' + link;
                    this.state.profilePicture = totalPath;
                }
            });
        }
        else{
            console.log("Image not validated");
        }

        // code for submitting profile picture here, you can access it with this.state.new.profilePicture

    }
}

export class SubmitButton extends React.Component{
    render(){
        if(this.props.loading){
            return(<Button type="submit" variant="success" disabled>
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                /> Lagrer</Button>)
        } else{
            return(<Button type="submit" variant="success" disabled={this.props.stop}>Lagre</Button>)
        }

    }

}

