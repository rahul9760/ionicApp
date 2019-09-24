import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GlobalVarsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class GlobalVarsProvider {
  public current_user: any;
  public applied_conditions: any = [];
  public opened_documents: String[];

  constructor(public http: Http) {
    this.current_user = { username : '', image_path : '', email : '' };
    this.opened_documents = [];
  }

  setCurrentUser(value) {
    this.current_user = value;
  }

  setOpenedDocuments(id) {
    this.opened_documents = [id];
  }

  setAppliedConditions(d) {
    this.applied_conditions = d;
  }

  getAppliedConditions() {
    return this.applied_conditions;
  }

  getOpenedDocuments() {
    return this.opened_documents
  }

  getCurrentUser() {
    return this.current_user;
  }

}
