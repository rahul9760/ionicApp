import { Component } from '@angular/core';
import { NavParams, NavController, Platform } from 'ionic-angular';

import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { SessionHelper } from '../../../../helpers/session.helper';
import { CameraHelper } from '../../../../helpers/camera.helper';
import { ContactServiceProvider } from '../../../../providers/contact-service/contact-service';
import { LinkedDocumentsWithCI } from '../links/documents/documents';
import { LinkedAgendaWithCI } from '../links/agenda/agenda';
import { LinkedInfrastructureWithCI } from '../links/infrastructure/infrastructure';
import { LinkedEquipmentWithCI } from '../links/equipments/equipments';

import { config } from '../../../../app.config';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

@Component({
  selector: 'page-contact-external-description',
  templateUrl: 'show.html',
  providers: [NotificationsHelper,CallNumber,SocialSharing,CameraHelper]
})

export class ContactInternalDescription {

  private profile_pic:any = 'assets/img/dummy_user.png'
  private contact_id: number;
  private description: any;
  private current_user: any;
  private sites: any;
  private departments: any;
  private backup: any;
  private color: String = '#488aff';
  private is_edit : boolean = false;
  private reload:  boolean = false;
  private permission:  boolean = false;
  public segement: String = 'contact';
  public item_header_class: String = 'item item-ios list-header list-header-ios';
  public input_class = "text-input text-input-ios"

    
  constructor(
    private params: NavParams,
    private ContactService: ContactServiceProvider,
    private navCtrl: NavController,
    private session: SessionHelper,
    private callNumber: CallNumber,
    private socialSharing: SocialSharing,
    private camera: CameraHelper,
    private platform: Platform,
    private iab: InAppBrowser,
    private transfer: Transfer,
    private Notifications: NotificationsHelper) {
     this.current_user = this.session.getUser();
     this.contact_id = this.params.get('id');
     this.getDescription();
  }

  fileTransfer: TransferObject = this.transfer.create();

  getDescription(){
    
    this.Notifications.presentLoader();

    this.ContactService.getContactInternal(this.contact_id)
    .then(data => {
      this.Notifications.dismissLoader();
      if(data.status){
        this.getContactSites();
        this.getContactDepartments( data.contact.cs_id );
        this.description = data;
        console.log("Description :"+JSON.stringify(this.description));
        this.getProfilePic();
      } else {
        
        //IF PERMISSION NOT FOUND
        if(data.permission){
          this.permission = data.permission;
        } else { // IF REQUEST NOT FOUND
          this.reload = true;
        }

        this.Notifications.presentToast(data.message);
      }
    });
  }

  attrName(id, type){
    var name = '';
    var attributes = this.description.attributes;
    switch(type){

          case 'person':
            name = attributes.person[id] ? attributes.person[id]['name'] : '-'
          break;

          case 'employee':
            name = attributes.employee[id] ? attributes.employee[id]['name'] : '-'
          break;

          case 'department':
            name = attributes.department[id] ? attributes.department[id]['name'] : '-'
          break;

          case 'site':
            name = attributes.site[id] ? attributes.site[id]['name'] : '-'
          break;

    }

    return name;
  }


  edit(){
    this.color = '#1ea209'; 
    this.is_edit = true;  
    this.backup = Object.assign({}, this.description);
  }
  
  update(){
    this.ContactService.updateContactInternal( this.description )
    .then(data => {

      if (data.status){
        this.getDescription();
        this.resetVaribles();
      } else {
        this.Notifications.presentToast(data.message);
      }

    });
  }

  resetVaribles(){
    this.is_edit = false;
    this.color = '#488aff';
  }
  
  cancelEdition(){
    this.is_edit = false;
    this.color = '#488aff';
    this.description = this.backup;
  }
  
  link(type){
    
    switch(type){
          
          case 'document':
            this.navCtrl.push(LinkedDocumentsWithCI, { row_id : this.description.contact.ce_id , 
                                                       contact_id : this.description.contact.contact_id 
                                                    })
          break;
          
          case 'agenda':
            this.navCtrl.push(LinkedAgendaWithCI, {  row_id : this.description.contact.ce_id , 
                                                     contact_id : this.description.contact.contact_id 
                                                  })
          break;
          
          case 'infrastructure':
            this.navCtrl.push(LinkedInfrastructureWithCI, {  row_id : this.description.contact.ce_id , 
                                                             contact_id : this.description.contact.contact_id 
                                                          })
          break;
          
          case 'equipment':
            this.navCtrl.push(LinkedEquipmentWithCI, {  row_id : this.description.contact.ce_id , 
                                                        contact_id : this.description.contact.contact_id 
                                                     })
          break;
           
    }
    
  }

  getContactSites(){   
    this.ContactService.getContactSites(1,'')
    .then(data => {
      if( data.error == undefined ){
        this.sites = data;
      } else {
        this.getContactSites();
      }
    });
  }

  getContactDepartments(id){
    
    this.ContactService.getContactDepartmentsAndSiteAttrs(id)
    .then(data => {

      if( data.error == undefined ){
      
        this.departments = data.departments;
        this.description.contact.site_attrs_data = data.site_attributes;
        //this.description.contact.department_attrs_data = [];

      } else {
        this.getContactDepartments(id);
      }

    });
  }

  getContactDepartmentAttrs(id){
    
    this.ContactService.getContactDepartmentsAttrs(id)
    .then(data => {

      if( data.error == undefined ){
      
        this.description.contact.department_attrs_data = data.department_attrs;

      } else {
        this.getContactDepartmentAttrs(id);
      }

    });
  }


  access(attr_id){
    let attribute = this.getAccessType(attr_id)
    let icon = ''
    let icons = { 
                  'call' : 'call', 
                  'email' : 'mail', 
                  'link' : 'link', 
                  'skype' : 'logo-skype'
                }

    if( attribute ){
      icon = icons[attribute.access_type]
    }

    return icon;
  }

  accessAction(attr_id, value){
    let attribute = this.getAccessType(attr_id)

    if( attribute ){
      console.log(attribute.access_type);
      switch(attribute.access_type){
       
        case 'call':
          this.call(value)
        break;

        case 'email':
          this.email(value)
        break;

        case 'link':
          this.openlink(value)
        break;

      }

    }
    
  }

  getAccessType(attr_id){

    let attribute

    this.description.contact.access_types.forEach( d => {
      if( attr_id == d.attribute_id ){
        attribute = d
      }
    });

    return attribute
  }

  call(number){
    this.callNumber.callNumber(number, true)
    .then(res => 
      console.log('Launched dialer!', res))
    .catch(err =>
       console.log('Error launching dialer', err)
    );
  }

  email(value){

    this.socialSharing.shareViaEmail('', '', [value] ).then(() => {
      
    }).catch((err) => {
      
    });

  }

  openlink(value){
    this.iab.create( 'http://' + value );
  }

  getProfilePic(){
      if(this.description.contact.profile_pic){
        this.profile_pic =  config.api_url + 
                    'documents/download?fileName=' + 
                    this.description.contact.profile_pic + 
                    '&token='+this.session.getToken() + 
                    '&type=profile_pic_ci'

        if(this.platform.is('android') || this.platform.is('ios'))  {
             this.profile_pic += '&timestamp=' + new Date().getTime();
        }
      }
  }

  openCamera(){
    this.camera.action( (image) => {
      this.upload(image);
    });
  }

  upload(imageData) {
    let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: 'file.jpg',
                mimeType: "multipart/form-data",
                params : { 'fileName': 'file.jpg',
                           'org_user_id' : this.current_user.user_id ,
                           'employee_id' : this.description.contact.ce_id ,
                           'org_id' : this.current_user.user_org_id 
                         }
              }
    this.Notifications.presentLoader();

    this.fileTransfer.upload(imageData, config.api_url + 'uploads/profile_pic_ci', options)
    .then((data) => {
      this.Notifications.dismissLoader();
      this.Notifications.presentToast("Profile picture updated successfully");
      this.getDescription();
    }, (err) => {
      this.Notifications.dismissLoader();
      this.Notifications.presentToast("Unable to update profile picture");
    })
  }

}
