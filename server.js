const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

// Configuração do PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todolist',
    password: 'postgres',
    port: 5432,
});

app.use(cors());
app.use(express.json());

// Rota para buscar todas as tarefas
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar tarefas');
    }
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', async (req, res) => {
    const { description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (description) VALUES ($1) RETURNING *',
            [description]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar tarefa');
    }
});

// Rota para marcar uma tarefa como concluída
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE tasks SET completed = TRUE WHERE id = $1 RETURNING *',
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar tarefa');
    }
});

// Rota para deletar uma tarefa
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar tarefa');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});