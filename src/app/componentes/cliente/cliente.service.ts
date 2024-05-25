import { HttpClientService } from '../HttpClientService';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'



@Injectable({ providedIn: 'root' })

export class ClienteService extends HttpClientService {

    protected getSufixoAPI(): string {
        return 'cliente'
    }    

    getClientes(): Observable<any[]> {
        return this.http.get<any[]>(this.getEnderecoAPI());
    }

    addCliente(cliente: any): Observable<any> {
        return this.http.post(this.getEnderecoAPI(), cliente);
    }
      
    getClienteById(id: number): Observable<any> {
        return this.http.get(`${this.getEnderecoAPI()}/${id}`);
    }

    updateCliente(id: number, cliente: any): Observable<any> {
        return this.http.put(`${this.getEnderecoAPI()}/${id}`, cliente);
    }

    deleteCliente(id: number) {        
        return this.http.delete(`${this.getEnderecoAPI()}/${id}`);
    }
}

