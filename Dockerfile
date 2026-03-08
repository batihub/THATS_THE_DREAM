FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    poppler-utils \
    tesseract-ocr \
    ghostscript \
    libreoffice \
    libgl1-mesa-glx \
    libglib2.0-0 \
    potrace \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /tmp/fileconvert/uploads /tmp/fileconvert/outputs

EXPOSE 8000