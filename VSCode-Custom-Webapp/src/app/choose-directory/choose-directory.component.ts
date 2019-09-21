import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { isEmpty } from 'lodash';
import { UtilityService } from '../services/util.service';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'app-choose-directory',
  templateUrl: './choose-directory.component.html',
  styleUrls: ['./choose-directory.component.less']
})
export class ChooseDirectoryComponent implements OnInit {

  nameFormControl: any = new FormControl('', [
    Validators.required
  ]);

  depthFormControl: any = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(5)
  ]);


  error: any = {
    errorMessage: '',
    isError: false
  };

  constructor(public dialogRef: MatDialogRef<ChooseDirectoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private treeService: TreeService) { }

  ngOnInit() {
    const sessionItem: any = sessionStorage.getItem('directoryPath');
    if(!isEmpty(sessionItem)) {
      this.nameFormControl.value = sessionItem;
    }
  }

  onOpen(): void {
    let name = this.nameFormControl.value;
    let depth = this.depthFormControl.value;

    if(isEmpty(name)) {
      this.error = {
        errorMessage: 'Choose folder/file path.',
        isError: true
      };
      return;
    }
    this.treeService.checkIfExistOrNot(name)
    .then((result: any) => {
      sessionStorage.setItem('directoryPath', name);
      this.dialogRef.close(name);
    }).catch((err: any) => {
      this.error = {
        errorMessage: err.error && err.error.errorMessage ? err.error.errorMessage : 'Something went wrong. Please verify path or server is running.',
        isError: true
      };
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

}
