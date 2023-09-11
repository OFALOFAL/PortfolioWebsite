from django.urls import include, path

urlpatterns = [
    path('', include('HomePage.urls')),
]
