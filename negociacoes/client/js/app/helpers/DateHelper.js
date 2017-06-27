class DateHelper {

    constructor() {

        throw new Error('DateHelper não pode ser instanciado.')
    }

    //static invoco o método direto da classe, sem precisar estanciar a classe
    // Ex: let dateHelper = new DateHelper(); 
    // DateHelper.dataParaTexto(data);
    static dataParaTexto(data) {

        return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`
        /*
        return data.getDate() +
            '/' + (data.getMonth() + 1) +
            '/' + data.getFullYear();
        */
    }

    static textoParaData(texto) {
        
        if (!/\d{4}-\d{2}-\d{2}/.test(texto))
            throw new Error('Formato inválido. Deve ser yyyy-MM-dd.')
        return new Date(texto.split('-'));
        //return new Date(...texto.split('-').map((item, indice) => item - indice % 2));
    }
}