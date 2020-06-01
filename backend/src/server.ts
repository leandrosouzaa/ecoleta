import express from 'express'

const app = express();

app.get('/users', (req, res) => {
    return res.json({name: 'Leandro Ribeiro de Souza', email: 'leandror.dev@gmail.com'},)
})

app.listen(3333, () => {
    console.log('👷 Server Started on port 3333!')
})

