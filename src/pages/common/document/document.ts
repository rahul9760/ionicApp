import { Component, NgZone } from '@angular/core'; 
import { ViewController, App } from 'ionic-angular';
import { NavController, NavParams, Navbar, ActionSheetController, Platform , AlertController, normalizeURL } from 'ionic-angular';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { FunctionsHelper } from '../../../helpers/functions.helper';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionHelper } from '../../../helpers/session.helper';
import { InfrastructureServiceProvider } from '../../../providers/infrastructure-service/infrastructure-service';
import { DocumentServiceProvider } from '../../../providers/document-service/document-service';
import { DocumentsListView } from '../../documents/documents_list_view/documents_list_view';

import { config } from '../../../app.config';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
// import { VideoCapturePlus, VideoCapturePlusOptions } from '@ionic-native/video-capture-plus';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

declare var FilePicker: any;

@Component({
    selector:"document-create",
    templateUrl: 'document.html',
    providers: [InfrastructureServiceProvider, NotificationsHelper, FunctionsHelper, FileChooser, FilePath]
})

export class CreateDocument {

    public categories: any;
    public subcategories: any;
    public attributes: any = [];
    public document = { category:"", subcategory:"" };
    public category_data: any = {};
    public subcategory_data: any = {};
    public files:any = [];
    public designation:String = '';
    public category_files_data: any = {};
    public subcategory_files_data: any = {};
    public ca_f: any = {};
    public tags:any;

    constructor(
        public navCtrl: NavController,
        public Notifications: NotificationsHelper, 
        public DocumentService: DocumentServiceProvider, 
        public actionSheetCtrl: ActionSheetController,
        public _ngZone: NgZone,
        public platform: Platform,
        public camera: Camera,
        public session: SessionHelper,
        public fileChooser: FileChooser,
        public filePath: FilePath,
        public DomSanitizer: DomSanitizer,
        // public videoCapturePlus: VideoCapturePlus,
        public viewCtrl: ViewController,
        public alertCtrl: AlertController,
        public transfer: Transfer) {
        this.getCategories();

    }

    getCategories(){

        this.Notifications.presentLoader();
        this.DocumentService.getCategories().then(data => {
            this.Notifications.dismissLoader();
            if( data.error == undefined ){
                this.categories = data.categories;
            } else {
                this.Notifications.presentToast('Please Request Again');
            }

        });
    }
    userLang(data,type = 'json'){
        var current_user = this.session.getUser();
        return JSON.parse(data)[current_user.user_lang_id];
    }

    catChange(){
        this.Notifications.presentLoader();
        this.DocumentService.getSubCategories(this.document.category + '').then(data => {
            this.Notifications.dismissLoader();
            if( data.error == undefined ){
                
                this.subcategories = data.subcategories;
            } else {
                this.Notifications.presentToast('Please Request Again');
            }
        });
    }

    subCatChange(){
        this.Notifications.presentLoader();
        this.DocumentService.getAttributes(this.document.category, this.document.subcategory).then(data => {
            this.Notifications.dismissLoader();
            if( data.error == undefined){
                this.attributes = data;
            } else {
              this.Notifications.presentToast('Please Request Again');
            }
        });
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
                    text: 'Video',
                    handler: () => {
                       // this.captureVideo( this.videoOptions() )
                       this.captureVideo()
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
                },
                {
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
                        this.captureImage( this.options(this.camera.PictureSourceType.CAMERA) )
                    }
                },
                {
                    text: 'Video',
                    handler: () => {
                       this.captureImage( this.vOptions() )
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
    }
 
    captureImage(camera_options){
        this.camera.getPicture(camera_options).then((imageData) => {
           this.files.push({'path' : imageData, 
                            'is_selected' : true, 
                            'is_captured' : true, 
                            'user_defined_name' : this.getName(imageData) 
                          });   
        }, (err) => {
            alert(JSON.stringify(err))
        });

    }

    captureVideo(){
        // this.videoCapturePlus.captureVideo(video_options).then((mediafile) => {
        //     this.files.push({'path' : mediafile[0]["fullPath"] ,
        //                'is_selected' : true,
        //                'is_captured' : false, 
        //                 attribute_id : 0, 
        //                'user_defined_name' : this.getName(mediafile[0]["fullPath"])
        //            });

        //     },(err) => { 

        // });
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

  videoOptions(){
    // let video_options: VideoCapturePlusOptions = {
    //    limit: 1,
    //    highquality: true,
    //    portraitOverlay: 'assets/img/camera/overlay/portrait.png',
    //    landscapeOverlay: 'assets/img/camera/overlay/landscape.png'
    // }
    // return video_options;
  }

  vOptions(){
    let video_options: CameraOptions = {
       destinationType: this.camera.DestinationType.FILE_URI,
       mediaType: this.camera.MediaType.VIDEO
    }
    return video_options;
  }

    upload(){

        if(this.platform.is('ios')){

          FilePicker.pickFile( (file) => {

              this.files.push({ 'path' : file, 
                             'is_selected' : true, 
                             'is_captured' : false, 
                             'attribute_id' : 0, 
                             'user_defined_name' : this.getName(file) 
              });
              this._ngZone.run(() => { });

          },(err) => {
              alert(JSON.stringify(err))
          });
          
        } else if(this.platform.is('android')){

            this.fileChooser.open().then(uri => {
            
                var uriArr = uri.split(',');

                uriArr.forEach((u,i) => {

                    this.filePath.resolveNativePath( u ).then(filePath => {

                        this.files.push({ 'path' : filePath, 
                                        'is_selected' : true, 
                                        'is_captured' : false, 
                                        'attribute_id' : 0, 
                                        'user_defined_name' : this.getName(filePath) 
                        });

                    }, (err) => {

                        this.files.push({ 'path' : u,
                                        'is_selected' : true, 
                                        'is_captured' : false, 
                                        'attribute_id' : 0, 
                                        'user_defined_name' : this.getName(u) 
                        });
                    });

                });

            }).catch(e => alert(JSON.stringify(e)) );
        }  
    }
 
    assignAttributes(indx){

      let alert = this.alertCtrl.create();
      
      alert.setTitle('Select Attribute');

      // alert.setMessage( this.capitalize(this.category_data.category_name) + '-' + this.capitalize(this.subcategory_data.subcategory_name) );

      var selected_cat_attributes = [];
      var selected_subcat_attributes = [];
      this.files.forEach( (d,fi) => {
        if( fi !== indx){
          if(d.attribute_id && d.attribute_type == 'cat'){
            selected_cat_attributes.push(d.attribute_id)
          }else if(d.attribute_id && d.attribute_type == 'subcat'){
            selected_subcat_attributes.push(d.attribute_id)
          }
        }
      });
      
      this.attributes.categories_attrs.forEach( (d,i)=> {
        if(d.attr_type == 'file' || d.attr_type == 'image'){
          alert.addInput({
            type: 'radio',
            label: d.name,
            value: i + '_cat',
            checked: false,
            disabled: false
          });
        }
      });

      this.attributes.sub_categories_attrs.forEach((d,i)=> {
        if(d.attr_type == 'file' || d.attr_type == 'image'){
          alert.addInput({
            type: 'radio',
            label: d.name,
            value: i + '_subcat',
            checked: false,
            disabled: false
          });
        }
      });

      alert.addButton('Cancel');

      alert.addButton({
        text: 'Ok',
        handler: (data: any) => {
          var d = data.split('_');

          if(d[1] == 'cat'){

            this.files[indx].attribute_id = this.attributes.categories_attrs[ d[0] ].id;
            this.files[indx].attribute_name = this.attributes.categories_attrs[ d[0] ].name;
            this.files[indx].attribute_type = 'cat';
            // this.files[indx].category_attribute_name = this.capitalize(this.category_data.category_name) + ' - ' +  this.files[indx].attribute_name;
           
            if( this.category_files_data[ this.files[indx].attribute_id ] == undefined ){
              this.category_files_data[ this.files[indx].attribute_id ] = []
            }

            this.category_files_data[ this.files[indx].attribute_id ].push(this.files[indx]);

          } else if(d[1] == 'subcat'){
           
            this.files[indx].attribute_id = this.attributes.sub_categories_attrs[ d[0] ].id;
            this.files[indx].attribute_name = this.attributes.sub_categories_attrs[ d[0] ].name;
            this.files[indx].attribute_type = 'subcat';
            // this.files[indx].category_attribute_name = this.category_data.category_name + ' - ' +  this.files[indx].attribute_name;

            if( this.subcategory_files_data[ this.files[indx].attribute_id ] == undefined ){
              this.subcategory_files_data[ this.files[indx].attribute_id ] = []
            }

            this.subcategory_files_data[ this.files[indx].attribute_id ].push(this.files[indx]);

          }
          console.log(this.files.length);
        }

      });
      
      alert.present(); 

    } 

    capitalize(str) 
    {     
      if(str.length > 0){
        return str.charAt(0).toUpperCase() + str.slice(1); 
      }
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }
 
    RemoveAttributes(indx){
     
     if(this.files[indx].attribute_type == 'cat'){
     
      delete this.category_files_data[ this.files[indx].attribute_id ];
     
     } else if(this.files[indx].attribute_type == 'subcat'){

      delete this.subcategory_files_data[ this.files[indx].attribute_id ];
    
     }

     this.files[indx].attribute_id = 0;
  }

  save(){
    this.Notifications.presentLoader();

    // if(this.navParams.data.doc_id){
      // this.Notifications.dismissLoader();
      // this.uploadQueue(this.navParams.data.doc_id);
      // this.navCtrl.push(DocumentsListView,{ id : this.navParams.data.doc_id});
    // } else {
        
        this.DocumentService.create( {  category : this.category_data,
                                        category_id :  this.document.category,
                                        designation :  this.designation,
                                        subcategory_id :  this.document.subcategory,
                                        subcategory : this.subcategory_data,
                                        subcategory_files : this.subcategory_files_data,
                                        tags : this.tags,
                                        category_files : this.category_files_data,
                                        page : "",
                                        request_id : "" 
                                      } )
      .then(data => {
        this.Notifications.dismissLoader();
        if(data.main_success){
          this.uploadQueue(data.doc_id);
          this.navCtrl.push(DocumentsListView);
        } else {
          this.Notifications.presentToast(data.main_message);
        }
      });
    // }
   
  }

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
          this.Notifications.dismissToaster();
        }

      }, (err) => {
        f = f + 1;
        this.Notifications.setToasterContent(u, f, Object.keys(this.ca_f).length);
        this._ngZone.run(() => { console.log('Outside Done!'); });
        if(next){
         this.uploadMe(this.ca_f[next], next.split('_')[0], doc_id, i, u , f);
        } else {
          this.Notifications.dismissToaster();
        }

      })  

  }

}