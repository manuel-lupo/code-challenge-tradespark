from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Author, Category, Book
from .serializers import AuthorSerializer, CategorySerializer, BookSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    #Elijo hacer la ruta mediante un metodo put ya que aunque se esta eliminando una entrada de la tabla intermedia, se esta modificando el libro y la categoria
   
    def remove_category_from_book(self, request):
        '''
        Funcion que elimina la categoria (Dada como una string de texto correspondiente al nombre) 
        para un libro especifico (Dado como una string de texto correspondiente al titulo).
        '''
        book_title = request.data.get("title")
        category_name = request.data.get("category")
        
        if not book_title:
            return Response(data={"message": "You need to specify a book name"}, status= 400)
        if not category_name:
            return Response(data={"message": "You need to specify a category name"}, status= 400)
    
        # Obtiene los libros y categorias que coincidan con el nombre y titulo dados
        books = Book.objects.filter(title=book_title)
        categories = Category.objects.filter(name=category_name)
        
        if categories.__len__() == 0:
            return Response(data={"message": f"A category named {category_name} was not found"}, status=404)
        if books.__len__() == 0:
            return Response(data={"message": f"A book named {book_title} was not found"}, status=404)
        
        deleted = False
        
        #Recorro tanto libros como categorias por si hay mas de uno con el mismo nombre
        for book in books:
            for category in categories:
                # Elimina la relación entre el libro y la categoría actuales
                if category in book.categories.all():
                    book.categories.remove(category)
                    deleted = True
        
        if deleted:
            return Response(data={"message": f"Category '{category_name}' removed from all books named '{book_title}'"}, status=200)
        else:
            return Response(data={"message": f"We couldn't delete {category_name} from {book_title}."}, status=500)
        