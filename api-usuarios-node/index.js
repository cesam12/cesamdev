const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const app = express();
app.use(bodyParser.json());

// initialize
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)');
});

app.get('/users', (req,res)=>{
  db.all('SELECT * FROM users', (err, rows)=>{
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/users', (req,res)=>{
  const {name,email} = req.body;
  db.run('INSERT INTO users (name,email) VALUES (?,?)', [name,email], function(err){
    if(err) return res.status(500).json({error:err.message});
    res.json({id: this.lastID, name, email});
  });
});

app.get('/users/:id', (req,res)=>{
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err,row)=>{
    if(err) return res.status(500).json({error:err.message});
    if(!row) return res.status(404).json({error:'Not found'});
    res.json(row);
  });
});

app.put('/users/:id', (req,res)=>{
  const {name,email} = req.body;
  db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name,email, req.params.id], function(err){
    if(err) return res.status(500).json({error:err.message});
    res.json({changes: this.changes});
  });
});

app.delete('/users/:id', (req,res)=>{
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err){
    if(err) return res.status(500).json({error:err.message});
    res.json({deleted: this.changes});
  });
});

app.listen(3000, ()=> console.log('API running on http://localhost:3000'));
