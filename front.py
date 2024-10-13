from fasthtml.common import *
import requests
import json
import re
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


def results(data):
  with open("result.html", "r", encoding = "utf-8") as f:
    content = f.read()

  if (isinstance(data, str)):
    content = re.sub("{{ time_left }}", data, content)
    content = re.sub("{{ final_temp }}", "", content)
    return content
    
  units: str = "second"
  time_left: int = data["time"]
  if (time_left > 60):
    units = "minute"
    time_left //= 60
    if (time_left > 60):
      units = "hour"
      time_left //= 60
  plurality: str = "" if time_left == 1 else "s"
  final_temp: float = int(9 / 5 * data["finalTemp"] + 32)

  content = re.sub("{{ time_left }}", f"{time_left} {units}{plurality}", content)
  content = re.sub("{{ final_temp }}", f"{final_temp} °F", content)
  return content


def failure(message: str):
  with open("error.html", "r", encoding = "utf-8") as f:
    content = f.read()
  return content


@app.post('/append')
def formatPOST(discordUsername: str, email: str, currentTemp: str, targetTemp: str, college: str, roomType: str):
  global POSTURL

  d = {
    'discordUsername' : discordUsername,
    'email': email,
    'currentTemp': currentTemp,
    'targetTemp': targetTemp,
    'college': college,
    'roomType': roomType
  }

  response: str = requests.post(POSTURL, d).content.decode("utf-8")
  response_json: dict = json.loads(response)
  if (not response_json["success"]):
    return results("Cannot reach target temperature.")
  return results(response_json["data"])

serve()
