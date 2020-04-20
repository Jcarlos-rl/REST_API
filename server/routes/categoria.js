const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');
const { verificaAdmin_Role } = require('../middlewares/autenticacion');

app.get('/categoria', verificaToken, (req,res)=>{
  
    Categoria.find()
            .exec((err, categorias)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Categoria.count((err,count)=>{
                    res.json({
                        ok: true,
                        count,
                        categorias
                    });
                });

            });
});

app.get('/categoria/:id', verificaToken,(req,res)=>{

    let id = req.params.id;

    Categoria.findById(id)
            .exec((err, categoria)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    categoria
                });

            });

});

app.post('/categoria', verificaToken, (req,res)=>{

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});

app.put('/categoria/:id', verificaToken, (req,res)=>{

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body,{new:true},(err, categoriaDB)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
        
    });

});

app.delete('/categoria/:id',[verificaToken,verificaAdmin_Role], (req,res)=>{

    let id = req.params.id;

    Categoria.findByIdAndRemove(id,(err, categoria)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoria){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });

});

module.exports = app;