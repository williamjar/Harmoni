import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Dropzone from 'react-dropzone';
import { FaArrowAltCircleDown } from 'react-icons/fa';
import {DocumentService} from "../store/documentService";
import {EventStore} from "../store/eventStore";
import {Col} from "react-bootstrap";
import {DocumentCategory} from "../classes/documentCategory";
import Button from "react-bootstrap/Button";

export class DocumentationTab extends Component{

    constructor(props) {
        super(props);
        this.state = {
            description: '',
            selectedFile: '',
            documentCategories: []
        };
    }

    onChange = (e) => {
        if (e.target.name === 'selectedFile') {
            this.setState({selectedFile: e.target.files[0]});
        } else {
            this.setState({[e.target.name]: e.target.value});
        }
    };

    onSubmit = (e) => {
        e.preventDefault();
        const {description, selectedFile} = this.state;

        const selectedCategory = document.getElementById("categorySelect");
        const selectedCategoryIndex = selectedCategory.selectedIndex;
        const selectedCategoryID = selectedCategory.value;
        const selectedCategoryName = selectedCategory.options[selectedCategoryIndex].text;

        let formData = new FormData();
        formData.append('description', description);
        formData.append('selectedFile', selectedFile);
        DocumentService.addDocument(EventStore.currentEvent.eventID, selectedCategoryName, null, null, selectedCategoryID, formData, statusCode => {
            if (statusCode === 200){
                alert("Document was added!");
            }
            else{
                alert("There was an error, please try again or contact us.");
            }
        })
    };

    componentDidMount() {

        DocumentService.getAllDocumentCategories(list => {
            if (list !== null){
                console.log("not null");
                this.setState({documentCategories: list});
            }
            else{
                let staticList = [new DocumentCategory(1, 'Kontrakter'),
                    new DocumentCategory(2, 'Riders'),
                    new DocumentCategory(3, 'Annet')];

                this.setState({documentCategories: staticList});
            }
        })
    }


    render(){
        console.log(this.state);
        const {description, selectedFile} = this.state;
        return (
            <div>
                <select id='categorySelect' className={"mr-1"}>
                    {this.state.documentCategories.map(category => (
                        <option key={category.documentCategoryID} value={category.documentCategoryID}>
                            {category.documentCategoryName}
                        </option>
                    ))}
                </select>

                <input
                    type="file"
                    name="selectedFile"
                    onChange={this.onChange}
                />
                <Button type="button" className={"mr-1"} onClick={this.onSubmit}>Last opp fil</Button>


            </div>

        )
    }
}
