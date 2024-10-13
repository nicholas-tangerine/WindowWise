from fasthtml.common import *
import requests

from dotenv import load_dotenv

load_dotenv()
app = FastHTML()

PORT_SERVER = os.getenv('PORT_SERVER')
POSTURL = f'http://localhost:{PORT_SERVER}/api/v1/submit'

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
def formatPOST(discordUsername, email, currentTemp, targetTemp, college, roomType):
  global POSTURL

  d = {
    'discordUsername' : discordUsername,
    'email': email,
    'currentTemp': currentTemp,
    'targetTemp': targetTemp,
    'college': college,
    'roomType': roomType
  }
  print(d)

  print(requests.post(POSTURL, d).content)


  return home()

serve()
