exports.run = (client, message, args) => {
    require('child_process').exec(args.join(" "), (e, sto, ste) => {
        if(e){
            message.author.send(e.stack)
        }
        if(sto){
            message.channel.send(`STDOut - ${sto}`);
        }
        if(ste){
            message.channel.send(`STDErr - ${ste}`);
        }
        });
}