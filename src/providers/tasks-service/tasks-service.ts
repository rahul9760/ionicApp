import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import { config } from '../../app.config';
import { SessionHelper } from '../../helpers/session.helper';

@Injectable()

export class TasksServiceProvider {
	public data: any;
	
	constructor(public http: Http, public session: SessionHelper) {

	}

	getHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});  
		headers.append('Authorization', this.session.getToken() );
		return new RequestOptions({ headers: headers }); // Create a request option
	}

	getTasks(page = 1,search){
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'tasks?page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	searchTasks(search){
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'tasks?page=1&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getTask(id) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'tasks/'+ id , this.getHeaders())
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
	    this.http.get(config.api_url + 'tasks/linked_contacts_external?task_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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
	    this.http.get(config.api_url + 'tasks/linked_contacts_internal?task_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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
	    this.http.get(config.api_url + 'tasks/linked_documents?task_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getLinkedInfrastructure(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'tasks/linked_infrastructure?task_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getAttendees() {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'tasks/attendees' , this.getHeaders())
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

	searchAttendees(search) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'tasks/search_attendees?search=' + search, this.getHeaders())
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

	save(task) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/create' , task , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	delete(id){
 		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/delete' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}
	
	update(task) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/update' , task , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedContactExternal(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/save_linked_contact_external' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedContactInternal(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/save_linked_contact_internal' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedInfrastructure(link){
	   console.log(link);
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/save_linked_infrastructure' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedDocument(link){
	   console.log(link);
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/save_linked_document' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	searchContacts(val) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'tasks/search_contact_external?page='+1+'&per_page='+config.per_page+'&search=' + val , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      });
	  });
	}

	searchContactsInternal(val) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'tasks/search_contact_internal?page='+1+'&per_page='+config.per_page+'&search=' + val , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      });
	  });
	}

	deleteDocumentLink(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/delete_linked_document' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteContactExternalLink(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/delete_linked_contact_external' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteInfrastructureLink(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/delete_linked_infrastructure' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedEquipment(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'tasks/save_linked_equipment' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	getLinkedEquipments(id, page = 1, search){
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'tasks/linked_equipments?task_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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
			this.http.post(config.api_url + 'tasks/delete_linked_equipment' , { id: id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}
}
