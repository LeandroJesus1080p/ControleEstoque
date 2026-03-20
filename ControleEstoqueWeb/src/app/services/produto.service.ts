import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Produto } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProdutos(): Observable<ApiResponse<Produto[]>> {
    return this.http.get<ApiResponse<Produto[]>>(`${this.apiUrl}/produto`);
  }

  createProduto(produto: Partial<Produto>): Observable<ApiResponse<Produto>> {
    return this.http.post<ApiResponse<Produto>>(`${this.apiUrl}/produto`, produto);
  }

  updateProduto(id: number, produto: Partial<Produto>): Observable<ApiResponse<Produto>> {
    return this.http.put<ApiResponse<Produto>>(`${this.apiUrl}/produto`, produto);
  }

  deleteProduto(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/produto/${id}`);
  }
}
