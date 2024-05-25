import { HttpClientService } from '../HttpClientService';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimentacao } from 'src/app/shared/models/Movimentacao';


@Injectable({
  providedIn: 'root'
})

export class MovimentacaoService extends HttpClientService {

  protected getSufixoAPI(): string {
    return 'movimentacao'
  }    

  addMovimentacao(movimentacao: Movimentacao): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(this.getEnderecoAPI(), movimentacao);
  }

  getAllMovimentacoes(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(this.getEnderecoAPI());
  }

  deleteMovimentacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.getEnderecoAPI()}/${id}`);
  }

  getMovimentacoesByClienteId(clienteId: number): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.getEnderecoAPI()}/saldo/${clienteId}`);
  }
  

}
