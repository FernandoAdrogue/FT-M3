const express = require("express");

let publications = [];
let lastId = 0
const server = express();

server.use(express.json());

server.post("/posts",(req,res)=>{
    const {author, title, contents} = req.body
    try{
        if(!author || !title || !contents)throw new TypeError("No se recibieron los parámetros necesarios para crear la publicación")
        const publication = {
            id:++lastId,
            author,
            title,
            contents
        }
        publications.push(publication)
        res.status(200).json({
            created: true,
            newPublication:publication
        })
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
})

server.get("/posts",(req,res)=>{
    const filtered = publications
    .filter(publication=>publication.author===req.query.author)
    .filter(publication=>publication.title===req.query.title)
    try{
        if(filtered.length === 0) throw new TypeError ("No existe ninguna publicación con dicho título y autor indicado")
        
        res.status(200).json(filtered)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }

})

server.get("/posts/:author",(req,res)=>{
    const filtered = publications.filter(publication=>publication.author===req.params.author)
    try{
        if(filtered.length=== 0)throw new Error("No existe ninguna publicación del autor indicado")
        res.status(200).json(filtered)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
})

server.put("/posts/:id",(req,res)=>{
    const {id} = req.params
    const {title, contents} = req.body
    try {
        if(!id || !title || !contents) throw new Error("NO_PARAMS")
        
        const target=publications.findIndex(publication=>publication.id===Number(id))
        if(target < 0) throw new Error ("NOT_FOUND")
        
            publications[target]={
            ...publications[target],
            title,
            contents
            }
        res.status(200).json(publications[target])
    }
    catch({message}){
       
        if(message==="NO_PARAMS")res.status(400).json({
            error:"No se recibieron los parámetros necesarios para modificar la publicación"
        })
       if(message==="NOT_FOUND")res.status(404).json({
            error:"No se recibió el id correcto necesario para modificar la publicación"
        })
    }

})

server.delete("/posts/:id",(req,res)=>{
    const {id}= req.params
    try{
        if(!id) throw new Error ("NO_ID")
        const target=publications.findIndex(publication=>publication.id===Number(id))
        if(target < 0) throw new Error ("NOT_FOUND")
        publications.splice(target,1)
        res.status(200).json({success:true})
    }
    catch({message}){
        if(message==="NO_ID")res.status(400).json({
            error:"No se recibió el id de la publicación a eliminar"
        })
       if(message==="NOT_FOUND")res.status(404).json({
            error:"No se recibió el id correcto necesario para eliminar la publicación"
        })
    }
})

//NO MODIFICAR EL CODIGO DE ABAJO. SE USA PARA EXPORTAR EL SERVIDOR Y CORRER LOS TESTS
module.exports = { publications, server };
