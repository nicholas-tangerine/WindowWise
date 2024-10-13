# acmhacks2024

## WindowWise
This project was conceptualized and developed in a 40 hour window.
Entry for UCSC's ACMHacks 2024 Hackathon.
Team members include Jonathan Uhler, Nicholas Tang, and Sean Goudie.

## Inspiration
As advocates for a sustainable future, we created WindowWise to help individuals reduce HVAC energy consumption by providing simple data on how to use natural cooling processes efficiently.

## What It Does
WindowWise lets you set temperature alerts by entering the current and preferred room temperatures. It uses atmospheric simulation to tell you how long to keep windows open, sending Discord or email reminders to close them, reducing the need for air conditioning.

# Frontend Setup

## Prerequisites

-    Python 3.10 or later (3.13 not supported yet)

## Installation

1. `cd` into working directory
2. Windows Users:
     - `pip install -r requirements.txt`
     - doesn't work?
          - try `pip3`
          - make sure python version is between 3.10 and 3.13
          - may require you to download C++ tools
3. Start the front end with `python front.py` or `python3 front.py`

# Backend API Setup

## Prerequisites

-   Node.js v20.17.0 or higher

## Installation

1. Clone the repository
2. Open the directory in terminal
3. Run `npm install` to install all dependencies
4. Rename .env.example to .env and fill in the necessary information
5. Run `npm start` to start the server
