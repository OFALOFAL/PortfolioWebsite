from django.urls import path
from . import views

urlpatterns = [
    path('Home', views.goToHome, name='Home'),
    path('About', views.goToAbout, name='About'),
    path('Projects', views.goToProjects, name='Projects'),
    path('Projects/SMMR', views.SMMR, name='SMMR'),
    path('Projects/SMMR/results', views.SMMR_results, name='SMMR_results'),
    path('Skills', views.goToSkills, name='Skills'),
    path('Conntact', views.goToContact, name='Contact'),
    path('', views.redirectToHome, name='redirectToHome'),
]

