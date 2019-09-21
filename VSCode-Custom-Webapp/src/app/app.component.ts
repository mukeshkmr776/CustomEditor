import { TreeService } from './services/tree.service';
import { UtilityService } from './services/util.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  options: FormGroup;
  title = 'sample-monaco';
  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code = '';

  refreshingEditor: boolean;
  errorMessageFileLoading: any;

  loadedFile: any = {
    name: '',
    type: '',
    size: '',
    path: '',
    extension: '',
    iconType: '',
    editorType: ''
  };

  footerInfo: any = {
    message: '',
  };

  constructor(fb: FormBuilder, private utilityService: UtilityService, private treeService: TreeService) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
    this.resetEditor();
  }

  ngOnInit() {
    this.utilityService.subscribeNotification().subscribe((message: any) => {
      if (message.type === 'load-file') {
        this.handleFileLoad(message.data);
      } else if (message.type === 'error-load-directory') {
        this.resetEditor();
        this.errorMessageFileLoading = message.data;
      }
    });
  }

  handleFileLoad(selectedFile: any) {
    this.refreshingEditor = true;
    console.log('Selected File: ', selectedFile);

    this.treeService.getFileContent(selectedFile)
      .then((result: any) => {
        this.code = result.data ? result.data : '';
        this.editorOptions.language = (result.editorType && result.editorType !== 'unknown') ? result.editorType : 'text/plain';
        this.errorMessageFileLoading = '';

        setTimeout(() => {
          this.refreshingEditor = false;
        }, 1000);

        this.loadedFile = {
          name: result.name,
          type: result.type,
          size: result.size,
          path: result.path,
          extension: result.extension,
          iconType: result.iconType,
          editorType: result.editorType
        };

        console.log('Editor Set with details: ', this.editorOptions);
      }).catch((err: any) => {
        err = err.error;
        console.log('Error:', err);
        this.resetEditor();
        this.errorMessageFileLoading = err.errorMessage ? err.errorMessage : `Something went wrong. Unable to load file: '${err.name}'`;
      });
  }

  saveFile() {
    if (this.loadedFile.name !== '') {
      const file = {
        name: this.loadedFile.name,
        type: this.loadedFile.type,
        size:  this.loadedFile.size,
        path: this.loadedFile.path,
        extension: this.loadedFile.extension,
        iconType: this.loadedFile.iconType,
        editorType: this.loadedFile.editorType,
        content: ''
      };

      file.content = this.code;
      this.treeService.saveFileContent(file)
      .then((result) => {
        this.footerInfo.message = `Successfully saved file ${file.path} at ${new Date()}`;
        console.log(`File saved successfully: "${file.path}"`);
        this.utilityService.showSnackBarNotification('File saved successfully', 'close', true);
      }).catch((err) => {
        let message = '';
        if (err.errorMessage) {
          message = err.errorMessage;
        } else if (err.error && err.error.errorMessage) {
          message = err.error.errorMessage;
        } else if (err.statusText) {
          message = `HTTP-${err.status}: ${err.statusText}`;
        }
        this.footerInfo.message = `Error while saving file "${file.path}": ${message}`;
        console.log('Error while saving file: ', err);
        this.utilityService.showSnackBarNotification(message, 'close', false);
      });
    }
  }

  closeFile() {
    this.resetEditor();
  }

  resetEditor() {
    this.refreshingEditor = null;
    this.code = '';
    this.loadedFile = {
      name: '',
      type: '',
      size: '',
      path: '',
      extension: '',
      iconType: '',
      editorType: '',
      content: ''
    };
    this.editorOptions.language = 'text/plain';
    this.errorMessageFileLoading = '';
    this.footerInfo.message = '';
  }

  reloadFileAgain() {
    this.handleFileLoad(this.loadedFile);
  }

}
