import { UtilityService } from './../services/util.service';
import { TreeService } from './../services/tree.service';
import { Component, OnInit, Input } from '@angular/core';
import { IItem } from './i-item';

@Component({
  selector: 'app-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.less']
})
export class TreeItemComponent implements OnInit {

  @Input() item: IItem;
  constructor(private utilityService: UtilityService) { }

  ngOnInit() {
  }

  toggle() {
    this.item.isOpened = !this.item.isOpened;
  }

  selectItem(item) {
    if (item.type && item.type === 'file') {
      const { name, type, path, size, extension, iconType, editorType } = item;
      item = { name, type, path, size, extension, iconType, editorType };

      let flag1: boolean = this.utilityService.checkFileSupportedOrNotToLoad(item);
      let flag2: boolean = this.utilityService.checkFileSize(item.size);

      if (flag2) {
        alert('File size is more than 7MB. Unable to load file. File Size: ' + ((item.size/1024).toFixed(2)) + 'MB.');
        return;
      }

      if (flag1) {
        let confirmVal = confirm('File Type Not Supported to open in editor. Please use WinSCP for this.\n\n' + `Do you still want to load the file '${item.name}' ?`);
        if (!confirmVal) {
          return;
        }
      }

      this.utilityService.sendNotification({type: 'load-file', data: item});
    } else if(item.type && item.type === 'folder') {
      this.item.isOpened = !this.item.isOpened;
    }
  }

}
