import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class ImageUpload extends Component {
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
                    var res = str.substring(7, str.lastIndexOf('/event'));
                    console.log('yo')
                    if(str.lastIndexOf('/') == str.length - 1){
                        var pos = str.substring(str.lastIndexOf('/event') + 8, str.length - 1)
                    }
                    else{
                        var pos = str.substring(str.lastIndexOf('/event') + 8, str.length)
                    }
                    console.log(pos)
                    var pageID = res;
                    var eventID = pos;
                    console.log(pos, res)
                    Meteor.call('dande.eventImage',pageID, eventID, imageString, (error, data) => {
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
                <input type="file" className="image-choose" id="filePicker" onChange={this.onDrop} />
            </div>
        )
    }
}