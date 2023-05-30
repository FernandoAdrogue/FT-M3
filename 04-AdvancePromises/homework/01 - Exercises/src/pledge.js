'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor){
    if(typeof executor != "function") throw new TypeError("executor is not a function")
    this._state="pending"
    this._handlerGroups = []
    executor(this._internalResolve.bind(this),this._internalReject.bind(this))
}

$Promise.resolve = function(value){
    if (value instanceof $Promise){
        return value
        } else {
        return new $Promise(function(promiseResolve){
            promiseResolve(value)
        })
    }
}

$Promise.all = function(promiseGroups){
    if(!(promiseGroups instanceof Array)){
        throw TypeError ("Is not a Array")
    }
    if(promiseGroups.every(element=>!(element instanceof $Promise))){
        return this.resolve(promiseGroups)
    }else
        if(promiseGroups.every(element=> element instanceof $Promise)){
                   
           return this.resolve(promiseGroups.map(
                element=>element._value))
    }
    else{
        const valueGroups = []
        while(promiseGroups.length){
            const element = promiseGroups.shift()
            if(!(element instanceof $Promise)){
                valueGroups.push(element)
            } 
            else{
                valueGroups.push(element._value)
            }
        }
        this.resolve(valueGroups)
    }
}

$Promise.prototype._internalResolve = function(data){
    if(this._state === 'pending'){
        this._state = 'fulfilled'
        this._value = data
        this._callHandlers(this._value)
    }
}

$Promise.prototype._internalReject = function(reason){
    if(this._state === 'pending'){
        this._state = 'rejected'
        this._value = reason
        this._callHandlers(this._value)
    }
}

$Promise.prototype.then = function (successCb,errorCb) {
    
    if (typeof successCb !== "function") successCb  = false
    if (typeof errorCb !== "function") errorCb  = false
    
    const downstreamPromise = new $Promise(()=>{})
    this._handlerGroups.push(
        {
            successCb,
            errorCb,
            downstreamPromise
        }
        )
        
        if(this._state !== "pending") this._callHandlers(this._value)
        
        return downstreamPromise
    }
    
    $Promise.prototype.catch = function (errorCb){
        return this.then(null,errorCb)
    }
    
$Promise.prototype._callHandlers = function (value){
    while (this._handlerGroups.length) {
        const handler = this._handlerGroups.shift()
        if(this._state === 'fulfilled'){
            if(handler.successCb){
                try {
                    const result = handler.successCb(value)
                    if (result instanceof $Promise){
                        return result.then(
                            (data) => {handler.downstreamPromise._internalResolve(data)},
                            (reason) => {handler.downstreamPromise._internalReject(reason)}
                            )
                        } else {
                            handler.downstreamPromise._internalResolve(result)
                    }
                } catch (error) {
                    return handler.downstreamPromise._internalReject(error)
                }
            } else {
                return handler.downstreamPromise._internalResolve(value)
            }
        }
        if(this._state === 'rejected'){
            if(handler.errorCb){
                try {
                    const result = handler.errorCb(value)
                    if (result instanceof $Promise){
                        return result.then(
                            (data) => {handler.downstreamPromise._internalResolve(data)},
                            (reason) => {handler.downstreamPromise._internalReject(reason)}
                            )
                        } else {
                            handler.downstreamPromise._internalResolve(result)
                        }   
                    } catch (error) {
                        return handler.downstreamPromise._internalReject(error)
                    }
                }  else {
                    return handler.downstreamPromise._internalReject(value)
                }
            }
        }
    }

    module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
