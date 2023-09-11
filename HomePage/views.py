from django.shortcuts import redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.template.loader import render_to_string
import os

def predictSongMood(request):
    html = render_to_string('index.html', request=request)
    return HttpResponse(html)

def redirectToHome(_):
    return redirect("/Home")
