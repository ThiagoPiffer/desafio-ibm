export class Movimentacao {
    id?: number; 
    clienteId: number;
    tipo: string;
    valor: number;
    dataMovimentacao?: string;
    clienteIdTransferencia: number = 0; 
}