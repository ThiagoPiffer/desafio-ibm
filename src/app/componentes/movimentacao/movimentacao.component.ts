import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../cliente/cliente.service';  
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovimentacaoService } from './movimentacao.service';
import { Movimentacao } from 'src/app/shared/models/Movimentacao';
import * as moment from 'moment';



@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao.component.html',
  styleUrls: ['./movimentacao.component.css']
})
export class MovimentacaoComponent implements OnInit {
  clienteId: number | null = null;
  cliente: any = {};  
  saldo: number = 0;

  displayedColumns: string[] = ['tipo', 'valor', 'dataMovimentacao', 'acoes'];
  movimentacoes: Movimentacao[] = [];



  tipoMovimentacao: string = 'credito'; 
  valorMovimentacao: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService, 
    private snackBar: MatSnackBar,
    private router: Router,
    private movimentacaoService: MovimentacaoService
  ) {}

  ngOnInit(): void {
    
    this.LoadCliente();
  }

  LoadCliente(){
    const clienteIdParam = this.route.snapshot.paramMap.get('clienteId');
    if (clienteIdParam !== null) {
      this.clienteId = parseInt(clienteIdParam, 10);
      if (this.clienteId) {
        this.carregarDadosCliente(this.clienteId);
        this.loadMovimentacoes(this.clienteId);
      }
    } else {
      let snackBarRef = this.snackBar.open('Cliente não pode ser carregado', 'Fechar', {
        duration: 3000
      });

      snackBarRef.afterDismissed().subscribe(() => {
        this.router.navigate(['/cliente/']);
      });      
    }
  }

  loadMovimentacoes(clienteId: number) {
    this.movimentacaoService.getMovimentacoesByClienteId(clienteId).subscribe({
      next: (data) => {
        this.movimentacoes = data;
        this.calculateSaldo(); 
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar movimentações', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }

  calculateSaldo() {
    this.saldo = this.movimentacoes.reduce((acc, movimentacao) => {
      return movimentacao.tipo === 'credito' ? acc + movimentacao.valor : acc - movimentacao.valor;
    }, 0);
  }
  

  carregarDadosCliente(clienteId: number): void {    
    this.clienteService.getClienteById(clienteId).subscribe({
      next: (cliente) => {
      this.cliente = cliente;      
      
      }, error: (error) => {
        console.error('Erro ao carregar dados do cliente', error);
      }
    });
  }

  calcularSaldo(clienteId: number): void {
    this.movimentacaoService.getMovimentacoesByClienteId(clienteId).subscribe({
      next: (movimentacoes) => {
        this.saldo = movimentacoes.reduce((acc, movimentacao) => {
          return movimentacao.tipo === 'credito' ? acc + movimentacao.valor : acc - movimentacao.valor;
        }, 0);
      },
      error: (error) => {
        console.error('Erro ao carregar movimentações do cliente', error);
        this.saldo = 0;  
      }
    });
  }
  

  onTipoChange(): void {
    
  }

  adicionarMovimentacao(): void {    
    if (this.clienteId && this.valorMovimentacao != null) {
      const novaMovimentacao: Movimentacao = {
        clienteId: this.clienteId,
        tipo: this.tipoMovimentacao,
        valor: this.valorMovimentacao,
        dataMovimentacao: moment().format('YYYY-MM-DDTHH:mm:ss')
      };

      this.movimentacaoService.addMovimentacao(novaMovimentacao).subscribe({
        next: (movimentacao) => {          
          let snackBarRef = this.snackBar.open('Movimentação adicionada com sucesso', 'Fechar', {
            duration: 3000
          });
            
          snackBarRef.afterDismissed().subscribe(() => {
            this.reloadData();
          });
        },
        error: (error) => {          
          let snackBarRef = this.snackBar.open('Erro ao adicionar movimentação', 'Fechar', {
            duration: 3000
          });
        }
      });
    } 

    this.calculateSaldo();
  }

  reloadData(): void {
    location.reload()
  }

  deleteMovimentacao(id: number) {
    this.movimentacaoService.deleteMovimentacao(id).subscribe({
      next: () => {
        this.snackBar.open('Movimentação excluída com sucesso', 'Fechar', { duration: 3000 });
        this.loadMovimentacoes(this.clienteId!); 
      },
      error: () => {
        this.snackBar.open('Erro ao excluir movimentação', 'Fechar', { duration: 3000 });
      }
    });

    this.calculateSaldo();
  }
  
}
