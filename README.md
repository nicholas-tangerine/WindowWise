# acmhacks2024

# WindowWise
This project was conceptualized and developed in a 40 hour window.
Entry for UCSC's ACMHacks 2024 Hackathon.
Team members include Jonathan Uhler, Nicholas Tang, and Sean Goudie.

## Inspiration
As advocates for a more sustainable future, we believe that excessive energy consumption from household climate control systems is a significant, yet easily preventable issue affecting millions of ordinary people. We were inspired to create WindowWise as a tool that provides individuals with easy-to-understand data about how they can responsibly utilize natural processes to their advantage.

## What It Does
WindowWise provides a simple interface to create temperature alerts. You enter the current temperature of a room, your preferred temperature, and through our atmospheric simulation, we tell you how long to keep your windows open to reach the desired temperature. You'll receive a Discord or email notification reminding you to close the windows when it's time. This allows you to limit your use of air conditioning systems, when your room can be cooled by the ambient air alone.

# Frontend Setup

## Prerequisites

-    Python 3.10 or later (3.13 not supported yet)

## Installation

1. `cd` into working directory
2. Windows Users:
     - `pip install -r requirements.txt`
3. Mac/Unix/Linux:
     - `pip3 install -r requirements.txt`
4. Start the front end with `python front.py` or `python3 front.py`

# Backend API Setup

## Prerequisites

-   Node.js v20.17.0 or higher

## Installation

1. Clone the repository
2. Open the directory in terminal
3. Run `npm install` to install all dependencies
4. Rename .env.example to .env and fill in the necessary information
5. Run `npm start` to start the server
