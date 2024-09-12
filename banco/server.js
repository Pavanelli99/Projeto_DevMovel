const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Habilitar CORS para permitir requisições de qualquer origem
app.use(cors({
  origin: '*',  // Permite qualquer origem. Pode-se restringir a origens específicas, como 'http://meu-app.com'
}));

app.use(bodyParser.json());

// Conecte ao MongoDB Atlas com a URI que você copiou
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://eduardosouza2:e12345@cluster0.uogvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB Atlas:', err));

  const equipamentoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    area: { type: String, required: true },
    hostname: { type: String, required: true },
    modelo: { type: String, required: true },
    informacoes: { type: String, required: false },
  });
  

const Equipamento = mongoose.model('Equipamento', equipamentoSchema);

app.post('/equipamentos', async (req, res) => {
  const equipamento = new Equipamento(req.body);
  await equipamento.save();
  res.status(201).send(equipamento);
});

app.get('/equipamentos', async (req, res) => {
  const equipamentos = await Equipamento.find();
  res.send(equipamentos);
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
