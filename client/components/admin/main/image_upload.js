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
                    console.log(imageString)

                    var options = {
                        "apiKey": '3730cec457efb6d',
                        image: imageString
                     }
                    
                    Imgur.upload(options, (error, data) => {
                        if(error){
                            console.log(error)
                        }
                        else{
                            console.log('works', data.link)
                            var str = window.location.pathname;
                            var res = str.substring(7, str.length - 1);
                            console.log(res)
                            var pageID = res;
                            Meteor.call('pages.updateImage',pageID, data.link, (error, data) => {
                                if(error){
                                    console.log(error)
                                }
                                else{
                                    console.log('image updated')
                                }
                            })
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