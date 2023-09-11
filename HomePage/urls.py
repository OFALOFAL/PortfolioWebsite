from django.urls import path
from . import views

urlpatterns = [
    path('Home', views.predictSongMood, name='Home'),
    path('', views.redirectToHome, name='redirectToHome'),
]

