import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable()
export class UtilityService {

  subject = new Subject < any > ();

  NOT_SUPPORTED_FILES_TO_OPEN_IN_EDITOR: Array < string > = ['unknown', 'zip', 'bin', 'gz', 'tar', 'ttf', 'image'];

  constructor(private _snackBar: MatSnackBar) {}

  sendNotification(item: any) {
    this.subject.next(item);
  }

  subscribeNotification() {
    return this.subject.asObservable();
  }

  checkFileSupportedOrNotToLoad(item: any) {
    let flag = false;
    const { editorType } = item;

    for (const val of this.NOT_SUPPORTED_FILES_TO_OPEN_IN_EDITOR) {
      if (editorType.indexOf(val) > -1) {
        flag = true;
        break;
      }
    }

    return flag;
  }

  checkFileSize(size: any) {
    let flag = false;
    if (size > (1024 * 1024 * 7)) { // Check if file size is greater than 7MB
      flag = true;
    }
    return flag;
  }

  collapseAllDirectory(item: any, keepBaseDirectoryOpen: boolean) {
    if (item.type === 'folder') {
      item.isOpened = keepBaseDirectoryOpen;
      item.children.map((i: any) => this.collapseAllDirectory(i, false));
    }
    return item;
  }

  showSnackBarNotification(message, action, isSuccess) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 500000,
      panelClass: isSuccess ? 'custom-snackbar-success' : 'custom-snackbar-failure'
    });
  }

}
