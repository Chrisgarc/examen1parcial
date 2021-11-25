const mongoose = require('mongoose');
const { MONGO_URI } = require("./config/index.model");
const axios = require("axios").default;
const cheerio = require("cheerio");
const cron = require("node-cron");
const express = require('express')
const hbs = require('express-handlebars')
var bodyParser = require('body-parser');

const conexion = MONGO_URI
const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
mongoose.connect(conexion, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const  Modelo  = require("./models/modelo");



server.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs'
}))

server.set('view engine', '.hbs')

server.listen(8080, ()=>{
  console.log(`Servidor corriendo en el puerto 8080`);
})


//Página estática 
server.get('/tabla',(req,res)=>{
  res.render('tabla')
 
})

// servicios REST
//post
server.post('/guardar',(req,res)=>{
  //recoger parametros de la peticion
  var params = req.body;  


  console.log(params)
      //crear objeto 
      

      var modelo = new Modelo();

      // asignar valores al modelo
      modelo.Identificacion = params.Identificacion;
      modelo.LocalPedido = params.LocalPedido;
      modelo.DetallePedido = params.DeatllePedido;
      modelo.DistanciaKm = params.DistanciaKm;
      modelo.Valor = params.Valor;
      modelo.Propina = params.Propina;
      modelo.Tipo_de_error = params.Tipo_de_error;

      modelo.save((err, modeloStored) => {
          if (err) {
              return res.status(500).send({
                  status: 'error',
                  message: "Error al guardar "
              });

          }
          if (!modeloStored) {
              return res.status(500).send({
                  status: 'error',
                  message: " no se ha guardado"
              });
          }
          // devolver respuesta
          return res.status(200).send({ status: 'success', modeloStored });

      }); // close save

    })


// get
server.get('/obtener',(req,res)=>{

  Modelo.find().exec((err, modelo) => {
      if (err) {
          return res.status(500).send({
              status: 'error',
              message: 'Error al hacer la consulta'

          });

      }
      if (modelo.length == 0) {
     
          return res.status(200).send({
              status: 'success',
              message: 'No hay contenido que mostrar'

          });

      }
      // devolver resultado 

      return res.status(200).send({
          status: 'success',
          modelo

      });
  });
})

//Cron Job    ---   cada 2minutos  2 * * * *
cron.schedule("* * * * * *", async () => { 
    console.log("Ejecutado correctamente!");
    const html = await axios.get("https://chrisgarc.github.io/tablapedido.github.io/tablas.html");
    const $ = cheerio.load(html.data);
    const titles = $("td");
    titles.each((index, element) => {
      const entrada = {
        Identificacion: $(element)
        .text()
        .toString(),
        LocalPedido: $(element)
        .text()
        .toString(),
        DetallePedido:  $(element)
        .text()
        .toString(),
        DistanciaKm:  $(element)
        .text()
        .toString(),
        Valor: $(element)
        .text()
        .toString(),
        Propina:  $(element)
        .text()
        .toString(),
      
    };
    Modelo.create([entrada]);
    // console.log("Guardado");

  });
});
