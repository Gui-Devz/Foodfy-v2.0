<h1 align="center">Foodfy</h1>
<div align="center">
  <img src="https://user-images.githubusercontent.com/62578862/112757494-4b045500-8fc0-11eb-9d4b-c4afd079b0a6.png" height ="150" width="150">

</div>
<br>
<br>
<br>
<h2 align="center">
Web page about food recipes

</h2>

<p align="center">The project is all about learning technologies such as JS6, NodeJs, HMTL5 and CSS3 </p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  </a>
</p>

[//]: # "Add your gifs/images here:"

<div align="center" style="display: grid; grid-template-columns: 400px 400px; justify-content: center; align-items:center; gap: 10px">
  
  | | | |
|:-------------------------:|:-------------------------:|:-------------------------:|
|<img width="1604" alt="" src="https://i.imgur.com/3jRc4LC.gif">  blah |  <img width="1604" alt="" src="https://i.imgur.com/6HGeiHd.gif">|
|<img width="1604" alt="" src="https://user-images.githubusercontent.com/62578862/112757803-aaaf3000-8fc1-11eb-9f05-dcc9ff2f52f8.JPG">|<img width="1604" alt="" src="https://user-images.githubusercontent.com/62578862/112758271-cadfee80-8fc3-11eb-8123-9b1e7921abe2.JPG">

  

</div>

<hr />

## Features

[//]: # "Add the features of your project here:"

- 💹 **Node Js** — A JavaScript runtime
- 🔵 **Express** — A web framework for Node Js
- 💹 **PostgreSQL** — A DBMS well known and very reliable.
- 💹 **Express-session** — A lib that allows to work with sessions for different users using the app.
- 💹 **Nodemailer** — A lib that makes possible to send emails from the app.
- 💹 **bcryptJs** — A lib that helps us make the passwords of our users safer.
- 💹 **Multer** — A lib that helps us to handle images upload in an easier way.

## Getting started

First of all you'll need to install the NodeJs in your machine, if you are a Windows user I'd recommend to install via Chocolatey (If you're user of other OS search for the best way to install Nodejs in your case)

- Now, let's get started. Use the following commands on your terminal:

  > Second you need to know that the database management system being used is PostgreSQL.
  >
  > When you create the app's Database you'll have the user admin with password admin to make the first login.

    <div style="background-color: rgba(7, 7, 7, 0.17); padding: 20px;">
      <ol style="list-style-type: decimal;">
        <li>
          Use the command 'git clone https://github.com/Gui-Devz/Foodfy-v2.0.git'.
        </li><br>
        <li>
          Use the command 'npm ci' <a href="https://stackoverflow.com/a/48524475/13916618">(See here the advantages of using 'npm ci' instead of 'npm install')</a>
        </li><br>
        <li>
          Go to file 'foodfy_db.sql', there'll be the query to create the database and
          all the tables.
        </li><br>
        <li>
          After creating the database you'll have to configure the Pool for the postgres.
          You'll find the file in 'src/config/db.js' there you'll have to make sure the name of
          the DB and the port it's being connected is correct.
        </li><br>
        <li>
          You'll have to configure the 'nodemailer' lib as well, cause otherwise you won't be
          able to use the app properly.
        </li><br>
        <li>
          So, go to 'src/config/mailer.js', there you'll have to fill all the fields using the
          'SMTP Settings' that is given in the website <a href="https://mailtrap.io/">'mailtrap.io'</a>. Like shown in
          the image bellow.
          <br>
          <img style="object-fit: cover;" src="https://user-images.githubusercontent.com/62578862/112759260-94f13900-8fc8-11eb-8bd8-d249912000b2.png" height="400">
        </li><br>
        <li>
          And finally just start the app using the command 'npm start'.
        </li><br>
      </ol>
    </div>

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) page for details.
