import { Component, signal, HostListener, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../services/produto.service';
import { CategoriaService } from '../services/categoria.service';
import { Produto, Categoria } from '../models/models';

@Component({
  selector: 'app-produtos',
  imports: [DatePipe, FormsModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss',
})
export class Produtos implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);
  activeFilter = signal<string | null>(null);
  loading = signal<boolean>(true);

  produtos = signal<Produto[]>([]);
  categorias = signal<Categoria[]>([]);

  // Dialog State
  isDialogOpen = signal<boolean>(false);
  dialogMode = signal<'create' | 'edit'>('create');
  selectedProduto = signal<Partial<Produto>>({});
  showDeleteConfirm = signal<boolean>(false);
  showSuccessMessage = signal<boolean>(false);

  ngOnInit() {
    this.categoriaService.getCategorias().subscribe({
      next: (res) => { if (res.success) this.categorias.set(res.data); }
    });
    this.loadProdutos();
  }

  loadProdutos() {
    this.loading.set(true);
    this.produtoService.getProdutos().subscribe({
      next: (response) => {
        if (response.success) {
           this.produtos.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        this.loading.set(false);
      }
    });
  }

  openCreateDialog() {
    this.dialogMode.set('create');
    // Format required date string for type consistency or leave empty
    this.selectedProduto.set({ ativo: true, quantidadeEstoque: 0, preco: 0 });
    this.isDialogOpen.set(true);
  }

  openEditDialog(produto: Produto, event?: Event) {
    if (event) event.stopPropagation();
    this.dialogMode.set('edit');
    this.selectedProduto.set({ ...produto });
    this.isDialogOpen.set(true);
  }

  closeDialog() {
    this.isDialogOpen.set(false);
    this.showDeleteConfirm.set(false);
    this.showSuccessMessage.set(false);
  }

  confirmDelete() {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  saveProduto() {
    const produto = this.selectedProduto();
    if (!produto.dataCadastro) {
       produto.dataCadastro = new Date().toISOString();
    }
    
    if (this.dialogMode() === 'create') {
      this.produtoService.createProduto(produto).subscribe({
        next: (res) => {
          if (res.success) this.loadProdutos();
          this.closeDialog();
        },
        error: (err) => { console.error('Erro ao criar', err); this.closeDialog(); }
      });
    } else {
      if (produto.id) {
        this.produtoService.updateProduto(produto.id, produto).subscribe({
          next: (res) => {
             if (res.success) {
                 this.loadProdutos();
                 this.selectedProduto.set({ ...res.data });
                 this.showSuccessMessage.set(true);
                 setTimeout(() => this.showSuccessMessage.set(false), 3000);
             }
          },
          error: (err) => { console.error('Erro ao atualizar', err); }
        });
      }
    }
  }

  deleteProduto() {
    const id = this.selectedProduto().id;
    if (id) {
       this.produtoService.deleteProduto(id).subscribe({
         next: (res) => {
           if (res.success) this.loadProdutos();
           this.showDeleteConfirm.set(false);
           this.closeDialog();
         },
         error: (err) => { 
           console.error('Erro ao excluir', err); 
           this.showDeleteConfirm.set(false);
           this.closeDialog(); 
         }
       });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.activeFilter.set(null);
  }

  toggleFilter(column: string, event: Event) {
    event.stopPropagation();
    if (this.activeFilter() === column) {
      this.activeFilter.set(null);
    } else {
      this.activeFilter.set(column);
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
