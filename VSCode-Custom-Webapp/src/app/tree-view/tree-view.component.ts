import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { UtilityService } from './../services/util.service';
import { IItem } from '../tree-item/i-item';
import { TreeService } from '../services/tree.service';
import { ChooseDirectoryComponent } from '../choose-directory/choose-directory.component';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.less']
})
export class TreeViewComponent implements OnInit {

  item: IItem = null;
  isRefreshingTreeList: boolean;

  constructor(public dialog: MatDialog, private utilsService: UtilityService, private treeService: TreeService) {
    this.isRefreshingTreeList = false;
  }

  ngOnInit() {

  }

  getTree() {
    const directoryPath = sessionStorage.getItem('directoryPath');
    if (!directoryPath) {
      this.utilsService.showSnackBarNotification('Please choose directory or file.', 'close', false);
      return;
    }
    this.isRefreshingTreeList = true;

    // Here setTimeout is used to simulate the loading effect
    setTimeout(() => {
      this.treeService.getTree(directoryPath)
      .then((result: any) => {
        this.item = result;
        this.isRefreshingTreeList = false;
      }).catch((err: any) => {
        this.item = null;
        this.isRefreshingTreeList = false;
        this.utilsService.sendNotification({type: 'error-load-directory', data: `${err.status} ${err.error}`});
      });
    }, 1000);
    // End
  }

  collapseAllDirectory() {
    if (this.item) {
      this.item = this.utilsService.collapseAllDirectory(this.item, true);
    }
  }

  chooseDirectoryPath() {
    const dialogRef: any = this.dialog.open(ChooseDirectoryComponent, {
      width: '500px',
      data: { name: 'Mukesh'},
      disableClose: true,
      minHeight: '100px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        this.getTree();
      }
    });
  }

}
