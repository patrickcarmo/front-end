function createDataset(fields, constraints, sortFields) {
  log.warn("--Dataset-- FLUIG010.js - 07/04/2017");

  var NOME_SERVICO = "wsConsultaSQL - SENAR";
  var CAMINHO_SERVICO = "br.com.totvs.br.WsConsultaSQL";
  var WS_CONSULTASQL = "FLUIG010";
  var DB_USUARIO = "mestre";
  var DB_SENHA = "707v5s3n4r"; // Senha SENAR
  //Carrega senhas    
  var dataset = DatasetFactory.getDataset("pswserver", null, new Array(), null);
  for (var i = 0; i < dataset.rowsCount; i++) {
    if ((dataset.getValue(i, "sistema") == "RM") && (dataset.getValue(i, "local") == "SENAR")) {
      var DB_USUARIO = (dataset.getValue(i, "user"));
      var DB_SENHA = (dataset.getValue(i, "psw"));
    }
  }

  //var SERVER_CONTEXTO = "CODCOLIGADA=1;";
  var CODCOLIGADA = "0"; // Se a consulta SQL estiver configurada como visível em todas as coligadas deve ser "0"
  var CODSISTEMA = "S"; // Código do sistema (S = Educacional, F = Financeiro, G = Geral ... etc)

  log.info("--Debbug-- (constraints != null): " + (constraints != null));
  log.info("--Debbug-- fields: " + fields);
  log.info("--Debbug-- sortFields: " + sortFields);

  var SQL_FILTRO = "INSTRUTOR=;LINHAACAO=;CODTURMA=;IDTURMADISC=;";
  var SQL_FILTRO_PADRAO = SQL_FILTRO;
  var SQL_VARS = JSON.parse(('{"' + SQL_FILTRO.replace(/=;/g, '": "", "') + '}').replace(', "}', '}'))
  var XML_TAG = "Resultado";

  if (constraints != null) {
    for (var c = 0; c < constraints.length; c++) {
      var field = constraints[c].fieldName
      var iniVal = constraints[c].initialValue
      var fimVal = constraints[c].finalValue
      var like = constraints[c].likeSearch
      var type = constraints[c].type


      SQL_VARS[field] = iniVal
      if ((SQL_VARS[field] === null) || (SQL_VARS[field] === undefined)) {
        SQL_VARS[field] = "";
      }
    }

    for (field in SQL_VARS) {
      if (SQL_VARS[field] !== undefined) {
        SQL_FILTRO = SQL_FILTRO.replace(field + "=;", field + "=" + SQL_VARS[field] + ";");
      }
    }
  }

  // Cria matriz de retorno Fluig
  var DATASET = DatasetBuilder.newDataset();
  // Define colunas de retorno .. a coluna "DS_RETORNO" serve para depuração e debug do Dataset em tempo de execução e retorno de mensagens 
  var columns = new Array("NOME",
    "EVENTO",
    "DTINICIAL",
    "DTFINAL",
    "IDTURMADISC",
    "CODTURMA",
    "ROTEIRO",
    "LOCALREL",
    "DESCRICAO",
    "OCUPACAO",
    "INSTRUTOR",
    "LINHAACAO");
  var rows = new Array();


  // Restrição de filtro que impede o retorno de todos os registros do banco de dados
  log.warn("--Debbug-- filtro: " + SQL_FILTRO);
  if (SQL_FILTRO == SQL_FILTRO_PADRAO) {
    var msg = "(0 linha(s) retornadas - filtro não selecionado)";
    log.error("--Debbug-- " + msg);

    for (var c = 0; c < columns.length; c++) {
      DATASET.addColumn(columns[c]);
      if (columns[c] == "DS_RETORNO") {
        rows.push(msg.toString());
      } else {
        rows.push("");
      }
    }
    DATASET.addRow(rows);
    return DATASET; // Retorno matriz de mensagem de busca vazia 
  }

  try {

    var servico = ServiceManager.getServiceInstance(NOME_SERVICO); // Código serviço cadastrado 
    //log.info("============Servico DATASET: " + servico);

    var instancia = servico.instantiate(CAMINHO_SERVICO); // Caminho pacote WSDataServer na visualizacao do servico	
    //log.info("============Instancia DATASET: " + instancia);

    var ws = instancia.getWsConsultaSQLSoap(); // Instancia Ws 	
    //log.info("============WS DATASET: " + ws);

    var result = ws.realizarConsultaSQLAuth(WS_CONSULTASQL, CODCOLIGADA, CODSISTEMA, DB_USUARIO, DB_SENHA, SQL_FILTRO); /* Roda o Ws */
    //log.info("============RESULT DATASET: " + result);

    var xmlResultados = new XML(result); // Converte o retorno em XML //


    for (var c = 0; c < columns.length; c++) {
      DATASET.addColumn(columns[c]);
    }

    /* Adiciona linhas com registros nas coluna*/
    for each(cc in xmlResultados[XML_TAG]) {
      rows = [];
      for (var c = 0; c < columns.length; c++) {
        if (columns[c] == "DS_RETORNO") {
          rows.push("");
        } else {
          rows.push(cc[columns[c]].toString());
        }
      }
      DATASET.addRow(rows);
    }

    log.info("--Debbug-- [" + DATASET.getRowsCount() + "] QTD xmlResultados retornado. ");

    return DATASET; // Retorno matriz com resultados 

  } catch (e) {
    if (e == null) {
      e = "Erro desconhecido; verifique o log do RM";
    }
    var msg = "Erro na comunicacao com o RM: " + e;
    log.error("--Debbug-- " + msg);

    for (var c = 0; c < columns.length; c++) {
      DATASET.addColumn(columns[c]);
      if (columns[c] == "DS_RETORNO") {
        rows.push(msg.toString());
      } else {
        rows.push("");
      }
    }
    DATASET.addRow(rows);
    return DATASET; // Retorno matriz de mensagem de erro 
  }
}