const express = require('express');
const app = express();
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');

app.get('/producto', verificaToken, (req,res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
  
    Producto.find({disponible:true})
            .skip(desde)
            .limit(limite)
            .populate('usuario','nombre')
            .populate('categoria','descripcion')
            .exec((err, productos)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Producto.count({disponible:true},(err,count)=>{
                    res.json({
                        ok: true,
                        count,
                        productos
                    });
                });

            });
});

app.get('/producto/:id', verificaToken,(req,res)=>{

    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario','nombre')
            .populate('categoria','descripcion')
            .exec((err, producto)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    producto
                });

            });

});

app.get('/producto/buscar/:termino', verificaToken, (req,res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
  
    Producto.find({nombre: regex})
            .populate('categoria','descripcion')
            .exec((err, productos)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    count,
                    productos
                });

            });
});

app.post('/producto', verificaToken, (req,res)=>{

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });

});

app.put('/producto/:id', verificaToken, (req,res)=>{

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body,{new:true},(err, productoDB)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
        
    });

});

app.delete('/producto/:id',verificaToken, (req,res)=>{

    let id = req.params.id;

    let cambiaDisponibilidad = {
        disponible: false
    };


    Producto.findByIdAndUpdate(id,cambiaDisponibilidad,{new:true},(err, producto)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!producto){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });

    });

});

module.exports = app;