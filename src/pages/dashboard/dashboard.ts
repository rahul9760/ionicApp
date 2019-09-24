import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, MenuController, Events } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Notifications } from '../notifications/notifications';
import { NotificationServiceProvider } from '../../providers/notifications-service/notifications-service';
import { SessionHelper } from '../../helpers/session.helper';
import { config } from '../../app.config';

import { DocumentsList } from '../documents/documents_list/documents_list';
import { DocumentsListInfo } from '../documents/documents_list_info/documents_list_info';
import { Settings } from '../settings/settings';
import { Infrastructure } from '../infrastructure/list/list';
import { EquipmentsMenu } from '../equipments/menu/menu';
import { EquipmentsLevels } from '../equipments/levels/levels';
import { EquipmentsModels } from '../equipments/models/models';
import { EquipmentsArticles } from '../equipments/articles/articles';
import { Agenda } from '../agenda/list/list';
import { AgendaDescription } from '../agenda/show/show';
import { Tags } from '../tags/list/list';
import { ContactExternal } from '../contact/external/list/list';
import { ContactInternal } from '../contact/internal/list/list';
import { ContactInternalDescription } from '../contact/internal/show/show';
import { ContactExternalDescription } from '../contact/external/show/show';
import { Screen1 } from "../documents/documents_create/screen1/screen1";
import { Items } from "../items/items";
import { SearchUsers } from "../search_users/list/list";
import { EquipmentsArticleDescription } from '../equipments/articles/description/description';
import { InfrastructureDescription } from '../infrastructure/show/show';


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: []
})

export class Dashboard {
    pages = { 
                document : DocumentsList, 
                settings : Settings, 
                infrastructure : Infrastructure , 
                equipments : EquipmentsMenu , 
                agenda : Agenda , 
                tags : Tags, 
                create : Screen1 , 
                contact_external : ContactExternal, 
                contact_internal : ContactInternal 
            }
            
    @ViewChild('barCanvas') barCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;
 
    current_user: any;
    modules: any;
    barChart: any;
    doughnutChart: any;
    lineChart: any;

    notifications_count: Number;
    requests_count: Number;
    
    reload: Boolean = true ;
    
    notifications: any = [];
    items: any = [];
    counts: any;
    modules_count: any = [1,1,1,1,1,1];
 
    constructor( public navCtrl: NavController, public events: Events,public _ngZone: NgZone,public session: SessionHelper,public NotificationService: NotificationServiceProvider,public menu: MenuController) {
        this.menu = menu;

        this.menu.swipeEnable(true);
        this.current_user = this.session.getUser();
        // debugger
        this.resetNotifications();
        this.resetDashboard();
    }
 
    ionViewDidLoad() {
        console.log("Dashboard ionViewDidLoad !");
    }

    ngOnChanges(){
        console.log("Dashboard ngOnChanges !");
    }

    ngOnInit(){
        console.log("Dashboard ngOnInit !");
    }

    openNotifications(){
      
        this.navCtrl.push(Notifications)
       
    }

    openRequest(){
        this.navCtrl.push(SearchUsers, { request: 'recieved' } )
    }

    loadDoughnut(){
        let labels = []
        let backgroundColors = []
        let hoverBackgroundColor = []

        if( !this.current_user.is_private ){
            labels = ["Infrastructure", "Document", "Equipment", "Task", "Contact Internal", "Contact External"]
            backgroundColors = [
                                'rgba(158, 158, 158, 0.51)',
                                'rgba(0, 150, 136, 0.48)',
                                'rgba(121, 85, 72, 0.56)',
                                'rgba(96, 125, 139, 0.52)',
                                'rgba(255, 152, 0, 0.5)'
                             ]
                               
            hoverBackgroundColor = [
                                    "#9E9E9E",
                                    "#009688",
                                    "#795548",
                                    "#607D8B",
                                    "#00BCD4",
                                    "#ff9800",
                                    "#2196F3",
                                ]
        } else {
            labels = ["Document", "Task", "Contact External"]
            backgroundColors = [
                                'rgba(0, 150, 136, 0.48)',
                                'rgba(96, 125, 139, 0.52)',
                                'rgba(33, 150, 243, 0.55)'
                            ]
                               
            hoverBackgroundColor = [
                                "#009688",
                                "#607D8B",
                                "#2196F3"
                            ]
        }

        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
 
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Votes',
                    data: this.modules_count,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: hoverBackgroundColor
                }]
            }
 
        });
    }

    loadBar(data){
        
        this.barChart = new Chart(this.barCanvas.nativeElement, {
 
            type: 'bar',
            data: {
                labels: data.categories.names,
                datasets: [{
                    label: '',
                    data: data.categories.counts,
                    backgroundColor: [
                        'rgba(158, 158, 158, 0.51)',
                        'rgba(0, 150, 136, 0.48)',
                        'rgba(121, 85, 72, 0.56)',
                        'rgba(96, 125, 139, 0.52)',
                        'rgba(255, 152, 0, 0.5)',
                        'rgba(33, 150, 243, 0.55)'
                    ],
                    borderColor: [
                        'rgba(158, 158, 158, 0.51)',
                        'rgba(0, 150, 136, 0.48)',
                        'rgba(121, 85, 72, 0.56)',
                        'rgba(96, 125, 139, 0.52)',
                        'rgba(255, 152, 0, 0.5)',
                        'rgba(33, 150, 243, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
                legend: { display: false }
            }
 
        });
    }

    resetNotifications(){
        this.NotificationService.getNotificationsCount()
        .then(data => {
           
               
                this.notifications_count = data.notifications;
                this.requests_count = data.recieved;
                this._ngZone.run(() => {  });
            
           
        });
    }

    resetDashboard(){
        
        this.NotificationService.getRecentNotifications()
        .then(data => {
          
          if( data.error == undefined ){
            this.reload = false;
            this.notifications = data.notifications;
            this.items = data.items;
            this.counts = data.counts;
            this.initCharts(data.counts)

          } else {
           
           //this.resetDashboard();
          
          }

        });
    }
 
    avatar(notification){
     return config.api_url + 'documents/download?fileName=' + notification.by_user_profile_pic.name + '&token=' + this.session.getToken() + '&type=profile_pic&thumb=true&' + '&org_id=' + notification.by_org_id
    }

    openModule(type = ''){
        this.navCtrl.push(this.pages[type]);
    }

    initCharts(data){
        
        if( this.current_user.is_private ){
            this.modules_count = [ data.documents, data.tasks, data.contacts_external ]
        } else {
            this.modules_count = [ data.locations, 
                                   data.documents, 
                                   data.equipments,  
                                   data.tasks, 
                                   data.contacts_internal, 
                                   data.contacts_external ]
    
        }

        this.loadDoughnut();
        this.loadBar(data);
        this._ngZone.run(() => { console.log('Reset Charts Done!'); });
    }

    
     openItem(item, index){
      
      
      switch(item.request_type){
        
        case 'document':
          this.navCtrl.push( DocumentsListInfo , {
              id: item.request_id
          });
        break;
        
        case 'contact_internal':
          this.navCtrl.push( ContactInternalDescription , {
              id: item.request_id
          });
        break;
        
        case 'contact_external':
          this.navCtrl.push( ContactExternalDescription , {
              id: item.request_id
          });
        break;
        
        case 'agenda':
          this.navCtrl.push( AgendaDescription , {
              id: item.request_id
          });
        break;
        
        case 'locations':
          this.navCtrl.push(InfrastructureDescription, { id : item.request_id , count : 0 })

        break;


        case 'objects':
          
          switch(item.module){
          
            case 'levels_data':


              item.contain_three_levels ? this.navCtrl.push(EquipmentsModels,{ 
                                                    levels_data_id : item.request_id, 
                                                    parent_id : item.parent_id
                                                 })
                                                 : 
                                        this.navCtrl.push( EquipmentsLevels, {  
                                           parent_id : item.request_id
                                        } )

               
            break;

            case 'model_data':
                this.navCtrl.push(EquipmentsArticles,{ 
                                            levels_data_id : item.levels_data_id, 
                                            model_data_id : item.request_id, 
                                            parent_id : item.parent_id  
                                        }
                                )
            break;

            case 'article_data':

              this.navCtrl.push(EquipmentsArticleDescription, { id : item.request_id })

            break;
          
          }

        
        break;

      }

      
  }

    openNotification(notification, index){

      this.NotificationService.openNotification(notification.id)
      .then(res => {
          console.log("notification",res)
        this.notifications[index].is_read = "1";
        //this.notifications.splice(index,1)
        switch (notification.request_type) {
            case 'shared_documents':
                this.openDocument( DocumentsListInfo , res.request_data )
                break;
            case 'agenda':
                this.navCtrl.push( AgendaDescription , res.request_data);
                break;
            
            default:
        }

      });

    }

    openDocument(state, shared ){

        this.navCtrl.push(state, {
            id: shared.document.id,
            org_id : shared.document.org_id,
            permission : {
                          can_read : shared.can_read,
                          can_download : shared.can_download,
                          can_external_share : shared.can_external_share,
                          can_share : shared.can_share,
                          can_update : shared.can_update
                      }
        });

    }

    openScreen(name){
        var state = name == 'notifications' ? Notifications : Items;
        this.navCtrl.push(state);
    }


}