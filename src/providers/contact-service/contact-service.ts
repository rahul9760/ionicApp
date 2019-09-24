import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';

import { config } from '../../app.config';

import { SessionHelper } from '../../helpers/session.helper';


@Injectable()
export class ContactServiceProvider {

	public data: any;

	constructor(public http: Http, public session: SessionHelper) {

	}

	getHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});  
			headers.append('Authorization', this.session.getToken() );
	    return new RequestOptions({ headers: headers }); // Create a request option
	}

	getContactExternals(page = 1,search) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_external?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
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

	getContactInternals(page = 1,search) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_internal?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
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

	getContactOrgs(page = 1,search) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_external/contact_orgs?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
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

	getContactSites(page = 1,search) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_internal/contact_sites?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
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

	getContactDivisions(id) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_external/contact_divisions?contact_org_id='+id, this.getHeaders())
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

	getContactDepartments(id) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_internal/contact_departments?contact_site_id='+id , this.getHeaders())
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

	getContactDepartmentsAndSiteAttrs(id) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_internal/contact_departments_and_site_attributes?contact_site_id='+id , this.getHeaders())
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

	getContactDivisionsAndOrgAttrs(id) {
		console.log("contact_id",id)
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_external/contact_divisions_and_org_attributes?contact_org_id='+id , this.getHeaders())
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

	getContactDepartmentsAttrs(id) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_internal/contact_departments_attributes?department_id='+id , this.getHeaders())
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

	getContactDivisionAttrs(id) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_external/contact_divisions_attributes?division_id='+id , this.getHeaders())
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

	getContactExternal(id) {
		console.log('sjdfsdfsdkfsdfsd',id)
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_external/'+id, this.getHeaders())
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

	getContactInternal(id) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'contact_internal/'+id, this.getHeaders())
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

	searchContacts(val) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_external?page='+1+'&per_page='+config.per_page+'&search=' + val , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data.contacts;
	        resolve(this.data);
	      });
	  });
	}

	searchContactsInternal(val) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_internal?page='+1+'&per_page='+config.per_page+'&search=' + val , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data.contacts;
	        resolve(this.data);
	      });
	  });
	}

	searchContactsOrgs(val) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_external/contact_orgs?page='+1+'&per_page='+config.per_page+'&search=' + val , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      });
	  });
	}

	searchContactsSites(val) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_external/contact_sites?page='+1+'&per_page='+config.per_page+'&search=' + val , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      });
	  });
	}

	getContactFields() {
		return new Promise<any>(resolve => {
		    this.http.get(config.api_url + 'contact_external/contact_fields' , this.getHeaders())
		      .map(res => res.json())
		      .subscribe(data => {
		        this.data = data;
		        resolve(this.data);
		      });
	  	});
	}

	getContactInternalFields() {
		return new Promise<any>(resolve => {
		    this.http.get(config.api_url + 'contact_internal/contact_fields' , this.getHeaders())
		      .map(res => res.json())
		      .subscribe(data => {
		        this.data = data;
		        resolve(this.data);
		      });
	  	});
	}

	saveOrg(contact) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/create_org' , contact , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveSite(contact) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/create_site' , contact , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveDepartment(contact) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/create_department' , contact , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveDiv(contact) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/create_division' , contact , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveContact(contact) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/create_contact' , contact , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveEmployee(employee) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/create_employee' , employee , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	savePerson(person) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/create_person' , person , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	savePersonCI(person) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/create_person' , person , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	update(contact) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/update' , contact , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	updateContactInternal (contact) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/update' , contact , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	delete(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/delete' , {id : id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	getLinkedDocuments(row_id, contact_id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_external/linked_documents?row_id='+row_id+'&contact_id='+contact_id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getLinkedDocumentsCI(row_id, contact_id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_internal/linked_documents?row_id='+row_id+'&contact_id='+contact_id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getLinkedInfrastructureCI(row_id, contact_id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_internal/linked_infrastructure?row_id='+row_id+'&contact_id='+contact_id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getLinkedInfrastructureCE(row_id, contact_id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_external/linked_infrastructure?row_id='+row_id+'&contact_id='+contact_id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	deleteDocumentLink(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/delete_linked_document' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteDocumentLinkCI(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/delete_linked_document' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteEquipmentLinkCI(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/delete_linked_equipment' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteEquipmentLinkCE(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/delete_linked_equipment' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteInfrastructureLinkCI(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/delete_linked_infrastructure' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteInfrastructureLinkCE(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/delete_linked_infrastructure' , { id : id } , this.getHeaders())
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
			this.http.post(config.api_url + 'contact_external/save_linked_document' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedDocumentCI(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/save_linked_document' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedInfrastructureCI(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/save_linked_infrastructure' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedInfrastructureCE(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/save_linked_infrastructure' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	getLinkedAgendas(row_id, contact_id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_external/linked_agendas?row_id='+row_id+'&contact_id='+contact_id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getLinkedAgendasCI(row_id, contact_id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_internal/linked_agendas?row_id='+row_id+'&contact_id='+contact_id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	deleteAgendaLink(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/delete_linked_agenda' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteAgendaLinkCI(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/delete_linked_agenda' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedAgenda(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/save_linked_agenda' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedAgendaCI(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/save_linked_agenda' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedEquipmentCI(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_internal/save_linked_equipment' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedEquipmentCE(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'contact_external/save_linked_equipment' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	getLinkedEquipmentsCI(row_id, contact_id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_internal/linked_equipments?row_id='+row_id+'&contact_id='+contact_id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getLinkedEquipmentsCE(row_id, contact_id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'contact_external/linked_equipments?row_id='+row_id+'&contact_id='+contact_id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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


}
