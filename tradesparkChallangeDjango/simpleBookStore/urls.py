from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthorViewSet, CategoryViewSet, BookViewSet

router = DefaultRouter()

router.register(r'authors', AuthorViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'books', BookViewSet)

book_router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('remove-category/', BookViewSet.as_view({'put': 'remove_category_from_book'}), name='remove-category-from-book')
]