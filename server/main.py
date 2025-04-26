import string
import re
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split

STOPWORDS = {...}

def pre_process(text):
    text = text.lower()
    text = text.translate(str.maketrans("", "", string.punctuation))
    words = re.findall(r'\b[a-zA-Z]{2,}\b', text)
    words = [word for word in words if word not in STOPWORDS]
    return " ".join(words)

files = ["programming.txt", "python_programming.txt", "chatting.txt", "gaming.txt", "devops.txt"]
data = []

for filepath in files:
    topic = filepath.split('/')[-1].split('.')[0]
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()
        cleaned_text = pre_process(text)
        data.append((cleaned_text, topic))

df = pd.DataFrame(data, columns=["Text", "Topic"])

X_train, X_test, y_train, y_test = train_test_split(df["Text"], df["Topic"], test_size=0.2, random_state=42)

model = make_pipeline(CountVectorizer(), MultinomialNB())

model.fit(X_train, y_train)

def predict_text_category(text):
    text = pre_process(text)
    probabilities = model.predict_proba([text])[0]
    categories = model.classes_
    
    rounded_scores = {cat: round(prob, 1) for cat, prob in zip(categories, probabilities)}
    
    return rounded_scores

new_text = """ Greetings from the I&E Cell,

The I&E Cell is elated to invite you to a standup show by Mr. Pranit More at 17:30 hrs.

The details of the event are as follows-
Venue: Manekshaw Hall
Date: 12 April, 2024
Time: 1730 hrs

While we are excited to bring a comedian on board, we request that you abide by the following instructions for the smooth conduction of the event:

Instructions:

Seating will begin at 5:20 PM and will close by 6:00 PM. Seating will be on a first-come, first-served basis due to the limited seats.


Recording of the show is strictly prohibited. If found, strict actions will be taken by the authorities.


Leaving the hall premises is prohibited for attendees during the show.


The decorum of the campus should be maintained at all times.

We hope that you will enjoy the show and also have fun while learning something new.

We eagerly anticipate seeing you at the event.

Regards,
Team I&E Cell


Get Outlook for Android <https://aka.ms/AAb9ysg>"""
category_scores = predict_text_category(new_text)
print(category_scores)
