const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const path = require('path');
const os = require('os');
const app = express();
const bodyParser = require('body-parser');
const conn = require('./db/conn');
const Thought = require('./models/thoughts');
const User = require('./models/user');
const Message = require('./models/message')
const thoughtsRoutes = require('./routes/thoughtsRoutes');
const authRoutes = require('./routes/authRoutes');
const ThoughtController = require('./controllers/ThoughtsController');

// Configure Handlebars com runtime options
const hbs = exphbs.create({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function() {},
        path: path.join(os.tmpdir(), 'sessions'),
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}));

app.use(flash());
app.use(express.static('public'));

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/thoughts', thoughtsRoutes);
app.use('/', authRoutes);
app.get('/', ThoughtController.showThoughts);
app.get('/messages/:talk', async (req, res) => {
    const user1 = req.params.talk.split(' ')[0]
    const user2 = req.params.talk.split(' ')[1]
    const messages = await Message.findAll({where: {talkId:req.params.talk}});
    let update
    messages.forEach(msg => {
        if(msg){
        let formattedTime = msg.formattedTime
        let formattedDate = msg.formattedDate

        update += `<article class="msg-container msg-remote" id="msg-0">
          <div class="msg-box">
            <img class="user-img" id="user-0" src="//gravatar.com/avatar/00034587632094500000000000000000?d=retro" />
            <div class="flr">
              <div class="messages">
                <p class="msg" id="msg-0">
                  ${msg.content}
                </p>
              </div>
              <span class="timestamp"><span class="username">${msg.name}</span>&bull;<span class="posttime">${formattedTime} ${formattedDate}</span></span>
            </div>
          </div>
        </article>`;}
  })
  console.log(user1,user2)
  if(update){
  res.send(update.substring(9));
  }
  else{
    res.send(update)
  }
});
app.post('/messages', async (req, res) => {
    await Message.create(req.body)
  });

conn.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
