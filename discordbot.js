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

var momentum = 12;
var threat = 7;

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
		var msg = "";
		var args = message.substring(1).split(' ');
		var cmd = args[0];
		args = args.splice(1);
		if( cmd.length > 0 )
		{
			if( isNaN(cmd.charAt(0)) )
			{
				if(cmd == "mt" )
				{
					msg = momentum+" momentum, "+threat+" threat";
				}
				else if( cmd.charAt(0) == "m" )
				{
					if( cmd.length == 1 )
					{
						msg = momentum+" momentum";
					}
					else if( cmd.charAt(1) == "=" )
					{
						momentum = Number(cmd.substring(2));
					}
					else if( cmd.charAt(1) == "+" )
					{
						momentum+= Number(cmd.substring(2));
					}
					else if( cmd.charAt(1) == "-" )
					{
						momentum-= Number(cmd.substring(2));
					}
					msg = momentum+" momentum";
				}
				else if( cmd.charAt(0) == "t" )
				{
					if( cmd.length == 1 )
					{
						msg = threat+" threat";
					}
					else if( cmd.charAt(1) == "=" )
					{
						threat = Number(cmd.substring(2));
					}
					else if( cmd.charAt(1) == "+" )
					{
						threat+= Number(cmd.substring(2));
					}
					else if( cmd.charAt(1) == "-" )
					{
						threat-= Number(cmd.substring(2));
					}
					msg = threat+" threat";
				}
				else if( cmd.charAt(0) == "c" )
				{
					if( cmd.length > 1 )
					{
						msg += "[ ";
						var numberOf6Sided = cmd.substring(1);
						var damages = 0;
						var effects = 0;
						for( i=0; i<numberOf6Sided; i++ )
						{
							if( i != 0 )
							msg += ", ";
							var d = rollD6();
							if( d == 1 )
							{
								damages++;
								msg += ":boom:";
							}
							else if( d == 2 )
							{
								damages+=2;
								msg += ":boom: :boom:";
							}
							else if( d == 3 || d == 4 )
								msg += ":black_large_square:";
							else if( d == 5 || d == 6 )
							{
								effects++;
								damages++;
								msg += ":star:";
							}
						}
						msg += " ]";
					}
					msg += "\n";
					if( damages != undefined && effects != undefined )
					{
						damageString = "damages";
						effectsString = "effects";
						if( damages < 2 )
							damageString = "damage";
						if( effects == 1 )
							effectsString = "effect";
						msg += "                               "+damages+" "+damageString+", "+effects+" "+effectsString;
					}
				}
			}
			else
			{
				var numberOf20Sided = cmd.charAt(0);
				msg += "[ ";
				for( i=0; i<numberOf20Sided; i++ )
				{
					if( i != 0 )
					msg += ", ";
					msg += rollD20();
				}
				msg += " ]";
			}
	    bot.sendMessage({
				to: channelID,
				message: msg
			});
		}
	}
});

