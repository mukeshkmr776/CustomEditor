import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TreeService {

  constructor(private http: HttpClient) { }

  getTree(directoryPath: string): any {
    return this.http.post('api/tree/getTree', { directoryPath }).toPromise();
  }

  getFileContent(selectedFile: any): any {
    return this.http.post('api/tree/getFileContent', selectedFile).toPromise();
  }

  saveFileContent(selectedFile: any): any {
    return this.http.post('api/tree/saveFileContent', selectedFile).toPromise();
  }

  checkIfExistOrNot(itemPath: any): any {
    return this.http.post('api/tree/checkIfExistOrNot', { itemPath }).toPromise();
  }

}
