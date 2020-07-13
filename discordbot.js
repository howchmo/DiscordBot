var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

function rollD20()
{
	return Math.floor((Math.random()*20)+1);
}

function rollD6()
{
	return Math.floor((Math.random()*6)+1);
}


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
	colorize: true
});
logger.level = 'info';
logger.info("Initialize Discord Bot");
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
logger.info(auth.token);

bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('Logged in as: ');
	logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt)
{
	// Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `!`
	if (message.substring(0, 1) == '!')
	{
		var args = message.substring(1).split(' ');
		var cmd = args[0];
		args = args.splice(1);
		if( cmd.length > 0 )
		{
			var numberOf20Sided = cmd.charAt(0);
			var msg = "{[ ";
			for( i=0; i<numberOf20Sided; i++ )
			{
				if( i != 0 )
				msg += ", ";
				msg += rollD20();
			}
			msg += " ]";
			if( cmd.length > 1 )
			{
				msg += ", [ ";
				var numberOf6Sided = cmd.substring(1);
				for( i=0; i<numberOf6Sided; i++ )
				{
					if( i != 0 )
					msg += ", ";
					var d = rollD6();
					if( d == 1 || d == 2 )
								msg += ":boom:";
					else if( d == 3 || d == 4 )
								msg += ":black_large_square:";
					else if( d == 5 || d == 6 )
								msg += ":star:";
				}
				msg += " ]";
			}
			msg += "}";
	    bot.sendMessage({
				to: channelID,
				message: msg
			});
		}
	}
});

