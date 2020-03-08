class View{

    constructor(elemento){
        this._elemento = elemento;
    }

    template(){

        throw new Error('O método template deve ser implementado');
    }

    update(model){
        
        //converte a string presente no template() em elemento do dom (no caso a div)
        this._elemento.innerHTML = this.template(model)
    }
}