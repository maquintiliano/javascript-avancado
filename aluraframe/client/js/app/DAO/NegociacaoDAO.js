class NegociacaoDAO{

    constructor(connection){

        this._connection = connection;
        this._store = 'negociacao';
    }

    adiciona(){

        return new Promise((resolve, reject) => {

            let request = this._connection.transaction([this._store], 'readwrite')
                                        .objectStore(this._store)
                                        .add(negociacao);
 
             request.onsuccess = e => {
                 resolve();
             };
 
             request.onerror = e => {
                console.log(e.target.result.error);
                reject('Não foi possivel realizar a integração.');
            
             };
        })
    }

    listaTodos(){
       
        let cursor = this._connection.transaction([this._store], 'readwrite')
                                        .objectStore(this._store)
                                        .openCursor();

        let negociacoes = [];

       //percorrendo o banco
        cursor.onsuccess = e => {

            //aponta pro 1º objeto dentro da objectStore
            let atual = e.target.result;

            if(atual) {
                
                var dado = atual.value; 
                
                negociacao.push(new Negociacao(dado._data,dado._quantidade,dado._valor));

                atual.continue();
            }else{
                resolve(negociacoes);
            }

        };

        cursor.onerror = e => {
            console.log(e.target.result.error);
            reject('Não foi possível listar as negociações');
        };
    }

    apagaTodos() {

        return new Promise((resolve, reject) => {
   
            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .clear();
   
            request.onsuccess = e => resolve('Negociações apagadas com sucesso');
   
            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível apagar as negociações');
            };
   
        });
    }    
}