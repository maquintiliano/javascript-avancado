class DateHelper{

    constructor(){
        throw new Error('DateHelper não pode ser instanciado')
    }

    static dataParaTexto(data){

        //utilizando interpolação com ${} em vez de concatenar
        return `${data.getDate()}
        /${data.getMonth()+1}
        /${data.getFullYear()}`;

    }
    
    static textoParaData(texto){

        //validação failfast com expressão regular (/\d/)
        // \d é qualquer dígito.
        if(!/\d{4}-\d{2}-\d{2}/.test(texto)){
            throw new Error('Deve estar no formato aaaa-mm-dd')
        }

        //gerar um array com a data usando split
        //as reticencias informam que o array deve ser desmembrado(1ª posição é o ano, 2ª é o mês e 3ª o dia) 
        return new Date(...texto.split('-').map((item,indice) => item - indice % 2));

    }

   

}