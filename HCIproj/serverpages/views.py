from math import radians, degrees, cos, sin, asin, sqrt, atan2, pi
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
# Create your views here.

data = {}
data['home'] = 'none'
data['xpos'] = -112.42
data['ypos'] = 34.65167
data['alt'] = 5024
data['hdg'] = 207
data['kias'] = 0
data['time'] = 0

with open('data.txt', 'w') as outfile:
    json.dump(data, outfile)

def index(request):
    return render(request, 'index.html')

def getPos(request):
    if request.method == 'GET':
        a = None
        
        with open('data.txt') as infile:
            a = json.load(infile)
        
        if a['home'] == 'none':
            responseData = {}
            responseData['code'] = 400
            responseData['message'] = 'No Base Airport'
            
            response = HttpResponse(json.dumps(responseData),
            'application/json', 400)
            return response;
        else:
            # radius of earth in Nautical Miles
            R = 3440.1
            timeNow = datetime.now()
            lastTime = datetime.strptime(a['time'], '%c');
            timeDiff = timeNow - lastTime;
            timeDiffHrs = timeDiff.seconds / 3600
            speed = 80
            distance = speed * timeDiffHrs
            
            lat1 = radians(a['ypos'])
            lng1 = radians(a['xpos'])
            bearing = radians(a['hdg'])

            lat2 = asin(sin(lat1) * cos(distance / R) + cos(lat1) * sin(distance / R) * cos(bearing));
            lon2 = lng1 + atan2(sin(bearing) * sin(distance / R) * cos(lat1), cos(distance / R) - sin(lat1) * sin(lat2));

            if a['alt'] < 6000:
                a['alt'] + 150

            a['kias'] = speed
            a['ypos'] = degrees(lat2)            
            a['xpos'] = degrees(lon2)            

            return JsonResponse(a)  

@csrf_exempt
def setHome(request, slug):
    if request.method == 'PUT':
        a = None
        with open ('data.txt') as infile:
            a = json.load(infile)
        
        a['home'] = slug
        a['time'] = datetime.now().strftime("%c")
        
        with open('data.txt', 'w') as outfile:
            json.dump(a, outfile)
        
        return JsonResponse(a)

