import { Component , Input, NgZone} from '@angular/core';
import { ActionSheetController, NavParams, NavController, Platform, AlertController } from 'ionic-angular';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { DocumentServiceProvider } from '../../../providers/document-service/document-service';

import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';
import { FunctionsHelper } from '../../../helpers/functions.helper';

import { config } from '../../../app.config';

import { DocumentsListInfo } from "../documents_list_info/documents_list_info";
import { Uploading } from '../documents_create/uploading/uploading';
import { Events } from 'ionic-angular';

//Components imported for linking

import { LinkedAgendaWithDocuments } from "../links/agenda/agenda";
import { LinkedContactExternalWithDocuments } from "../links/contact_external/contact_external";
import { LinkedInfrastructureWithDocuments } from "../links/infrastructure/infrastructure";
import { LinkedContactInternalWithDocuments } from "../links/contact_internal/contact_internal";
import { LinkedEquipmentWithDocuments } from "../links/equipments/equipments";
import { LinkedDocumentWithDocuments } from "../links/documents/documents";
 
declare var cordova;
declare var document;


@Component({
  selector: 'page-list-documents-view',
  templateUrl: 'documents_list_view.html',
  providers: [DocumentServiceProvider,
              FileTransfer,
              FileTransferObject,
              File,
              SocialSharing,
              FunctionsHelper,
              NotificationsHelper]
})

export class DocumentsListView {

  private document_id: number;
  private data: any = {};
  private current_user: any;
  private document: any;
  private catFiles: String[];
  private subFiles: String[];
  private image: String;
  private inAppBrowserRef:any;
  private selectedFiles:any;
  private selected_org_id:any;
  private rename:any = { cat: {}, subcat: {} } ;
  private is_renamed:any = false;

  private is_loading: Boolean = false;
  private is_downloading: Boolean = false;
  private is_hold: Boolean = false;
  private reload:  Boolean = false;
  private show_selected:  Boolean = false;
  
  private can_read:  Boolean = false;
  private can_update:  Boolean = false;
  private can_download:  Boolean = false;
  private can_share:  Boolean = false;

  private loader_value: String = '0%';
  private downloaded:  String = '0%';
  private view:  String = 'normal';
  
  @Input('progress') progress = "30";

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private params: NavParams,
    private _ngZone: NgZone,
    private alertCtrl: AlertController,
    private DocumentService: DocumentServiceProvider,
    private Notifications: NotificationsHelper,
    private navCtrl: NavController,
    private photoViewer: PhotoViewer,
    private fns: FunctionsHelper, 
    private session: SessionHelper,
    private transfer: FileTransfer,
    private file: File,
    private platform: Platform,
    public events: Events,
    private socialSharing: SocialSharing) {
      
    this.document_id = this.params.get('id')
    this.selected_org_id = this.params.get('org_id')
    this.current_user = this.session.getUser()
    this.loadVars();
    // this.loadPermissions(); // need to work

    var self = this;
    events.subscribe('back:clicked', function(){
      self.getDocument();
    });

  }


  ngOnInit(){
     this.getDocument();
  }

  loadVars(){
    this.rename = { cat: {}, subcat: {} } ;
    this.selectedFiles = {};
    this.is_hold = false;
    this.show_selected = false;
  }

  selectFiles(){
    this.is_hold = true;
  }

  goToInfo(){
    this.navCtrl.push(DocumentsListInfo, this.params.data);
  }

  have_data(glue,type){
    
    if(type == 'cat'){
      return this.data.cat_attrs_files[glue].length > 0; 
    } else if(type == 'subcat'){
      return this.data.sub_cat_attrs_files[glue].length > 0; 
    }
  }
  
  setLoader(val){
    this.loader_value = val;
  }

  reloadMe(){ 
    this.getDocument();
  }

  shareDocuments(){

    var cat_files = []
    
    Object.keys(this.selectedFiles['cat']).forEach( (ck) => {
      console.log(this.selectedFiles['cat'][ck])
      
      Object.keys(this.selectedFiles['cat'][ck]).forEach( (d,ind) => {
        if(d){
          var file = this.data.cat_files[ck][ind];
          var url = config.api_url + 'documents/download?fileName=' + file.name + '&token=' + this.session.getToken() + '&type=documents&org_id=' + this.selected_org_id;
          cat_files.push(url);
        }
      });

    });

    var sub_cat_files = []
    Object.keys(this.selectedFiles['subcat']).forEach( (ck) => {
      
      Object.keys(this.selectedFiles['subcat'][ck]).forEach( (d,ind) => {
        if(d){
          var file = this.data.sub_cat_files[ck][ind];
          var url = config.api_url + 'documents/download?fileName=' + file.name + '&token=' + this.session.getToken() + '&type=documents&org_id=' + this.selected_org_id;
          sub_cat_files.push(url);
        }
      });

    });

    var urls = cat_files.concat(sub_cat_files);


    this.Notifications.presentLoader()

    this.socialSharing.share('VelvetFM', 'VelvetFM Document Transfer', urls, '').then(() => {
       this.Notifications.dismissLoader()
       this.getDocument();
    }).catch(() => {
      this.Notifications.dismissLoader()
    });

  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getDocument();
      refresher.complete();
    }, 2000);
  }
  
  getDocument(){
      this.loadVars();
      this.Notifications.presentLoader();
      this.DocumentService.getDocument(this.document_id, this.selected_org_id )
      .then(data => {
        this.Notifications.dismissLoader();
        this.reload = false;
        if( data.error == undefined) {
          this.document = data;
          this.data = data;

          console.log("Document Res:",this.data);
          
         // this.catFiles = Object.keys(data.cat_files);
          
          this.catFiles = Object.keys(data.cat_files).filter(function(key) {
                               return data.cat_files[key].length > 0;
                          });

          this.selectedFiles['cat'] = {};

          Object.keys(data.cat_files).forEach( (ck) => {
            this.selectedFiles['cat'][ck] = {};
           
            data.cat_files[ck].forEach( (d,ind) => {
              this.selectedFiles['cat'][ck][ind] = false;
            });

          });

          this.selectedFiles['subcat'] = {};
         
          Object.keys(data.sub_cat_files).forEach( (sck) => {
            
            this.selectedFiles['subcat'][sck] = {};
            data.sub_cat_files[sck].forEach( (d,ind) => {
              this.selectedFiles['subcat'][sck][ind] = false;
            });

          });

         // this.subFiles = Object.keys(data.sub_cat_files);
         
          this.subFiles = Object.keys(data.sub_cat_files).filter(function(key) {
                                return data.sub_cat_files[key].length > 0;
                         });
         
         // console.log(this.selectedFiles);
         this.show_selected = true; 

        } else {
          this.reload = true;
          this.Notifications.presentToast('Timeout error');
        }
      });
  }

  openDoc(obj, ck , ind, type) {

    if( obj != undefined  && !this.is_renamed ){

      if( this.is_hold ) {

        var ccount = 0;
     
        this.selectedFiles[type][ck][ind] = !this.selectedFiles[type][ck][ind];

        Object.keys(this.data.cat_files).forEach( (ck) => {
          
          this.data.cat_files[ck].forEach( (d,ind) => {
            
            if(this.selectedFiles['cat'][ck][ind]){
              ccount++;
            }

          });

        });

        var scount = 0;

        Object.keys(this.data.sub_cat_files).forEach( (sk) => {
          
          this.data.sub_cat_files[sk].forEach( (d,ind) => {
            
            if(this.selectedFiles['subcat'][sk][ind]){
              scount++;
            }

          });

        });
        
        var count = ccount + scount

        if( count == 0 ){
          this.is_hold = false;
        }

      } else {

        this.is_loading = true;

        var interval;
        var ext = obj.name.split('.')[1]
        var url = config.base_url + 'usr_files/' + obj.path + obj.name
        var public_url = config.api_url + 'documents/download?fileName=' + obj.name + '&token=' + this.session.getToken() + '&type=documents';
        var target = '_blank'
        var options = 'location=no,clearsessioncache=yes,clearcache=yes'
        var res = {
                  url : url,
                  type : 'othr',
                  ext : '',
                  file_name : obj.name,
                  document_id: this.document_id,
                  request_type:'view',
                  org_id: this.selected_org_id
          }

        var plt = '';
        if(this.platform.is('ios')){
          plt = 'ios'
        } else if(this.platform.is('android')){
          plt = 'android'
        } else {
          plt = 'windows'
        }

        switch(ext){

          case 'jpg':
          case 'png':
          case 'jpeg':
          case 'gif':
          case 'bmp':
           
            this.Notifications.dismissLoader();
            this.is_loading = false;
            public_url += "&org_id=" + this.selected_org_id;
            console.log(public_url)
            this.photoViewer.show(public_url);
            
            break;
            
          case 'pdf':

            this.Notifications.dismissLoader();
            this.is_loading = false;
            public_url = config.api_url + 
                             'documents/view_google_docs?url=' 
                             + url + '&token=' 
                             + this.session.getToken() 
                             +'&platform=' + plt  
                             + '&type=document';
            console.log(public_url);
            this.inAppBrowserRef = cordova.InAppBrowser.open(public_url , target, options);
            this.loader_value = '0%';
            

            this.inAppBrowserRef.addEventListener('loadstart', () => {
            });

            this.inAppBrowserRef.addEventListener('loadstop', () => {
            });

            this.inAppBrowserRef.addEventListener('loaderror', () => {
              this.inAppBrowserRef.close();
              this.Notifications.presentToast('Please try again');
            });

            break;

          case 'ppt':
          case 'pptx':
            res.ext = 'pptx'
            let element_a = document.getElementsByTagName('body')[0];
            element_a.className += 'stop-scroll';

            interval = setInterval(() => {
              this.DocumentService.viewDocumentStep(res)
              .then(data => {
                if(data.message !== ' '){
                  this.loader_value = data.message;
                }
              });
            }, 2000);
            

            this.DocumentService.viewDocument(res)
            .then(data => {
              clearInterval(interval);
              this.loader_value = '100%';
              setTimeout( () => {
                
                this.stopLoader()
                var public_url = config.api_url 
                                 + 'documents/view_google_docs?url=' 
                                 + data.file_url + '&token=' 
                                 + this.session.getToken()  
                                 +'&platform=' 
                                 + plt   
                                 +'&org_id=' + this.selected_org_id
                                 + '&type=document';

                this.inAppBrowserRef = cordova.InAppBrowser.open(public_url , target, options);
                this.loader_value = '0%';


                this.inAppBrowserRef.addEventListener('loadstart', () => {
                });

                this.inAppBrowserRef.addEventListener('loadstop', () => {
                });

                this.inAppBrowserRef.addEventListener('loaderror', () => {
                  this.inAppBrowserRef.close();
                  this.Notifications.presentToast('Please try again');
                });

              }, 2000);
            });

            break;

          case 'xls':
          case 'xlsx':
            res.ext = 'xlsx'

            let element_b = document.getElementsByTagName('body')[0];
            element_b.className += 'stop-scroll';

            interval = setInterval(() => {
              this.DocumentService.viewDocumentStep(res)
              .then(data => {
                 if(data.message !== ' '){
                   this.loader_value = data.message;
                 }
              });
            }, 1000);

            this.DocumentService.viewDocument(res)
            .then(data => {
              clearInterval(interval);
              this.loader_value = "100%";
             

              setTimeout( () => {

                this.stopLoader()
                var public_url = config.api_url 
                                + 'documents/view_google_docs?url=' 
                                + data.file_url + '&token=' 
                                + this.session.getToken()  
                                + '&platform=' + plt 
                                + '&org_id=' + this.selected_org_id 
                                + '&type=document';
                             
                this.inAppBrowserRef = cordova.InAppBrowser.open(public_url , target, options);
                this.loader_value = '0%';

                this.inAppBrowserRef.addEventListener('loadstart', () => {
                });

                this.inAppBrowserRef.addEventListener('loadstop', () => {
                });

                this.inAppBrowserRef.addEventListener('loaderror', () => {
                  alert('error')
                  this.inAppBrowserRef.close();
                  this.Notifications.presentToast('Please try again');
                });


              }, 2000);
            });

            break;

          case 'doc':
          case 'docx':
            res.ext = 'docx'

            var b = document.getElementsByTagName('body')[0];
            b.className += 'stop-scroll';

            interval = setInterval(() => {
              this.DocumentService.viewDocumentStep(res)
              .then(data => {
                 if(data.message !== ' '){
                   this.loader_value = data.message;
                 }
              });
            }, 1000);

            this.DocumentService.viewDocument(res)
            .then(data => {
              clearInterval(interval);
              this.loader_value = "100%";
              setTimeout( () => {

                this.stopLoader()

                public_url = config.api_url 
                                 + 'documents/view_google_docs?url=' 
                                 + data.file_url + '&token=' 
                                 + this.session.getToken()  
                                 +'&platform=' + plt 
                                 +'&org_id=' + this.selected_org_id 
                                 + '&type=document';
                

                this.inAppBrowserRef = cordova.InAppBrowser.open( public_url , target, options);
                this.loader_value = '0%';

                this.inAppBrowserRef.addEventListener('loadstart', () => {
                });

                this.inAppBrowserRef.addEventListener('loadstop', () => {
                });

                this.inAppBrowserRef.addEventListener('loaderror', () => {
                  this.inAppBrowserRef.close();
                  this.Notifications.presentToast('Please try again');
                });

              }, 2000);
            });
            
            break;

          case 'mp4':
          case '3gp':
          case 'flv':
          case 'avi':
          case 'MOV':
          case 'wmv':
            
            options += ',zoom=no'
            this.is_loading = false;
            public_url = config.api_url + 'documents/view_google_docs?token=' + this.session.getToken()  +'&platform=' + plt + '&url='+ url + '&type=video&fileName=' + obj.name + '&org_id=' + this.selected_org_id ;

            this.inAppBrowserRef = cordova.InAppBrowser.open( public_url , target, options);
            
            //this.navCtrl.push(Media, {url : public_url, type : 'video', file : obj} )


            break;

          case 'mp3':

            this.is_loading = false;
            public_url = config.api_url + 'documents/view_google_docs?token=' + this.session.getToken()  +'&platform=' + plt + '&url='+ url + '&type=audio&fileName=' + obj.name + '&org_id=' + this.selected_org_id;

            this.inAppBrowserRef = cordova.InAppBrowser.open( public_url , target, options);
            //this.navCtrl.push(Media, {url : url, type : 'video', file : obj} )

            break;

          default:
            this.is_loading = false;
            this.Notifications.dismissLoader();
            break;
        }
      }
      
    }

  }

  getExt(obj) {

    if( obj  != undefined ){
      var ext = obj.name.split('.')[1]
      var public_url;

      switch(ext){

        case 'pdf':
 
          this.image = 'assets/img/new_pdf.png';
          break;

        case 'ppt':
        case 'pptx':

          this.image = 'assets/img/new_ppt.png';
          break;

        case 'doc':
        case 'docx':

          this.image = 'assets/img/new_word.png';
          break;

        case 'xls':
        case 'xlsx':

          this.image = 'assets/img/new_xls.png';
          break;

        case 'mp3':

          this.image = 'assets/img/new_mp3.png';
          break;

        case 'zip':

          this.image = 'assets/img/new_zip.png';
          break;

        case 'mp4':
        case '3gp':
        case 'flv':
        case 'avi':
        case 'mov':
        case 'MOV':
        case 'wmv':

          public_url = config.api_url + 'documents/download?fileName=' + obj.name + '&token=' + this.session.getToken() + '&type=documents&thumb=1&org_id=' + this.selected_org_id;
          this.image = public_url;
          break;
          
        case 'jpg':
        case 'png':
        case 'jpeg':
        case 'gif':
        case 'bmp':
        case 'jpg':
          
          public_url = config.api_url + 'documents/download?fileName=' + obj.name + '&token=' + this.session.getToken() + '&type=documents&thumb=1&org_id=' + this.selected_org_id;
          this.image = public_url;

          break;
          
        default:
          
          this.image = 'assets/img/new_txt.png';
          break;
          
      }
    }

    return this.image
  }

  stopLoader(){
    this.is_loading = false;
     var body = document.getElementsByTagName('body')[0];
     body.className = '';
  }

  
  loadPermissions() {
    
    if(this.selected_org_id){
      if(parseInt(this.params.get('permission').can_read)){
        this.can_read = true
      }

      if(parseInt(this.params.get('permission').can_update)){
        this.can_update = true
      }

      if(parseInt(this.params.get('permission').can_download)){
        this.can_download = true
      }

      if(parseInt(this.params.get('permission').can_share)){
        this.can_share = true
      }
    } else {
      this.can_read = true;
      this.can_update = true;
      this.can_download = true;
      this.can_share = true
    }

  }

  transferDoc(obj){
    if(this.can_share){
      var url = config.api_url + 'documents/download?fileName=' + obj.name + '&token=' + this.session.getToken() + '&type=documents';
      this.Notifications.presentLoader();
      this.socialSharing.share('VelvetFM', 'VelvetFM Document Transfer', url, '').then(() => {
         this.Notifications.dismissLoader();
      }).catch(() => {
        this.Notifications.dismissLoader();
      });
    } else {
      this.Notifications.presentToast('You do not have permission to share the document',4000,'error-toaster');
    } 

  }

  download(obj) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const  url = config.api_url + 'documents/download?fileName=' + obj.name + '&token=' + this.session.getToken() + '&type=documents';
 
    this.Notifications.presentLoader();

    fileTransfer.download(url, this.file.dataDirectory + obj.name ).then((entry) => {
      this.socialSharing.share('VelvetFM', 'VelvetFM Document Transfer', entry.toURL(), '').then(() => {
         this.Notifications.dismissLoader();
      }).catch(() => {
        this.Notifications.dismissLoader();
      });

    }, (error) => {
       this.Notifications.presentToast('error');
    });
  }

  downloadDoc(obj) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const  url = config.api_url + 'documents/download?fileName=' + obj.name + '&token=' + this.session.getToken() + '&type=documents';
   
    this.is_downloading = true;


    fileTransfer.onProgress((progressEvent: any ) => {
          if (progressEvent.lengthComputable) {
              var progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              this.downloaded = progress + '%';
              this._ngZone.run(() => { console.log('Outside Done!'); });
        }
    });

    fileTransfer.download(url, this.file.externalDataDirectory + obj.name ).then((entry) => {
      this.is_downloading = false;
      this.Notifications.presentToast('Downloaded Successfully : ' + this.file.dataDirectory + obj.name)
      this._ngZone.run(() => { console.log('Outside Done!'); });
    }, (error) => {
       this.is_downloading = false;
       this.Notifications.presentToast('Download Failed');
       this._ngZone.run(() => { console.log('Outside Done!'); });
    });
  }

  goToList(){
    this.navCtrl.push(DocumentsListInfo, {
      id: this.document_id
    });
  }

  deleteDocument(){


      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to delete this document?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: 'Ok',
            handler: () => {
                this.Notifications.presentLoader();
                this.DocumentService.deleteFiles(this.document_id, this.selectedFiles, this.selected_org_id )
                .then(res => {
                  this.Notifications.dismissLoader();
                  if(res.status){
                     this.Notifications.presentToast('Deleted Successfully');
                     this.getDocument();
                  } else {
                     this.Notifications.presentToast(res.message);
                  }
                }, err => {
                  this.Notifications.dismissLoader();
                });
            }
          }
        ]
      });
      alert.present();

  }

  deleteFile(obj, file_id, type, indx){
     this.show_selected = false; 
     let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to delete this document?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: 'Ok',
            handler: () => {
                this.Notifications.presentLoader();
                this.DocumentService.deleteFile(this.document_id, file_id, type, indx)
                .then(res => {
                  this.Notifications.dismissLoader();
                  if(res.status){       
                     this.Notifications.presentToast('Deleted Successfully');
                     this.getDocument();
                  } else {
                     this.Notifications.presentToast(res.message);
                  }
                }, err => {
                  this.Notifications.dismissLoader();
                });
            }
          }
        ]
      });
      alert.present();

  }

  renameFile(obj, file_id, type, indx){

    let request_id = type == 'cat' ? obj.cat_id : obj.sub_cat_id;

    if(!this.rename[type][request_id]){
      this.rename[type][request_id] = {} 
    }

    this.rename[type][request_id][indx] = { value: true , name: obj.user_defined_name || obj.name };
    this.is_renamed = true
    console.log(this.rename[type][request_id][indx]);
  }

  canRename(obj, indx, type){
    
    let request_id = type == 'cat' ? obj.cat_id : obj.sub_cat_id;
    
    if(this.rename[type][request_id] && this.rename[type][request_id][indx]){
      return this.rename[type][request_id][indx]['value'];
    } else {
      return false;
    }

  }

  renameFiles(){

    this.Notifications.presentLoader();
    this.DocumentService.renameFiles(this.rename, this.data.id)
    .then(res => {
      this.Notifications.dismissLoader();
      if(res.status){       
         this.Notifications.presentToast('Updated Successfully');
         this.getDocument();
         this.is_renamed = false;
      } else {
         this.Notifications.presentToast(res.message);
      }
    }, err => {
      this.Notifications.dismissLoader();
    });
  }

  getRenamedName(obj, indx){
    
    if(this.rename['cat'][obj.cat_id] && this.rename['cat'][obj.cat_id][indx]){
      return this.rename['cat'][obj.cat_id][indx]['name']
    } else {
      return ''
    }

  }

  pressEvent(event, ck, i, type){
    this.is_hold = true;
    this.selectedFiles[type][ck] = this.selectedFiles[type][ck] ? this.selectedFiles[type][ck] : {} 
    this.selectedFiles[type][ck][i] = true;
  }

  presentActionSheet(obj, id, type, indx) {

      var options = [];

      // let not_viewable_exts = ['zip','apk','ipa','bat','rar'  ]

      let extension = this.getExtByPath(obj.name);


      if( extension !== 'zip' ) {
        options.push({
                      text: 'View',
                      handler: () => {
                        this.openDoc(obj, id , indx, type);
                    }
                  });
      } 

      if(!this.platform.is('ios')){ 
        if(!this.selected_org_id){
            options.push({
                  text: 'Download',
                  handler: () => {
                    this.downloadDoc(obj);
                }
              });
        } else {
          if( this.params.get('permission') && parseInt(this.params.get('permission').can_download ) ){
              options.push({
                    text: 'Download',
                    handler: () => {
                      this.downloadDoc(obj);
                  }
                });
            } 
        }
      }

      if(!this.selected_org_id){
         options.push({
                        text: 'Delete',
                        role : 'destructive',
                        handler: () => {
                          this.deleteFile(obj, id, type, indx);
                        }
                  });
      }


      options.push({
                      text: 'Rename',
                      handler: () => {
                        this.renameFile(obj, id, type, indx);
                      }
                  });



      options = options.concat([{
                      text: 'External Share',
                      handler: () => {
                        this.transferDoc(obj);
                      }
                  },{
                  text: 'Cancel',
                  role: 'cancel'
              }]);

      let actionSheet = this.actionSheetCtrl.create({
          title: 'Choose one option',
          buttons: options
    });
    actionSheet.present();
  }

  loadStartCallBack() {
    this.Notifications.presentLoader();
  }

 loadStopCallBack() {
   this.Notifications.dismissLoader();
  }

  getExtByPath(n){
    return n.split('.')[1];
  }


  check_type(n, type){
    let ext = this.getExtByPath(n);

    let videoExt = ['mp4','mov','3gp','flv']

    if( videoExt.indexOf(ext) !== -1 && type == 'video'){
      return true
    } else {
      return false
    }
     
  }

 loadErrorCallBack(params) {
      this.Notifications.presentToast('Sorry we cannot open that page. Message from the server is : ' + params.message );
      this.inAppBrowserRef.close();
  }

  uploadActionSheet() {
      if(this.selected_org_id > 0){
        if(parseInt(this.params.get('permission').can_update)){

          this.navCtrl.push(Uploading,{ attributes : { categories_attrs : this.data.categories_attrs , sub_categories_attrs : this.data.sub_categories_attrs } ,
                                      category_id :  this.data.category_id,
                                      category_name :  this.data.cat_name,
                                      subcategory_name :  this.data.sub_cat_name,
                                      subcategory_id :  this.data.subcategory_id,
                                      designation : this.data.designation,
                                      doc_id : this.data.id
                                  });
        } else {
          this.Notifications.presentToast('You do not have permission to upload the document',4000,'error-toaster');
        } 
      } else {

        this.navCtrl.push(Uploading,{ attributes : { categories_attrs : this.data.categories_attrs , sub_categories_attrs : this.data.sub_categories_attrs } ,
                                    category_id :  this.data.category_id,
                                    category_name :  this.data.cat_name,
                                    subcategory_name :  this.data.sub_cat_name,
                                    subcategory_id :  this.data.subcategory_id,
                                    designation : this.data.designation,
                                    doc_id : this.data.id
                                  });
      }
  }

  ByteToMb(size){
    return Math.round( (size/100000) * 10 ) / 10;
  }  

  link(type){
    
    switch(type){

          case 'document':
            this.navCtrl.push(LinkedDocumentWithDocuments, { document_id : this.document_id })
          break;

          case 'agenda':
            this.navCtrl.push(LinkedAgendaWithDocuments, { document_id : this.document_id })
          break;

          case 'contact_external':
            this.navCtrl.push(LinkedContactExternalWithDocuments, { document_id : this.document_id })
          break;

          case 'contact_internal':
            this.navCtrl.push(LinkedContactInternalWithDocuments, { document_id : this.document_id })
          break;

          case 'infrastructure':
            this.navCtrl.push(LinkedInfrastructureWithDocuments, { document_id : this.document_id })
          break;

          case 'equipment':
            this.navCtrl.push(LinkedEquipmentWithDocuments, { document_id : this.document_id })
          break;
           
    }
    
  }

}
