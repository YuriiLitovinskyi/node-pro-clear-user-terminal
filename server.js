const Firebird = require('node-firebird');
const Confirm = require('prompt-confirm');

const question = new Confirm('Delete all messages from user terminal?');

const options = {
    host: '127.0.0.1',
    port: 3050,
    database: 'Danube',
    user: 'SYSDBA',
    password: 'idonotcare',
    lowercase_keys: false,
    role: null
};

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);        
    });
};

Firebird.attach(options, function(err, db){
    if(err) throw err;
    console.log('Connected to db successfully!\n\n');

    const countAllTerminalMessages = `SELECT COUNT(*) FROM process_events WHERE id > 0;`;

    const deleteAllTerminalMessages = `DELETE FROM process_events WHERE id > 0;`;

    db.query(countAllTerminalMessages, function(err, result){
        if(err) throw err;
        console.log(`Total messages in terminal: ${result && result[0].COUNT}\n`);
        
        question.ask(function(answer){
            if(answer){
                db.query(deleteAllTerminalMessages, async function(err, result){
                    if(err) throw err;
                    console.log('\nAll messages from terminal were removed from database successfully!');                   
                    db.detach();
                    await sleep(5000);
                });
            } else {
                db.detach();
            };
        });   
    });
});