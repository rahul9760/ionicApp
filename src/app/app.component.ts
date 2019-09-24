//PLUGINS
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FCM } from '@ionic-native/fcm';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

//SCREEN COMPONENTS
import { Dashboard } from '../pages/dashboard/dashboard';
import { ProfilePage } from '../pages/profile/profile';
import {Login1Page} from '../pages/login/login1/login1';
import {Login2Page} from '../pages/login/login2/login2';
import { Screen1 } from '../pages/documents/documents_create/screen1/screen1';
import { DocumentsList } from '../pages/documents/documents_list/documents_list';
import { Notifications } from '../pages/notifications/notifications';
import { Settings } from '../pages/settings/settings';
import { Infrastructure } from '../pages/infrastructure/list/list';
import { Equipments } from '../pages/equipments/list/list';
import { EquipmentsMenu } from '../pages/equipments/menu/menu';
import { EquipmentsSearch } from '../pages/equipments/search/search';
import { Agenda } from '../pages/agenda/list/list';
import { AgendaDescription } from '../pages/agenda/show/show';
import { Tags } from '../pages/tags/list/list';
import { SearchUsers } from '../pages/search_users/list/list';
import { ContactExternal } from '../pages/contact/external/list/list';
import { ContactInternal } from '../pages/contact/internal/list/list';

//HELPERS & PROVIDERS
import { GlobalVarsProvider } from '../providers/global-vars/global-vars';
import { SessionHelper } from '../helpers/session.helper';
import { NotificationsHelper } from '../helpers/notifications.helper';
import { config } from '../app.config';
  
declare var window;

@Component({
  templateUrl: 'app.html',
  providers: [
              GlobalVarsProvider,
              Transfer,
              Network,
              FilePath,
              FCM
            ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  // rootPage: any = Login1Page;
  rootPage: any = Dashboard;
  token: String = '12';
  api_url: String = config.api_url
  pages: Array<{title: string, component: any, icon : string, type : string, submenu: boolean, submenus: any }>;
  profile =  { component: ProfilePage , type : 'profile' }
  privatePages: Array<{title: string, component: any, icon : string, type : string}>;
  public current_user: any;
  // public disconnectSubscription: any;
  public connectSubscription: any;
  public connected: any;
  public disconnected: any;
  public fileTransfer: TransferObject = this.transfer.create();
  public submenu:boolean = false;

  constructor(
      public app: App,
      public platform: Platform,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public globalVars: GlobalVarsProvider, 
      public sessionHelper: SessionHelper, 
      public Notification: NotificationsHelper,
      public network: Network, 
      public transfer: Transfer, 
      public file: File, 
      private fcm: FCM,
      public filePath: FilePath,
      public events: Events ) {
      
    // if( this.sessionHelper.isLoggedIn() ) {
    //   this.rootPage = Dashboard;
    // } else {
    //   if( !this.sessionHelper.getLastUser() ){
    //     this.rootPage = Login2Page;
    //   }
    // }

    if( !this.sessionHelper.getLastUser() ) {
      this.rootPage = Login2Page;
    }

    this.internetConnection();
    this.current_user = this.sessionHelper.getUser();
    this.platformIsReady();
       
  }

  platformIsReady(){
     this.sessionHelper.setUrl()
     this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        // this.hideSplashScreen();
        this.initVars();
        this.InitEvents();
        
        if( this.sessionHelper.isLoggedIn() ) {
          this.initializeApp();
          this.token = this.sessionHelper.getToken();
          this.current_user = this.sessionHelper.getUser();
        }
    });
  }

  // hideSplashScreen() {
  //   if (Splashscreen) {
  //     setTimeout(() => {
  //       Splashscreen.hide();
  //     }, 100);
  //   }
  // }

  internetConnection(){
    this.network.onDisconnect().subscribe(() => {
      this.Notification.presentToast('Network was disconnected');
    });
  }

  initializeApp() {
    this.initFcm();

    if(window.plugins !== undefined){
      this.initAndroidIntent()
      this.initiOSIntent()
    }
  }

  openPage(page) {
    if(page.type == 'equipment'){
      this.submenu = !this.submenu ;
      return false;
    } else if(page.type == 'logout'){
       this.sessionHelper.clearSession();
    }

    this.goTo(page.component, { logout: true })
  }

  openSubPage(page) {
    this.goTo(page.component)
  }

  initFcm(){
    if (!this.platform.is('cordova')) {
      return false;
    }
    
    this.fcm.getToken().then(token=> {
     this.sessionHelper.setFcmToken(token);
    })

    this.fcm.onNotification().subscribe(data=>{
      this.events.publish('reset:notifications');
      
      if(data.wasTapped){
        this.goTo(Notifications)
      } else {
        this.Notification.presentToast(data.message)
      };

    })

  }

  goTo(state, params = {}){
    this.app.getRootNav().push( state , params )
  }

  initAndroidIntent(){
    window.plugins.intentShim.registerBroadcastReceiver({
      filterActions: [
          'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION'
          ]
      },
      function(intent) {
      }
    );

    window.plugins.intentShim.getIntent( (intent) => {
        this.redirections(intent);
        this.setItems(intent.clipItems);

        if( null !== this.sessionHelper.getToken() ) {
          this.rootPage = Screen1;
        }
        
    }, function(){

    });

  }

  initiOSIntent() {
    window.handleOpenURL = (url) =>  {
      window.localStorage.setItem('url', JSON.stringify([url]) );
      
      if( null !== this.sessionHelper.getToken() ) {
        this.rootPage = Screen1;
      }

      window.resolveLocalFileSystemURI (
          url, 
          function (fileEntry) {
              fileEntry.file (
                  function (file) {
                     
                  },
                  function (error) {
                      console.log (error);
                  }
              )
          }, 
          function (error) {
              console.log(error);
          }
      )
    };
  }

  redirections(intent){
    if(intent.extras){
      switch(intent.extras.routes){
        case 'agenda':
          this.goTo( AgendaDescription, { id : intent.extras.request_id });

        break;
      }
    }
  }

  initVars(){
    // used for an example of ngFor and navigation
    this.pages = [
                   {
                      title:'Dashboard',
                      component:Dashboard,
                      icon:'speedometer',
                      type:'dashboard',
                      submenu: false,
                      submenus: []
                   },
                   {
                      title:'Requests',
                      component:SearchUsers,
                      icon:'people',
                      type:'agenda',
                      submenu: false,
                      submenus: []
                   },
                   {
                      title:'Search',
                      component:Infrastructure,
                      icon:'search',
                      type:'search',
                      submenu: false,
                      submenus: []
                   },
                   {
                      title:'Infrastructure',
                      component:Infrastructure,
                      icon:'grid',
                      type:'infrastructure',
                      submenu: false,
                      submenus: []
                   },
                   {
                      title:'Equipment',
                      component:EquipmentsMenu,
                      icon:'cube',
                      type:'equipment',
                      submenu: true,
                      submenus: [ {
                          title:'Search by last level',
                          component:EquipmentsMenu,
                          icon:'albums',
                          type:'equipment',
                        }, {
                          title:'Structure',
                          component:Equipments,
                          icon:'git-merge',
                          type:'equipment',
                        }, {
                          title:'Search',
                          component:EquipmentsSearch,
                          icon:'search',
                          type:'equipment',
                        } ]
                   },
                   {
                      title:'Contact Internal',
                      component:ContactInternal,
                      icon:'contacts',
                      type:'contact_internal',
                      submenu: false,
                      submenus: []
                   },
                   {
                      title:'Contact External',
                      component:ContactExternal,
                      icon:'contacts',
                      type:'contact_external',
                      submenu: false,
                      submenus: []
                   },
                   {
                      title:'Documents',
                      component:DocumentsList,
                      icon:'document',
                      type:'document',
                      submenu: false,
                      submenus: []
                   },
                   {
                      title:'Agenda',
                      component:Agenda,
                      icon:'calendar',
                      type:'agenda',
                      submenu: false,
                      submenus: []
                   },
                   {
                      title:'Settings',
                      component:Settings,
                      icon:'settings',
                      type:'settings',
                      submenu: false,
                      submenus: []
                   }
                ];


    // used for an example of ngFor and navigation
    this.privatePages = [
                           {
                              title:'Dashboard',
                              component:Dashboard,
                              icon:'speedometer',
                              type:'dashboard'
                           },
                           {
                              title:'Requests',
                              component:SearchUsers,
                              icon:'people',
                              type:'agenda'
                           },
                           {
                              title:'Contact External',
                              component:ContactExternal,
                              icon:'mail',
                              type:'contact_external'
                           },
                           {
                              title:'Documents',
                              component:DocumentsList,
                              icon:'document',
                              type:'document'
                           },
                           {
                              title:'Agenda',
                              component:Agenda,
                              icon:'calendar',
                              type:'agenda'
                           },
                           {
                              title:'Tags',
                              component:Tags,
                              icon:'pricetags',
                              type:'tags'
                           },
                           {
                              title:'Settings',
                              component:Settings,
                              icon:'settings',
                              type:'settings'
                           }
                        ];
  }

  setItems(items){
    items.forEach(d=> {
       this.filePath.resolveNativePath( d.uri )
      .then(filePath => {
          
          var old = []
          var ur = window.localStorage.getItem('url') 
          if(ur){
            old = JSON.parse( window.localStorage.getItem('url') )
          }

          old.push(filePath);
          window.localStorage.setItem('url', JSON.stringify(old));

      }, (err) => {
        alert(JSON.stringify(err));
      });
    });
  }

  InitEvents(){
    this.events.subscribe('user:loggedin', (user) => {
      console.log(user,'event')
      this.current_user = user;
    });

    this.events.subscribe('user:refresh', (user) => {
      this.current_user = user;
    });
  }

  logout(){
    this.sessionHelper.clearSession();
    this.app.getRootNav().push(Login1Page);
  }

}
