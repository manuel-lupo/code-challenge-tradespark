import { Component, OnInit } from '@angular/core';
import { BookStoreService } from '../book-store.service';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css']
})
export class BookStoreComponent implements OnInit {

  books: any[] = [];
  booksDisplaying: any[] = [];

  searchTerm: string = ""
  selectedCategories: string[] = new Array<string>();
  constructor(private bookStoreService: BookStoreService) { }

  ngOnInit(): void {
    this.bookStoreService.getBooks().subscribe((data: any[]) => {
      this.books = data;
      this.booksDisplaying = data;
    })
    //Al momento de iniciar el componente se pushea 'title' a las categorias seleccionadas para que funcione la busqueda al cargar
    this.selectedCategories.push('title')
  }

  /**
   * 
   * Funcion que filtra la lista completa de libros por titulo, autor o categoria dependiendo de lo indicado por el usuario
   * 
   */
  applyFilter(): void {
    this.booksDisplaying = this.books.filter(book => {
      return this.selectedCategories.includes("title") && book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.selectedCategories.includes("author") && book.author.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.selectedCategories.includes("categories") && this.categoriesToString(book.categories).toLowerCase().includes(this.searchTerm.toLowerCase())
    })
  }

  /**
 * Funcion que actualiza la lista de categorias seleccionadas cada vez que se da un evento de tipo 'change' en el checkbox
 * 
 * @param event evento de tipo 'change'
 */
  onCheckboxChange(event: any) {
    const value: string = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(value);
    } else {
      this.selectedCategories = this.selectedCategories.filter(category => category !== value);
    }
  }

  /**
   * Funcion que actualiza el termino de busqueda cuando se actualiza el input
   * 
   * @param event evento de tipo 'input'
   */
  onTextInput(event: any) {
    const value: string = event.target.value;
    this.searchTerm = value;
    this.applyFilter()
  }

  categoriesToString(categories: any[]): string {
    let categoriesString = "";
    categories.forEach((category, index) => {
      categoriesString += category.name;
      if (index < categories.length - 1) {
        categoriesString += ", ";
      }
    });
    return categoriesString;
  }


}
