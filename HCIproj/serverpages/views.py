from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
# Create your views here.

data = {}
data['home'] = 'none';
data['xpos'] = 

with open('data.txt', 'w') as outfile:
    json.dump(data, outfile)

pos = {}

def index(request):
    return HttpResponse('hello world')

def getPos(request):
    if request.method == 'GET':
        a = None
        with open('data.txt') as infile:
            a = json.load(infile)
        if a == {}:
            responseData = {}
            responseData['code'] = 400
            responseData['message'] = 'No Base Airport'
            
            response = HttpResponse(json.dumps(responseData),
            'application/json', 400)
            return response;
        else:
        

            return JsonResponse({'no':'no'})  

@csrf_exempt
def setHome(request, slug):
    if request.method == 'PUT':
        a = slug
        data = {}
        data['home'] = slug
        with open('data.txt', 'w') as outfile:
            json.dump(data, outfile)
        return JsonResponse(data)

