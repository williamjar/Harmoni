import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {DocumentService} from "../store/documentService";
import {EventStore} from "../store/eventStore";
import {DocumentCategory} from "../classes/documentCategory";
import Button from "react-bootstrap/Button";
import {Alert} from "./alerts";
import {createHashHistory} from "history";

let history = createHashHistory();

/**
 * @class DocumentationTab
 * @classdesc Tab for submitting documents.
 */
export class DocumentationTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            description: '',
            selectedFile: '',
            filename: 'Velg her',
            documentCategories: []
        };
    }

    onChange = (e) => {
        if (e.target.value === '') {
            this.setState({selectedFile: '', description: '', filename: 'Velg her'});
        } else {
            if (e.target.name === 'selectedFile') {
                this.setState({selectedFile: e.target.files[0]});
                this.setState({filename: e.target.files[0].name})
            }
        }
    };

    checkFileType() {
        if (this.state.selectedFile.name !== '') {
            let filename = this.state.selectedFile.name;
            return (/\.(jpeg)$/i).test(filename) || (/\.(jpg)$/i).test(filename) || (/\.(png)$/i).test(filename)
                || (/\.(ai)$/i).test(filename) || (/\.(pdf)$/i).test(filename) || (/\.(pptx)$/i).test(filename)
                || (/\.(ppt)$/i).test(filename) || (/\.(xlsx)$/i).test(filename) || (/\.(xls)$/i).test(filename)
                || (/\.(docx)$/i).test(filename) || (/\.(doc)$/i).test(filename) || (/\.(rar)$/i).test(filename)
                || (/\.(7z)$/i).test(filename) || (/\.(zip)$/i).test(filename) || (/\.(rtf)$/i).test(filename)
                || (/\.(rtx)$/i).test(filename);
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const {description, selectedFile} = this.state;

        const selectedCategory = document.getElementById("categorySelect");
        const selectedCategoryIndex = selectedCategory.selectedIndex;
        const selectedCategoryID = selectedCategory.value;
        const selectedCategoryName = selectedCategory.options[selectedCategoryIndex].text;
        if (this.checkFileType()) {
            let formData = new FormData();
            formData.append('description', description);
            formData.append('selectedFile', selectedFile);
            DocumentService.addDocument(EventStore.currentEvent.eventID, selectedCategoryName, null, null, selectedCategoryID, formData, statusCode => {
                if (statusCode === 200) {
                    document.getElementById("error").innerHTML = "";
                    Alert.success("Vedlegget ble opplastet til " + selectedCategoryName);
                } else {
                    Alert.danger("Det skjedde en feil under opplastning, vennligst prøv igjen eller kontakt oss.");
                }
            })
        } else {
            Alert.danger("Du har lastet opp en tom eller ugyldig filtype");
            document.getElementById("error").innerHTML = "Godkjente filtyper .jpg .jpeg .png .ai .pdf .pptx .ppt .xlsx .xls .docx .doc .rar .7z .zip .rft . rtx";
        }
        this.setState({selectedFile: '', description: '', filename: 'Velg her'})
    };

    componentDidMount() {

        DocumentService.getAllDocumentCategories(list => {
            if (list !== null) {
                this.setState({documentCategories: list});
            } else {
                let staticList = [new DocumentCategory(1, 'Kontrakter'),
                    new DocumentCategory(2, 'Riders'),
                    new DocumentCategory(3, 'Annet')];

                this.setState({documentCategories: staticList});
            }
        })
    }


    render() {
        return (
            <div className="document-event center-v padding-top-30 text-center">

                <div className="row text-left">
                    <div className="col-4"/>
                    <div className="col-4">
                        <span className="text-center"><h3 className="padding-bottom-20">Her kan du laste opp diverse dokumenter tilknyttet til arrangementet.</h3></span>
                        <select id='categorySelect' className={"mr-1 form-control"}>
                            {this.state.documentCategories.map(category => (
                                <option key={category.documentCategoryID} value={category.documentCategoryID}>
                                    {category.documentCategoryName}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>

                <div className="row padding-top-20 justify-content-center">

                        <span className=" btn btn-secondary btn-lg btn-file">
                            {this.state.filename}

                            <input
                                type="file"
                                name="selectedFile"
                                onChange={this.onChange}
                            />
                        </span>
                    <Button type="button" variant={"success"} className={"mr-1 margin-left-10 btn-success btn-lg"}
                            onClick={this.onSubmit}>Last opp fil</Button>

                </div>
                <section id={"error"} className={"text-info col padding-top-10"}/>
                <div className="row padding-top-20 justify-content-center">
                    <Button className={"mr-1 btn"} onClick={() => {
                        history.push("/dokumenter/" + EventStore.currentEvent.eventID)
                    }}>Gå til arrangementets dokumenter</Button>
                </div>
            </div>
        )
    }
}
