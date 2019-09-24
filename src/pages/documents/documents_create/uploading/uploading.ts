import { Component,ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams,Navbar, ActionSheetController,Platform, AlertController, normalizeURL, ToastController} from 'ionic-angular';
import { DocumentsList} from '../../documents_list/documents_list';
import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { SessionHelper } from '../../../../helpers/session.helper';
import { Screen3 } from '../../documents_create/screen3/screen3';
import { DocumentsListView} from '../../documents_list_view/documents_list_view';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateLinkedDocument } from '../../../agenda/links/documents/create/create';
import { CreateLinkedDocumentForCI } from '../../../contact/internal/links/documents/create/create';
import { CreateLinkedDocumentForCE } from '../../../contact/external/links/documents/create/create';
import { CreateLinkedDocumentForInfrastructure } from '../../../infrastructure/links/documents/create/create';
import { CreateLinkedDocumentsForEquipments } from '../../../equipments/links/documents/create/create';

import { config } from '../../../../app.config';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';

declare var window;
declare var FilePicker: any;

@Component({
  selector: 'page-create-uploading',
  templateUrl: 'uploading.html',
  providers: [FileChooser,FilePath,MediaCapture]
})

export class Uploading {
  @ViewChild(Navbar) navBar: Navbar;
  files:any = [];
  inAppBrowserRef:any;

  assign_attributes: any = [];
  subcategory_data: any = {}
  category_files_data: any = {}
  subcategory_files_data: any = {}
  ca_f: any = {}
  fileTransfer:any 
  category_id:String = '';
  subcategory_id:String = '';
  designation:String = '';
  lastImage:String = '';
  tags:any;
  category_data: any = {}
  categories_attrs: any
  sub_categories_attrs: any
  google_document_count = 1;
  uploadComplete = false;
  attr_assigned: boolean = false; 
  
  constructor(public navCtrl: NavController,
              public platform: Platform,
              public alertCtrl: AlertController,
              public _ngZone: NgZone,
              public actionSheetCtrl: ActionSheetController,
              public DocumentService: DocumentServiceProvider,
              public Notifications: NotificationsHelper,
              public camera: Camera,
              public session: SessionHelper,
              public fileChooser: FileChooser,
              public filePath: FilePath,
              public DomSanitizer: DomSanitizer,
              public transfer: Transfer,
              public navParams: NavParams,
              public toastController: ToastController,
              public mediaCapture: MediaCapture) {

        this.category_data = this.navParams.data.category_data;
        this.category_id = this.navParams.data.category_id;
        this.subcategory_data = this.navParams.data.subcategory_data;
        this.subcategory_id = this.navParams.data.subcategory_id;
        this.designation = this.navParams.data.designation;
        this.categories_attrs = this.navParams.data.attributes.categories_attrs;
        this.sub_categories_attrs = this.navParams.data.attributes.sub_categories_attrs;    
        this.tags = this.navParams.data.tags;
        this.loadFiles(); 
  }

  next(){
    
    if(this.files.length > 0){
      window.localStorage.setItem('url', JSON.stringify([]));
      Object.keys(this.files).forEach(d=> {
       
        if(this.files[d]['is_selected']){
         
          var old = [];
         
          var ur = window.localStorage.getItem('url'); 
         
          if(ur){
            old = JSON.parse( window.localStorage.getItem('url') )
          }

          old.push(this.files[d]['path']);

          window.localStorage.setItem('url', JSON.stringify(old));

        }

      });
    }  
    
    this.navCtrl.push(Screen3,this.navParams.data);
  }


  loadFiles(){

    var files = this.session.getUrl();

    this.category_files_data = {};
    this.subcategory_files_data = {};

    if(files && files.length > 0 ){
      files.forEach(f=> {
                      
        this.files.push({ 'path' : f, 
                          'is_selected' : true, 
                          'is_captured' : false, 
                          'attribute_id' : 0, 
                          'user_defined_name' : this.getName(f) 
                        });
      });
    }
    
  }

  assignAttributeIfSingleFile(){
    if( this.files.length == 1 ) {
      var indx = 0;
      var cat_file_count = 0
      this.categories_attrs.forEach((category) => {
        if( category.attr_type == 'file' ||  category.attr_type == 'image') {
          cat_file_count++;
        }
      }) 

      var subcat_file_count = 0
      this.sub_categories_attrs.forEach((sub_category) => {
        if( sub_category.attr_type == 'file' ||  sub_category.attr_type == 'image') {
          subcat_file_count++;
        }
      })

      if(cat_file_count == 1 && subcat_file_count == 0){
        this.files[indx].attribute_id = this.categories_attrs[indx].id;
        this.files[indx].attribute_name = this.categories_attrs[indx].name;
        this.files[indx].attribute_type = 'cat';
        this.files[indx].category_attribute_name = this.capitalize(this.navParams.data.category_name) + ' - ' +  this.files[indx].attribute_name ;
        this.category_files_data[ this.files[indx].attribute_id ] = this.files[indx];
      }

      if( subcat_file_count == 1 && cat_file_count == 0){
        this.files[indx].attribute_id = this.sub_categories_attrs[indx].id;
        this.files[indx].attribute_name = this.sub_categories_attrs[indx].name;
        this.files[indx].attribute_type = 'subcat';
        this.files[indx].category_attribute_name = this.capitalize(this.navParams.data.category_name) + ' - ' +  this.files[indx].attribute_name ;
        this.subcategory_files_data[ this.files[indx].attribute_id ] = this.files[indx];
      }

    }
  }
  

  upload(){

    if(this.platform.is('ios')){

      FilePicker.pickFile( (file) => {

         this.files.push({ 'path' : file, 
                           'is_selected' : true, 
                           'is_captured' : false, 
                           'attribute_id' : 0, 
                           'user_defined_name' : this.getName(file) });
          // this.assignAttributeIfSingleFile();
         //this.addUserDefinedName(this.files.length - 1);
         this._ngZone.run(() => {  });

       },(err) => {
         alert(JSON.stringify(err))
       });

    } else if(this.platform.is('android')){

      this.fileChooser.open()
      .then(uri => {
        
        var uriArr = uri.split(',');

        uriArr.forEach((u,i) => {

          this.filePath.resolveNativePath( u )
          .then(filePath => {

              this.files.push({ 'path' : filePath, 
                                'is_selected' : true, 
                                'is_captured' : false, 
                                'attribute_id' : 0, 
                                'user_defined_name' : this.getName(filePath) });

          }, (err) => {

              this.files.push({ 'path' : u,
                                'is_selected' : true, 
                                'is_captured' : false, 
                                'attribute_id' : 0, 
                                'user_defined_name' : this.getName(u) });
          });

        });

      })
      .catch(e => alert(JSON.stringify(e)) );
    }

  }


  getName(f){
    var _arr = f.split('/');
    if(_arr.length > 0){
      var _name  = _arr[_arr.length - 1];
    
      //GOOGLE DRIVE DOCUMENT
      if ( _name.substr(0, 3) == 'enc' ){
        _name = 'Google Document'
      }

      return _name;

    } else {
      return f;
    }
    
  }
  
  getExt(f){
    var ext = '';

    if( f  != undefined ){
       ext = f.split('.')[1]
    }

    return ext

  }
  
  getImage(f) {
    var image;

    if( f  != undefined ){
      var file_arr = f.split('.');
      var ext = file_arr.length > 0 ? file_arr[file_arr.length - 1] : ''

      switch(ext){
        case 'pdf':
 
          image = 'assets/img/new_pdf.png';
          break;

        case 'ppt':
        case 'pptx':

          image = 'assets/img/new_ppt.png';
          break;

        case 'doc':
        case 'docx':

          image = 'assets/img/new_word.png';
          break;

        case 'xls':
        case 'xlsx':

          image = 'assets/img/new_xls.png';
          break;

        case 'mp3':

          image = 'assets/img/new_mp3.png';
          break;

        case 'zip':

          image = 'assets/img/new_zip.png';
          break;

        case 'mp4':
        case '3gp':
        case 'flv':
        case 'avi':
        case 'mov':
        case 'wmv':

          image =  'assets/img/new_video.png';
          break;
          
        case 'jpg':
        case 'png':
        case 'jpeg':
        case 'gif':
        case 'bmp':
        case 'jpg':

          image = normalizeURL(f);

          break;
          
        case 'google':

          image = 'assets/img/google.png';

          break;
          
        default:
          
          image = 'assets/img/new_default.png';

          break;
          
      }
    }

    return image
  }


  presentActionSheet() {

      if(this.platform.is('ios')){
          let iosActionSheet = this.actionSheetCtrl.create({
              title: 'Choose one option',
              buttons: [
                {
                    text: 'Camera',
                    handler: () => {
                       this.captureImage( this.options(this.camera.PictureSourceType.CAMERA) )
                  }
                },
                {
                    text: 'Gallery',
                    handler: () => {
                     this.captureImage( this.options(this.camera.PictureSourceType.PHOTOLIBRARY) )
                  }
                },
                {
                    text: 'Upload a document',
                    handler: () => {
                      this.upload();
                  }
                },{
                text: 'Cancel',
                role: 'cancel'
            }]
         });
         iosActionSheet.present();
      
      } else if(this.platform.is('android')){
          let androidActionSheet = this.actionSheetCtrl.create({
              title: 'Choose one option',
              buttons: [
              {
                text: 'Camera',
                handler: () => {
                  this.captureImage( this.options(this.camera.PictureSourceType.CAMERA) );
                }
              },
              {
                text: 'Gallery',
                handler: () => {
                  this.captureImage( this.options(this.camera.PictureSourceType.PHOTOLIBRARY) )
                }
              },
              {
                text: 'Upload a document',
                handler: () => {
                  this.upload();
                }
              },{
                text: 'Cancel',
                role: 'cancel'
              }]
         });
         androidActionSheet.present();
      }

      else{
        console.log("Platform System");
      }

      
    
  }

  captureImage(camera_options){
    this.camera.getPicture(camera_options).then((imageData) => {
       this.files.push({'path' : imageData, 
                        'is_selected' : true, 
                        'is_captured' : true, 
                        'user_defined_name' : this.getName(imageData) });   
    }, (err) => {
        alert(JSON.stringify(err))
    });

  }

  options(source_type){
    let camera_options: CameraOptions = {
        quality: 80,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: source_type,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.ALLMEDIA,
        correctOrientation:true
    }
    return camera_options;
  }

  vOptions(){
    let video_options: CameraOptions = {
       destinationType: this.camera.DestinationType.FILE_URI,
       mediaType: this.camera.MediaType.VIDEO
    }
    return video_options;
  }

  captureVideo(){
    console.log("captureVideo mediaCapture triggered !");
    let options: CaptureVideoOptions = { limit: 3 }
    this.mediaCapture.captureVideo(options).then((data: MediaFile[]) => console.log("captureVideo Data :"+JSON.stringify(data)),
        (err: CaptureError) => console.error("captureVideo Data :"+JSON.stringify(err))
      );

    // let video_options: VideoCapturePlusOptions = {
    //    limit: 1,
    //    highquality: true,
    //    portraitOverlay: 'assets/img/camera/overlay/portrait.png',
    //    landscapeOverlay: 'assets/img/camera/overlay/landscape.png'
    // }

    // this.videoCapturePlus.captureVideo(video_options).then((mediafile) => {
    //   console.log("Response VideoCapturePlus :"+JSON.stringify(mediafile));
    //   this.presentToastWithOptions("videoCapturePlus Working !");
    //   this.files.push({'path' : mediafile[0]["fullPath"] ,
    //     'is_selected' : true,
    //     'is_captured' : false, 
    //     attribute_id : 0, 
    //     'user_defined_name' : this.getName(mediafile[0]["fullPath"])});

    // },(err) => {
    //   this.presentToastWithOptions("VideoCapturePlus Error !");
    //   console.log("Error VideoCapturePlus :"+JSON.stringify(err));
    // });
  }

  assignAttributes(indx){
     let alert = this.alertCtrl.create();
     
     this.attr_assigned = true;

     alert.setTitle('Select Attribute');
     alert.setMessage( this.capitalize(this.navParams.data.category_name) + '-' + this.capitalize(this.navParams.data.subcategory_name) );

     var selected_cat_attributes = [];
     var selected_subcat_attributes = [];

     this.files.forEach( (d,fi) => {
      if( fi !== indx){
        if(d.attribute_id && d.attribute_type == 'cat'){
          selected_cat_attributes.push(d.attribute_id)
        } else  if(d.attribute_id && d.attribute_type == 'subcat'){
          selected_subcat_attributes.push(d.attribute_id)
        }
      }

     });

      this.navParams.data.attributes.categories_attrs.forEach( (d,i)=> {
        if(d.attr_type == 'file' || d.attr_type == 'image'){
          alert.addInput({
            type: 'radio',
            label: d.name,
            value: i + '_cat',
            checked: false,
            disabled: false
            // disabled: selected_cat_attributes.indexOf(d.id) !== -1
          });
        }
      });

      this.navParams.data.attributes.sub_categories_attrs.forEach((d,i)=> {
       if(d.attr_type == 'file' || d.attr_type == 'image'){
        alert.addInput({
          type: 'radio',
          label: d.name,
          value: i + '_subcat',
          checked: false,
          disabled: false
          // disabled: selected_subcat_attributes.indexOf(d.id) !== -1
        });
       }
      });

      alert.addButton('Cancel');

      alert.addButton({
        text: 'Ok',
        handler: (data: any) => {
           var d = data.split('_');

           if(d[1] == 'cat'){

             this.files[indx].attribute_id = this.navParams.data.attributes.categories_attrs[ d[0] ].id;
             this.files[indx].attribute_name = this.navParams.data.attributes.categories_attrs[ d[0] ].name;
             this.files[indx].attribute_type = 'cat';
             this.files[indx].category_attribute_name = this.capitalize(this.navParams.data.category_name) + ' - ' +  this.files[indx].attribute_name ;
           
             if( this.category_files_data[ this.files[indx].attribute_id ] == undefined ){
              this.category_files_data[ this.files[indx].attribute_id ] = []
             }

             this.category_files_data[ this.files[indx].attribute_id ].push(this.files[indx]);

           } else if(d[1] == 'subcat'){
           
             this.files[indx].attribute_id = this.navParams.data.attributes.sub_categories_attrs[ d[0] ].id;
             this.files[indx].attribute_name = this.navParams.data.attributes.sub_categories_attrs[ d[0] ].name;
             this.files[indx].attribute_type = 'subcat';
             this.files[indx].category_attribute_name = this.navParams.data.category_name + ' - ' +  this.files[indx].attribute_name ;

             if( this.subcategory_files_data[ this.files[indx].attribute_id ] == undefined ){
              this.subcategory_files_data[ this.files[indx].attribute_id ] = [];
             }

             this.subcategory_files_data[ this.files[indx].attribute_id ].push(this.files[indx]);

           }
        }
      });

      alert.present(); 
  }

  RemoveAttributes(indx){
     this.attr_assigned = false;

     if(this.files[indx].attribute_type == 'cat'){
     
      delete this.category_files_data[ this.files[indx].attribute_id ];
     
     } else if(this.files[indx].attribute_type == 'subcat'){

      delete this.subcategory_files_data[ this.files[indx].attribute_id ];
    
     }

     this.files[indx].attribute_id = 0;
  }

  addUserDefinedName(i) {
    let alert = this.alertCtrl.create({
      title: 'Enter file name',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.files[i].user_defined_name = data.name;
          }
        }
      ]
    });
    alert.present();
  }


  deleteFile(index){
     if (index > -1) {
          this.files.splice(index, 1);
      }
  }

  //Trigger the uploadMe recursive function.

  uploadQueue(doc_id){

    var i = 0;
    
    Object.keys(this.category_files_data).forEach(d=> {
      this.category_files_data[d].forEach((ci,indx)=> {
        this.ca_f[d+'_'+indx+'_c'] = ci;
      });
    });

    Object.keys(this.subcategory_files_data).forEach(s=> {
      this.subcategory_files_data[s].forEach((si,indx)=> {
        this.ca_f[s+'_'+indx+'_s'] = si;
      });
    });

    var fst = Object.keys(this.ca_f);

    if( fst.length > 0 ){
      var fst_key = fst[i];

      this.Notifications.uploadingToast('Uploading Files');

      this.uploadMe(this.ca_f[fst_key], fst_key.split('_')[i], doc_id, i);
    }

  }

  //Recursively uploads the document

  uploadMe(uri, d, doc_id, i , u = 0 , f = 0  ) {
  
    var keys = Object.keys(this.ca_f);
    var is_cat = keys[i][ keys[i].length - 1 ] == 'c' ? true : false; 
    i = i+1;

    var next = keys[i];
    var current_user = this.session.getUser();
    var fileTransfer:TransferObject = this.transfer.create();

    var params = { 
                   'fileName': this.getName(uri.path) ,
                   'org_user_id' : current_user.user_id ,
                   'org_id' : current_user.user_org_id,
                   'user_defined_name' : uri.user_defined_name,
                   'doc_id' : doc_id,
                   'req_id' : '',
                   'type' : ''
                  }

    if(is_cat){
      params.req_id = d;
      params.type = 'cat';
    } else {
      params.req_id = d;
      params.type = 'subcat';
    } 

    let options: FileUploadOptions = {
              fileKey: 'file',
              fileName: this.getName(uri.path),
              mimeType: "multipart/form-data",
              params : params
            }

      
      fileTransfer.onProgress((progressEvent: any ) => {
            if (progressEvent.lengthComputable) {
                let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                this.Notifications.setToasterContent(u, f, Object.keys(this.ca_f).length, progress)
                this._ngZone.run(() => { console.log('Outside Done!'); });
          }
      });

      fileTransfer.upload( uri.path, config.api_url + 'auth/document_uploads', options)
      .then((data) => {
        u = u + 1;
        this.Notifications.setToasterContent(u, f, Object.keys(this.ca_f).length)
        this._ngZone.run(() => { console.log('Outside Done!'); });
        if(next){
         this.uploadMe(this.ca_f[next], next.split('_')[0], doc_id, i, u , f);
        } else {
          this.Notifications.dismissToaster()
        }

      }, (err) => {
        f = f + 1;
        this.Notifications.setToasterContent(u, f, Object.keys(this.ca_f).length)
        this._ngZone.run(() => { console.log('Outside Done!'); });
        if(next){
         this.uploadMe(this.ca_f[next], next.split('_')[0], doc_id, i, u , f);
        } else {
          this.Notifications.dismissToaster()
        }

      })  

  }

  save(){
    if(this.attr_assigned == true){
      this.Notifications.presentLoader();
      if(this.navParams.data.doc_id){
        this.Notifications.dismissLoader();
        this.uploadQueue(this.navParams.data.doc_id);
        this.navCtrl.push(DocumentsListView,{ id : this.navParams.data.doc_id});
      } else {
          this.DocumentService.create( {  category : this.category_data,
                                          category_id :  this.category_id,
                                          designation :  this.designation,
                                          subcategory_id :  this.subcategory_id,
                                          subcategory : this.subcategory_data,
                                          subcategory_files : this.subcategory_files_data,
                                          tags : this.tags,
                                          category_files : this.category_files_data,
                                          page : this.navParams.get('page'),
                                          request_id : this.navParams.get('request_id') 
                                        } )
        .then(data => {
          this.Notifications.dismissLoader();
          if(data.main_success){
            this.uploadQueue(data.doc_id);
            this.goTo();
          } else {
            this.Notifications.presentToast(data.main_message);
          }
        });
      }
    }
    else{
      this.presentToastWithOptions("Please select category for file !");
    }
  }

  capitalize(str) 
  {     
      if(str.length > 0)
        return str.charAt(0).toUpperCase() + str.slice(1);
  }

  goTo(){
    
    switch( this.navParams.get('page') ){
      
      case 'linked_agenda':
        this.navCtrl.push(CreateLinkedDocument, { task_id : this.navParams.get('request_id') } ); 
      break;

      case 'linked_contact_internal':
        this.navCtrl.push( CreateLinkedDocumentForCI , { contact_id : this.navParams.get('request_id'), row_id: this.navParams.get('row_id') } );
      break;

      case 'linked_contact_external':
        this.navCtrl.push( CreateLinkedDocumentForCE,  { contact_id : this.navParams.get('request_id'), row_id: this.navParams.get('row_id') } );
      break;

      case 'linked_infrastructure':
        this.navCtrl.push( CreateLinkedDocumentForInfrastructure,  { location_id : this.navParams.get('request_id') } );
      break;

      case 'linked_equipment':
        this.navCtrl.push( CreateLinkedDocumentsForEquipments,  { equipment_id : this.navParams.get('request_id') } );
      break;

      default:
        this.navCtrl.push(DocumentsList);        
      break;
    }
  }

  presentToastWithOptions(msg) {
    const toast = this.toastController.create({
      message: msg,
      showCloseButton: true,
      position: 'top',  
      closeButtonText: 'Done'
    });
    toast.present();
  }

}