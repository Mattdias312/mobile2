import * as SQLite from 'expo-sqlite';

async function CriaBanco() {
    //criar o banco de dados
    try {
        const db = await SQLite.openDatabaseAsync('fatecVotorantim.db');
        console.log('Banco de dados criado com sucesso');
        return db;
    } catch (error) {
        console.log('Erro ao criar o banco de dados', error);
    }
}

//-----------------------Tabela------------------------
async function CriaTabela(database: SQLite.SQLiteDatabase) {
    //criar a tabela
    try {
        
        await database.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS usuario (
                id_us INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_us VARCHAR(100),
                email_us VARCHAR(100)
            )`
        );
        console.log('Tabela criada com sucesso');
    } catch (error) {
        console.log('Erro ao criar a tabela', error);
    }
}

//-----------------------Inserir------------------------
async function InserirUsuario(database: SQLite.SQLiteDatabase,
     nome: string, email: string) {
    //inserir o usuario
    try {
        await database.runAsync(`
            INSERT INTO usuario (nome_us, email_us) VALUES (?, ?)`,
             nome, email);
        console.log('Usuario inserido com sucesso');
    } catch (error) {
        console.log('Erro ao inserir o usuario', error);
    }
}

//-----------------------Listar------------------------
async function ListarUsuario(database: SQLite.SQLiteDatabase) {
    //listar o usuario
    try {
        let arrayUsuarios = await database.getAllAsync(`SELECT * FROM usuario`);
        return arrayUsuarios;
    }
    catch (error) {
        console.log('Erro ao listar o usuario', error);
    }
}
//exportar a função
export { CriaBanco, CriaTabela, InserirUsuario, ListarUsuario };