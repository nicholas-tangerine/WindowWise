from fasthtml.common import *
import requests

from dotenv import load_dotenv

load_dotenv()
app = FastHTML()

PORT = os.getenv('PORT')
POSTURL = f'https://localhost:{PORT}/api/v1/submit'
POSTDATA = {
  'discordUsername': 'wqnderalone',
  'email': 'abc@abc.com',
  'currentTemp': '50',
  'targetTemp': '45',
  'college': 'Crown',
  'roomType': 3
}

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

  requests.post(POSTURL, d)

  return home()

serve()
