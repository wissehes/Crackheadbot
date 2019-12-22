module.exports = (client, message) => {
    if(message.channel.id == '647468258756132891'){
        if(message.content.startsWith('**a6d**')){
            message.channel.send(`i dont care, a6d`)
        }
    }

    const checkCommand = (client, message) => {
    // Ignore all bots
    //if (message.author.bot) return;
  
    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(client.config.prefix) !== 0) return;
  
    // Our standard argument/command name definition.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);
  
    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;
  
    // Run the command
    cmd.run(client, message, args);
    }
    const checkWord = (client, message) => {
        // Ignore all bots
        //if (message.author.bot) return;
      
        // Ignore messages not starting with the prefix (in config.json)
        //if (message.content.indexOf(client.config.prefix) !== 0) return;
      
        // Our standard argument/command name definition.
        //const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const args = message.content.trim().split(/ +/g);
        const command = args.shift().toLowerCase();
      
        // Grab the command data from the client.commands Enmap
        const cmd = client.words.get(message.content.toLowerCase());
      
        // If that command doesn't exist, silently exit and do nothing
        if (!cmd) return;
      
        // Run the command
        cmd.run(client, message, args);
    }
    checkCommand(client, message)
    checkWord(client, message)
  };