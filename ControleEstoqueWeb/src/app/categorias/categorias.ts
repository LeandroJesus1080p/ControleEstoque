import { Component, signal, HostListener, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/models';

@Component({
  selector: 'app-categorias',
  imports: [FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss',
})
export class Categorias implements OnInit {
  private categoriaService = inject(CategoriaService);
  activeFilter = signal<string | null>(null);
  loading = signal<boolean>(true);

  categorias = signal<Categoria[]>([]);
  
  // Dialog State
  isDialogOpen = signal<boolean>(false);
  dialogMode = signal<'create' | 'edit'>('create');
  selectedCategoria = signal<Categoria>({ id: 0, nome: '' });
  showDeleteConfirm = signal<boolean>(false);
  showSuccessMessage = signal<boolean>(false);

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.loading.set(true);
    this.categoriaService.getCategorias().subscribe({
      next: (response) => {
        if (response.success) {
           this.categorias.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar categorias:', err);
        this.loading.set(false);
      }
    });
  }

  openCreateDialog() {
    this.dialogMode.set('create');
    this.selectedCategoria.set({ id: 0, nome: '' });
    this.isDialogOpen.set(true);
  }

  openEditDialog(categoria: Categoria, event?: Event) {
    if (event) {
      // Allow stop propagation if we add a dedicated button, but we attach click to the TR so it shouldn't open filters.
      // Wait, clicking on TD might bubble up, but filters trigger on TH.
    }
    this.dialogMode.set('edit');
    this.selectedCategoria.set({ ...categoria });
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

  saveCategoria() {
    const categoria = this.selectedCategoria();
    
    if (this.dialogMode() === 'create') {
      this.categoriaService.createCategoria(categoria).subscribe({
        next: (res) => {
          if (res.success) this.loadCategorias();
          this.closeDialog();
        },
        error: (err) => { console.error('Erro ao criar', err); this.closeDialog(); }
      });
    } else {
      if (categoria.id) {
        this.categoriaService.updateCategoria(categoria.id, categoria).subscribe({
          next: (res) => {
             if (res.success) {
                 this.loadCategorias();
                 this.selectedCategoria.set({ ...res.data });
                 this.showSuccessMessage.set(true);
                 setTimeout(() => this.showSuccessMessage.set(false), 3000);
             }
          },
          error: (err) => { console.error('Erro ao atualizar', err); }
        });
      }
    }
  }

  deleteCategoria() {
    const id = this.selectedCategoria().id;
    if (id) {
       this.categoriaService.deleteCategoria(id).subscribe({
         next: (res) => {
           if (res.success) this.loadCategorias();
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
