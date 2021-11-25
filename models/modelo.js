const mongoose = require("mongoose");
const { Schema } = mongoose;

const ModeloSchema = new Schema(
  {
    Identificacion: { type:String },
    LocalPedido: { type:String },
    DetallePedido: { type:String },
    DistanciaKm: { type:String },
    Valor: { type:String },
    Propina: { type:String },
    Tipo_de_error: { type:String }

  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("Modelo", ModeloSchema);
