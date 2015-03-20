/**
 * Module dependencies.
 */

var http = require('http'),
    server = http.createServer(app),
    express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    user = require('./routes/users'),

    path = require('path'),
    EmployeeProvider = require('./employeeprovider').EmployeeProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

var employeeProvider = new EmployeeProvider('localhost', 27017);

//Routes

app.get('/', function(req, res) {
    employeeProvider.findAll(function(error, emps) {
        res.render('index', {
            title: 'Employees',
            employees: emps
        });
    });
});

app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res) {
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function(error, docs) {
        res.redirect('/')
    });
});

//update an employee
app.get('/employee/:id/edit', function(req, res) {
    employeeProvider.findById(req.param('_id'), function(error, employee) {
        res.render('employee_edit', {
            employee: employee
        });
    });
});

//save updated employee
app.post('/employee/:id/edit', function(req, res) {
    employeeProvider.update(req.param('_id'), {
        title: req.param('title'),
        name: req.param('name')
    }, function(error, docs) {
        res.redirect('/')
    });
});

//delete an employee
app.post('/employee/:id/delete', function(req, res) {
        employeeProvider.delete(req.param('_id'), function(error, docs) {
                res.redirect('/')
        });
});

// development only
if ('development' == app.get('env')) {
    app.set('mongodb_uri', 'mongo://localhost/dev');
}

// production only
if ('production' == app.get('env')) {
    app.set('mongodb_uri', 'mongo://localhost/prod');
}

app.listen(3000);
