const express = require('express');
const app = express();
const { Pool } = require('pg');
const pool = new Pool({

  user: 'postgres',
  host: 'localhost',
  database: 'pool',
  password: '123456789',
  port: 5432,
  });

pool.connect()
pool.query("select *from aluno")
.then(results =>{
  const resultado = results.rows
  console.table(resultado)

})
.finally(() =>pool.end)

const port = process.env.PORT || 7000;

app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}.`);
});


app.post('/alunos',async (req, res) => {
  const { nome, cpf, plano } = req.body;

  const newAlun = await pool.query(
    'INSERT INTO aluno (nome, cpf, plano) VALUES ($1, $2, $3) RETURNING *',
    [nome, cpf, plano]
    );
    
    res.status(201).json(newAlun.rows[0]);
    });
  
  app.get('/alunos', async(req, res) => {
    const alunos = await pool.query('SELECT * FROM aluno');

    res.status(200).json(alunos.rows);
  });

  app.get('/alunos/:id', async (req, res) => {
    const { id } = req.params;
    
    const alun = await pool.query('SELECT * FROM aluno WHERE id = $1', [id]);
    
    if (alun.rows.length === 0) {
    res.status(404).json({ error: 'aluno não encontrado' });
    } else {
    res.status(200).json(alun.rows[0]);
    }
    });

app.put('/alunos/:id', async(req, res) => {
  const {id} = req.params;
  const { nome, cpf, plano} = req.body;

  const updatedAluno = await pool.query(
    'UPDATE aluno SET nome = $1, cpf = $2, plano = $3 WHERE id = $4 RETURNING *',
    [nome, cpf, plano, id]
    );
    
    if (updatedAluno.rows.length === 0) {
    res.status(404).json({ error: 'aluno não encontrado' });
    } else {
    res.status(200).json(updatedAluno.rows[0]);
    }
    });
    

// Excluir um aluno pelo id
app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  
  const deletedAluno = await pool.query('DELETE FROM aluno WHERE id = $1 RETURNING *', [id]);
  
  if (deletedAluno.rows.length === 0) {
  res.status(404).json({ error: 'aluno não encontrado' });
  } else {
  res.status(204).send();
  }
  });

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    });
  
