# Video site

Site where you can watch other people videos and add your own.
![video site images](https://i.imgur.com/AfpDhEw.gif)

## Futures

* User authentication, login, register
* Watching videos
* Commenting videos
* Like and dislike videos
* Adding videos
* Searching
* Editing user videos
* Editing user informations
* Liked videos
* Admin panel

## Technologies used

* Express.js
* React.js
* Firebase
* Dropbox (for storing videos)

## How to run locally

1. Download repository
```
$ git clone https://github.com/elosiktv/video.git
```
2. Go to app folder
```
$ cd video
```
3. Install dependencies for server and client
```
$ npm install
$ cd client
$ npm install
$ cd..
```
4. In `client/src/config/firebase.js` add your firebase project
5. In `./config/dropbox.js` add your dropbox project access token (Generate access token)
6. Run 
```
npm run dev
```
7. Everything should work now!
8. You can check working version here: https://immense-spire-59660.herokuapp.com/ (it works weird on heroku, uploading videos don't work);