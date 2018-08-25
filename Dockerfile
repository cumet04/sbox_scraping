FROM python:3.7

RUN apt-get -yqq update && \
    apt-get -yqq install unzip && \
    apt-get -yqq install chromium && \
    apt-get -yqq install fonts-ipafont && \
    rm -rf /var/lib/apt/lists/*
# ipafont is for debug

RUN CHROMEDRIVER_VERSION=$(curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
    curl -OL http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip && \
    unzip chromedriver_linux64.zip -d /usr/local/bin && \
    chmod +x /usr/local/bin/chromedriver && \
    rm chromedriver_linux64.zip

ENV CHROME_BIN /usr/bin/chromium
ENV CHROME_DRIVER /usr/local/bin/chromedriver

RUN mkdir /app
WORKDIR /app

ADD requirements.txt ./
RUN pip install -r requirements.txt
