import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class ImageUploadS extends Component {
    onDrop(evt){
         var handleFileSelect = function(evt) {
            var files = evt.target.files;
            var file = files[0];

            if (files && file) {
                var reader = new FileReader();

                reader.onload = function(readerEvt) {
                    var binaryString = readerEvt.target.result;
                    
                    console.log('seen')
                    var imageString = btoa(binaryString)
                    var str = window.location.pathname;
                    var res = str.substring(7, str.lastIndexOf('/deal'));
                    var pageID = res;

                    var str = window.location.pathname;
                    var res = str.substring(str.lastIndexOf('/deal')+14, str.length - 1);
                    var dealID = res;
                    Meteor.call('dande.imageDandE',pageID, dealID, imageString, (error, data) => {
                        if(error){
                            console.log(error)
                        }
                        else{
                            console.log('image updated')
                        }
                    })
                };

                reader.readAsBinaryString(file);
            }
        };

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
        console.log('see')
        handleFileSelect(evt);
   
    }
    render() {
        return (
            <div className="container">
                <input type="file" id="filePicker" onChange={this.onDrop} />
            </div>
        )
    }
}