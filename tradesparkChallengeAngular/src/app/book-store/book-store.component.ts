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

  constructor(private bookStoreService: BookStoreService) { }

  ngOnInit(): void {
    this.bookStoreService.getBooks().subscribe((data: any[]) => {
      this.books = data;
      this.booksDisplaying = data;
    })
  }
  /**
   * 
   * Funcion que filtra la lista completa de libros segun los parametros indicados por el usuario
   * 
   * @param searchTerm termino a buscar en uno o mas campos
   */
  applyFilter(searchTerm : string , fields : string[]): void {
    this.booksDisplaying = this.books.filter(book => {
      return fields.includes("title") && book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fields.includes("author") && book.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fields.includes("categories") && this.categoriesToString(book["categories"]).toLowerCase().includes(searchTerm.toLowerCase())
    })
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
