import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ClienteService } from '../cliente.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../ConfirmDialog/ConfirmDialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-cliente-read',
  templateUrl: './cliente-read.component.html',
  styleUrls: ['./cliente-read.component.css']
})
export class ClienteReadComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'movimentacoes', 'editar', 'excluir'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  incluirCliente(){
    this.router.navigate(['/cliente-add']);

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editarCliente(id: number) {
    this.router.navigate(['/cliente/update', id]);
  }

  openConfirmDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Você tem certeza que deseja deletar este cliente?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCliente(id);
      }
    });
  }

  deleteCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        let snackBarRef = this.snackBar.open('Cliente deletado com sucesso', 'Fechar', {
          duration: 3000
        });

        snackBarRef.afterDismissed().subscribe(() => {
          this.reloadData();
        });
      },
      error: () => {
        let snackBarRef = this.snackBar.open('Erro ao deletar cliente', 'Fechar', {
          duration: 3000
        });

        snackBarRef.afterDismissed().subscribe(() => {
          this.reloadData();
        });
      }
    });
  }

  reloadData(): void {
    location.reload()
  }

  abrirMovimentacoes(clienteId: number): void {    
    this.router.navigate(['/movimentacao/', clienteId]);
  }
}
