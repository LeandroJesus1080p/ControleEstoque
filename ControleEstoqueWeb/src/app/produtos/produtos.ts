import { Component, signal, HostListener, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../services/produto.service';
import { CategoriaService } from '../services/categoria.service';
import { Produto, Categoria } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-produtos',
  imports: [DatePipe, FormsModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss',
})
export class Produtos implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);
  private http = inject(HttpClient);
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
  
  // Upload Test State
  activeTab = signal<'info' | 'upload'>('info');
  uploadName = signal<string>('');
  uploadAge = signal<number>(0);
  selectedFile = signal<File | null>(null);
  uploading = signal<boolean>(false);
  uploadSuccess = signal<boolean>(false);

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
    this.activeTab.set('info');
    // Format required date string for type consistency or leave empty
    this.selectedProduto.set({ ativo: true, quantidadeEstoque: 0, preco: 0 });
    this.isDialogOpen.set(true);
  }

  openEditDialog(produto: Produto, event?: Event) {
    if (event) event.stopPropagation();
    this.dialogMode.set('edit');
    this.activeTab.set('info');
    this.selectedProduto.set({ ...produto });
    this.isDialogOpen.set(true);
  }

  closeDialog() {
    this.isDialogOpen.set(false);
    this.showDeleteConfirm.set(false);
    this.showSuccessMessage.set(false);
    this.activeTab.set('info');
    this.uploadName.set('');
    this.uploadAge.set(0);
    this.selectedFile.set(null);
    this.uploadSuccess.set(false);
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
    } else {
      this.selectedFile.set(null);
    }
    this.uploadSuccess.set(false);
  }

  testUpload() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.uploadSuccess.set(false);

    const formData = new FormData();
    formData.append('Name', this.uploadName());
    formData.append('Age', this.uploadAge().toString());
    formData.append('Photo', file);

    this.http.post(`${environment.apiUrl}/Employee`, formData).subscribe({
      next: (res) => {
        this.uploading.set(false);
        this.uploadSuccess.set(true);
        this.selectedFile.set(null);
        this.uploadName.set('');
        this.uploadAge.set(0);
      },
      error: (err) => {
        console.error('Erro no upload de teste', err);
        this.uploading.set(false);
        alert('Ocorreu um erro no upload!');
      }
    });
  }
}
