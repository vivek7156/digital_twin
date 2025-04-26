# Digital Twin Project

## Overview

The AI Twin Project (ADAM) aims to create an intelligent digital twin that mirrors human decision-making and problem-solving. It leverages real-time data processing, automation, and adaptive learning to enhance productivity across various domains. With multimodal interaction and scalability, ADAM can assist in research, healthcare, finance, and gaming. Its vision is to bridge human-AI collaboration for smarter, data-driven solutions

Team members - [Binit](https://github.com/Binit06) & [Aditya Singh Rawat]()

Check out the project - [Video](https://youtu.be/QkvPNXTvAgs)
## Project Structure

The project is organized into two main components:
 ```bash
  digital_twin/
  ├── server/                # Backend server components
  │   └── ml_model/          # Machine learning model components
  │       ├── data/          # Training and development datasets
  │       │   ├── devel.jsonl    # Development dataset
  │       │   ├── data.csv       # Additional training data
  │       │   └── post_processed/ # Processed data files
  │       └── model/         # Model training and inference code
  │           └── main.ipynb # Jupyter notebook for model development
  └── project/               # Frontend application (React + Vite)
 ```


## ML Model

The machine learning model is designed to:
1. Identify user intents (e.g., calendar_query, music_play, general_quirky)
2. Extract relevant entities (e.g., dates, person names, event names)
3. Map intents to appropriate actions

The model is trained on a variety of scenarios including:
- Calendar management (queries, scheduling, reminders)
- Music playback (songs, playlists, audiobooks)
- Email functionality
- IoT device control
- Weather queries
- General questions and jokes

## Frontend Application

The frontend is built with React and Vite, providing a modern and responsive user interface. The application communicates with the server to process user queries and display results.

### Setup

To set up the frontend development environment:

1. Navigate to the `project` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```


## Server

The server handles the processing of user queries, runs the ML model inference, and interfaces with various APIs and services to fulfill requests.

### Setup

To set up the server:

1. Navigate to the `server` directory
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   python app.py
   ```


## Development

- For model development, explore the Jupyter notebook at `server/ml_model/model/main.ipynb`
- For frontend modifications, work in the React application in the `project` directory
- The datasets in `server/ml_model/data` can be used to train and test intent recognition and entity extraction

## Features

- Natural language understanding
- Intent classification
- Entity extraction
- Calendar event management
- Email composition and queries
- Music playback control
- Smart device management
- General information and assistance

## License

This project is for educational and development purposes. See the license file for more details.
