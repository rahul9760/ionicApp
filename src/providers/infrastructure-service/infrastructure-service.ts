// AUTHOR : HS
// CREATED : 2-04-2018
// DESCRIPTION : infrastructure sevices.

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';

import { config } from '../../app.config';

import { SessionHelper } from '../../helpers/session.helper';
import { NotificationsHelper } from '../../helpers/notifications.helper';


@Injectable()
export class InfrastructureServiceProvider {

	public data: any;

	constructor(public http: Http, public session: SessionHelper, public Notifications: NotificationsHelper) {

	}

	getHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});  
			headers.append('Authorization', this.session.getToken() );
	    return new RequestOptions({ headers: headers }); // Create a request option
	}

	getInfrastructureList(page = 1,search, params = '') {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'locations?'+params+'&page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});
	}

	searchInfrastructure(search) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'locations?page='+1+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
			  .timeoutWith(config.timeout, Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data.locations; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});
	}

	getInfrastructure(id) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'locations/'+id, this.getHeaders())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});
	}

	getInfrastructureFields(location_id, parent_id){		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'locations/attributes?location_id='+location_id+"&parent_id="+parent_id, this.getHeaders())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true }) 
			  	}
			 );
		});
	}

	create(res) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/create' , res , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				if(data.status){
					this.data = data;
		    		resolve(this.data);
				} else {
					this.Notifications.presentToast(data.message);
					this.Notifications.dismissLoader();
					return false;
				}
			});
		});
	}

	update(res) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/update' , res , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	//Linked Modules
	
	getLinkedAgendas(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'locations/linked_agendas?location_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	getLinkedDocuments(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'locations/linked_documents?location_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	getLinkedContactExternal(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'locations/linked_contacts_external?location_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	getLinkedContactInternal(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'locations/linked_contacts_internal?location_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	saveLinkedAgenda(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/save_linked_agenda' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedDocument(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/save_linked_document' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedContactExternal(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/save_linked_contact_external' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedContactInternal(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/save_linked_contact_internal' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteLinkedContactExternal(params){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/delete_linked_contact_external' , params , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteLinkedContactInternal(params){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/delete_linked_contact_external' , params , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteAgendaLink(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/delete_linked_agenda' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteDocumentLink(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/delete_linked_document' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	getLinkedEquipments(id, page = 1, search){
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'locations/linked_equipments?location_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	deleteEquipmentLink(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/delete_linked_equipment' , { id: id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedEquipment(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'locations/save_linked_equipment' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}


}
