import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environments";

@Injectable()
export abstract class HttpClientService{
    protected baseUrl = environment.url;

    constructor (
        protected http: HttpClient
    ) { }

    protected abstract getSufixoAPI(): string;

    protected getEnderecoAPI(): string {
        return this.baseUrl + this.getSufixoAPI();    
    }
}