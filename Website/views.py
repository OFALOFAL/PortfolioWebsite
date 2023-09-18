from django.shortcuts import redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.template.loader import render_to_string
import os

def goToHome(request):
    html = render_to_string('index.html', request=request)
    return HttpResponse(html)

def redirectToHome(_):
    return redirect("/Home")

def goToAbout(request):
    html = render_to_string('about.html', request=request)
    return HttpResponse(html)

def goToProjects(request):
    html = render_to_string('projects.html', request=request)
    return HttpResponse(html)

def goToSkills(request):
    html = render_to_string('skills.html', request=request)
    return HttpResponse(html)

def goToContact(request):
    html = render_to_string('contact.html', request=request)
    return HttpResponse(html)
