from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('Home', views.goToHome, name='Home'),
    path('About', views.goToAbout, name='About'),
    path('Projects', views.goToProjects, name='Projects'),
    path('Skills', views.goToSkills, name='Skills'),
    path('Conntact', views.goToContact, name='Contact'),
    path('', views.redirectToHome, name='redirectToHome'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL , document_root = settings.STATIC_ROOT)
