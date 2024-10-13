from fasthtml.common import *
import requests

from dotenv import load_dotenv

load_dotenv()
app = FastHTML()

PORT_SERVER = os.getenv('PORT_SERVER')
POSTURL = f'https://localhost:{PORT_SERVER}/api/v1/submit'

@app.get('/')
def home():
  with open("index.html", "r", encoding = "utf-8") as f:
    content = f.read()
  return content

@app.get('/style.css')
def style():
  with open("style.css", "r", encoding = "utf-8") as f:
    content = f.read()
  return content

@app.get('/append')
def goHome():
  return home

@app.post('/append')
def formatPOST(discordUsername: str, email: str, currentTemp: str, targetTemp: str, college: str, roomType: str):
  global POSTURL
  
  college = college.title()
  roomType = roomType.lower()

  roomMap = {
    'single': 0,
    'double': 1,
    'triple': 2,
    'large triple': 3
  }

  d = {
    'discordUsername' : discordUsername,
    'email': email,
    'currentTemp': currentTemp,
    'targetTemp': targetTemp,
    'college': college,
    'roomType': roomMap[roomType]
  }
  print(d)

  requests.post(POSTURL, d)


  return home()

serve()
