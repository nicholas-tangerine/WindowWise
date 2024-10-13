from fasthtml.common import *
import requests

from dotenv import load_dotenv

load_dotenv()
app = FastHTML()

PORT = os.getenv('PORT_SERVER')
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
  page = Html(
    Head(Title("Welcome !")),
    Body(Main(
      Form(Input(type="text", name = "discordUsername", placeholder="discord username"),
           Input(type="text", name = "email", placeholder="email"),
           Input(type="text", name = "currentTemp", placeholder="current temperature (celsius)"),
           Input(type="text", name = "targetTemp", placeholder="preferred temperature (celsius)"),
           Input(type="text", name = "college", placeholder="college name (i.e. crown, stevenson, etc.)"),
           Input(type="text", name = "roomType", placeholder="room type (i.e. single, double, triple, large triple)"),
           Button("Submit"), 
           action="/append",
           method = "post")
    ))
  )
  return page

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
