from django.shortcuts import redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.template.loader import render_to_string
from .predict_song_mood import *
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


def SMMR(request):
    html = render_to_string('SMMR.html', request=request)
    return HttpResponse(html)


def SMMR_results(request):
    song_name = request.POST.get('songName', '')
    artist_name = request.POST.get('artistName', '')

    spotify_search = song_name + ' ' + artist_name

    client_id = os.environ.get('CLIENT_ID')
    client_secret = os.environ.get('CLIENT_SECRET')

    song_mood = predict_song_mood(get_token(client_id, client_secret), spotify_search)

    context = {
        'song_name': song_name,
        'artist_name': artist_name,
        'song_mood': song_mood
    }
    html = render_to_string('SMMR_results.html', context=context, request=request)
    return HttpResponse(html)
