import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../cliente.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-cliente-add',
  templateUrl: './cliente-add.component.html',
  styleUrls: ['./cliente-add.component.css']
})

export class ClienteAddComponent implements OnInit {
  clienteForm: FormGroup = this.fb.group({});
  id: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar

  ) { 
    const routeId = this.route.snapshot.paramMap.get("id");
    this.id = routeId ? +routeId : null    
  }

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      idade: ['', [Validators.required, Validators.min(18)]], 
      email: ['', [Validators.required, Validators.email]],
      numero_Conta: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.id = +params['id']; 
      this.loadCliente(this.id);
    });
  }

  loadCliente(id: number) {
    this.clienteService.getClienteById(id).subscribe(cliente => {
      console.log(cliente)
      this.clienteForm.setValue({
        nome: cliente.nome,
        idade: cliente.idade,
        email: cliente.email,
        numero_Conta: cliente.numero_Conta
      });      
    });
  }

  salvarCliente() {
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value;
      if (this.id) {        
        this.clienteService.updateCliente(this.id, cliente).subscribe({
          next: () => this.router.navigate(['/cliente']),
          error: (error) => {
            let snackBarRef = this.snackBar.open('Erro ao atualizar cliente', 'Fechar', {
              duration: 3000
            });
          }
        });
      } else {        
        this.clienteService.addCliente(cliente).subscribe({
          next: () => this.router.navigate(['/cliente']),
          error: (error) => console.error('Erro ao cadastrar cliente', error)
        });
      }
    }
  }
}
