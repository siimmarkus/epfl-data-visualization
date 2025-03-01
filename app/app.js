const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

const path = require('path');
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));